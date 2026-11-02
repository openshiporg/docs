import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contentRoot = path.join(root, 'content', 'docs');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  }));
  return files.flat();
}

function routeFor(file) {
  const relative = path.relative(contentRoot, file).replaceAll(path.sep, '/');
  const withoutExtension = relative.replace(/\.mdx$/, '');
  const slug = withoutExtension.endsWith('/index')
    ? withoutExtension.slice(0, -'/index'.length)
    : withoutExtension;
  return `/docs/${slug}`.replace(/\/$/, '');
}

function normalizeRoute(href) {
  const pathname = href.split(/[?#]/, 1)[0].replace(/\/$/, '');
  return pathname || '/';
}

const files = (await walk(contentRoot)).filter((file) => file.endsWith('.mdx'));
const validRoutes = new Set(files.map(routeFor));
const staticRoutes = new Set(['/', '/ethos', '/schema-visualizer', '/llms.txt', '/llms-full.txt']);
const failures = [];
const linkPattern = /(?:\]\(|href=["'])(\/[^\s"')<>]*)/g;

for (const file of files) {
  const contents = await readFile(file, 'utf8');
  for (const match of contents.matchAll(linkPattern)) {
    const href = match[1];
    if (!href.startsWith('/docs/') && !staticRoutes.has(normalizeRoute(href))) continue;

    const route = normalizeRoute(href);
    if (validRoutes.has(route) || staticRoutes.has(route)) continue;

    const line = contents.slice(0, match.index).split('\n').length;
    failures.push(`${path.relative(root, file)}:${line} -> ${href}`);
  }
}

if (failures.length > 0) {
  console.error(`Found ${failures.length} broken internal link(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${files.length} MDX files: all internal links resolve.`);
}
