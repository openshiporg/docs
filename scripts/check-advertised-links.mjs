import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const products = JSON.parse(await readFile(path.join(root, 'data', 'openfront-products.json'), 'utf8'));
const checks = new Map();
const placeholders = new Set();
// Owner-confirmed pending targets. Keep probing and printing each one; only
// the documented failure is pending, not arbitrary errors on these origins.
const privateRepositories = new Set([
  'openfront-uikit', 'openfront-scheduling', 'openfront-social',
  'openfront-financial', 'analytics', 'openfront-sports-agents',
].map((name) => `https://github.com/openshiporg/${name}`));
const pendingDomain = 'https://uikit.openship.org';
const pending = [];

function addGet(url) {
  if (!url) return;
  const normalized = url.replace(/[.,;:]$/, '');
  // Documentation examples use interpolated URLs, single-label hosts, or
  // your-* hosts. Never send network requests to those example destinations.
  if (normalized.includes('${')) {
    placeholders.add(normalized);
    return;
  }
  const hostname = new URL(normalized).hostname;
  if (!hostname.includes('.') || hostname.startsWith('your-')) {
    placeholders.add(normalized);
    return;
  }
  checks.set(normalized, { method: 'GET' });
}

for (const url of [
  'https://github.com/openshiporg/openship',
  'https://marketplace.openship.org',
  'https://marketplace.openship.org/ethos',
  'https://openship.org',
]) addGet(url);

for (const product of products) {
  addGet(product.sourceUrl);
  addGet(product.catalogUrl);
}

async function collectAdvertisedUrls(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectAdvertisedUrls(fullPath);
    } else if (/\.(md|mdx|tsx)$/.test(entry.name)) {
      const contents = await readFile(fullPath, 'utf8');
      const patterns = [
        /\]\((https:\/\/[^\s)<>]+)\)/g,
        /\b(?:href|src)=["'](https:\/\/[^"'<>]+)["']/g,
      ];
      for (const pattern of patterns) {
        for (const match of contents.matchAll(pattern)) addGet(match[1]);
      }
    }
  }
}

await collectAdvertisedUrls(path.join(root, 'content'));
await collectAdvertisedUrls(path.join(root, 'app'));
await collectAdvertisedUrls(path.join(root, 'components'));
await collectAdvertisedUrls(path.join(root, 'public', 'skills'));

const demoChecks = [
  ['https://docs.openship.org/api/demo/channel/search-products', { platform: { accessToken: 'demo_token' }, searchEntry: '', after: null }],
  ['https://docs.openship.org/api/demo/channel/get-product', { platform: { accessToken: 'demo_token' }, productId: 'tablet001', variantId: 'white' }],
  ['https://docs.openship.org/api/demo/channel/create-purchase', { platform: { accessToken: 'demo_token' }, cartItems: [{ productId: 'keyboard001', variantId: 'blue-switch', name: 'Keyboard', price: '89.99', quantity: 1 }], shipping: { firstName: 'Docs', lastName: 'Check' }, notes: 'Synthetic docs endpoint check' }],
  ['https://docs.openship.org/api/demo/channel/create-webhook', { platform: { accessToken: 'demo_token' }, endpoint: 'https://example.invalid/openship-doc-check', events: ['TRACKING_CREATED'] }],
  ['https://docs.openship.org/api/demo/shop/search-products', { platform: { accessToken: 'demo_token' }, searchEntry: '', after: null }],
  ['https://docs.openship.org/api/demo/shop/get-product', { platform: { accessToken: 'demo_token' }, productId: 'headphones001', variantId: 'black' }],
  ['https://docs.openship.org/api/demo/shop/search-orders', { platform: { accessToken: 'demo_token' }, searchEntry: '', after: null }],
  ['https://docs.openship.org/api/demo/shop/update-product', { platform: { accessToken: 'demo_token' }, productId: 'headphones001', variantId: 'black', inventory: 42 }],
];
for (const [url, body] of demoChecks) checks.set(url, { method: 'POST', body });

const failures = [];
for (const [url, request] of checks) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, {
      method: request.method,
      body: request.body ? JSON.stringify(request.body) : undefined,
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'openship-docs-link-check/1.0',
        ...(request.body ? { 'content-type': 'application/json' } : {}),
      },
    });
    const finalUrl = response.url || url;
    if (response.status === 404 && request.method === 'GET' && privateRepositories.has(url) && finalUrl === url) {
      pending.push(`${url} — private openshiporg repository; anonymous HTTP 404; publication/access is the owner's decision`);
    } else if (!response.ok) failures.push(`${response.status} ${request.method} ${url}${finalUrl !== url ? ` -> ${finalUrl}` : ''}`);
    else if (!finalUrl.startsWith('https://')) failures.push(`insecure redirect ${url} -> ${finalUrl}`);
    else console.log(`${response.status} ${request.method} ${url}${finalUrl !== url ? ` -> ${finalUrl}` : ''}`);
    await response.body?.cancel();
  } catch (error) {
    if (url === pendingDomain && ['ENOTFOUND', 'EAI_NONAME'].includes(error.cause?.code)) {
      pending.push(`${url} — missing DNS; ${error.cause.code}; domain/deployment restoration pending`);
    } else failures.push(`${error.name}: ${request.method} ${url} (${error.cause?.code || error.message})`);
  } finally {
    clearTimeout(timeout);
  }
}

for (const url of placeholders) console.log(`SKIP-PLACEHOLDER ${url}`);
for (const target of pending) console.log(`KNOWN-PENDING ${target}`);
console.log(`Summary: ${checks.size} probed, ${placeholders.size} placeholder(s) skipped, ${pending.length} known-pending, ${failures.length} unexpected failure(s).`);

if (failures.length > 0) {
  console.error(`Found ${failures.length} unavailable advertised URL(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${checks.size} advertised links, external images, product/source URLs, and demo API endpoints with redirects enabled.`);
}
