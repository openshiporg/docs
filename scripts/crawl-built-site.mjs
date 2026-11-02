import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, '.next', 'prerender-manifest.json');
const routesManifestPath = path.join(root, '.next', 'routes-manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const routesManifest = JSON.parse(await readFile(routesManifestPath, 'utf8'));
const port = Number(process.env.DOCS_CRAWL_PORT || 33_000 + (process.pid % 10_000));
const origin = `http://127.0.0.1:${port}`;
const generatedRoutes = Object.keys(manifest.routes)
  .filter((route) => route !== '/_global-error' && route !== '/_not-found');
const literalRedirectRoutes = routesManifest.redirects
  .map((redirect) => redirect.source)
  .filter((route) => !/[:*()]/.test(route));
const routesToCheck = [...new Set([...generatedRoutes, ...literalRedirectRoutes])].sort();

const server = spawn(process.execPath, [path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), 'start', '-p', String(port)], {
  cwd: root,
  env: { ...process.env, NODE_ENV: 'production' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverOutput = '';
server.stdout.on('data', (chunk) => { serverOutput += chunk; });
server.stderr.on('data', (chunk) => { serverOutput += chunk; });

function stopServer() {
  if (!server.killed) server.kill('SIGTERM');
}
process.on('SIGINT', () => {
  stopServer();
  process.exit(130);
});
process.on('exit', stopServer);

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Next server exited early.\n${serverOutput}`);
    try {
      const response = await fetch(origin, { redirect: 'manual' });
      if (response.status < 500) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${origin}.\n${serverOutput}`);
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'");
}

function visibleHtmlText(value) {
  return decodeHtml(value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function internalUrl(value, baseUrl) {
  const decoded = decodeHtml(value.trim());
  if (!decoded || /^(?:data:|mailto:|tel:|javascript:)/i.test(decoded)) return null;
  try {
    const url = new URL(decoded, baseUrl);
    return url.origin === origin ? url : null;
  } catch {
    return null;
  }
}

async function mapConcurrent(values, limit, work) {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      await work(values[index]);
    }
  });
  await Promise.all(workers);
}

const failures = [];
const responses = new Map();

async function load(url) {
  const key = url.href.split('#', 1)[0];
  if (!responses.has(key)) {
    responses.set(key, (async () => {
      const response = await fetch(key, { redirect: 'follow' });
      const contentType = response.headers.get('content-type') || '';
      const body = /(?:text|json|javascript|xml)/i.test(contentType) ? await response.text() : '';
      return { status: response.status, contentType, body, finalUrl: response.url };
    })());
  }
  return responses.get(key);
}

try {
  await waitForServer();

  await mapConcurrent(routesToCheck, 12, async (route) => {
    const url = new URL(route, origin);
    try {
      const result = await load(url);
      if (result.status !== 200) failures.push(`route ${route} returned ${result.status}`);
      else if (/text\/html/i.test(result.contentType)) {
        const visibleText = visibleHtmlText(result.body);
        if (/\b(?:Application error|Internal Server Error|404: This page could not be found)\b/i.test(visibleText)) {
          failures.push(`route ${route} rendered a visible error state`);
        }
      }
    } catch (error) {
      failures.push(`route ${route} failed: ${error.message}`);
    }
  });

  const pageEntries = [];
  for (const route of routesToCheck) {
    const url = new URL(route, origin);
    const result = await load(url);
    if (/text\/html/i.test(result.contentType)) {
      pageEntries.push({ route, url: new URL(result.finalUrl), body: result.body });
    }
  }

  const discovered = new Map();
  for (const page of pageEntries) {
    const attributePattern = /\b(?:href|src)=(["'])(.*?)\1/g;
    for (const match of page.body.matchAll(attributePattern)) {
      const url = internalUrl(match[2], page.url);
      if (!url) continue;
      const key = url.href;
      if (!discovered.has(key)) discovered.set(key, new Set());
      discovered.get(key).add(page.route);
    }
  }

  await mapConcurrent([...discovered.keys()], 12, async (href) => {
    const url = new URL(href);
    let result;
    try {
      result = await load(url);
    } catch (error) {
      failures.push(`internal resource ${url.pathname} failed: ${error.message}`);
      return;
    }
    if (result.status >= 400) {
      failures.push(`internal resource ${url.pathname}${url.search} returned ${result.status} (linked from ${[...discovered.get(href)].slice(0, 3).join(', ')})`);
      return;
    }
    if (url.hash && /text\/html/i.test(result.contentType)) {
      let anchor;
      try {
        anchor = decodeURIComponent(url.hash.slice(1));
      } catch {
        failures.push(`malformed anchor ${url.hash} on ${url.pathname}`);
        return;
      }
      if (!anchor) return;
      const ids = new Set([...result.body.matchAll(/\bid=(["'])(.*?)\1/g)].map((match) => decodeHtml(match[2])));
      if (!ids.has(anchor)) {
        failures.push(`missing anchor #${anchor} on ${url.pathname} (linked from ${[...discovered.get(href)].slice(0, 3).join(', ')})`);
      }
    }
  });

  if (failures.length > 0) {
    console.error(`Found ${failures.length} generated-site crawl problem(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`Crawled ${generatedRoutes.length} generated routes, ${literalRedirectRoutes.length} legacy redirects, and ${discovered.size} internal links/assets: no 404s, broken anchors, missing assets, or rendered error pages.`);
  }
} finally {
  stopServer();
  await new Promise((resolve) => {
    if (server.exitCode !== null) resolve();
    else server.once('exit', resolve);
  });
}
