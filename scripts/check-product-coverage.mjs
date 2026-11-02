import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = path.join(root, 'content/docs/openfront');
const failures = [];
const fail = (message) => failures.push(message);
const read = (filename) => readFile(path.join(root, filename), 'utf8');
async function exists(filename, label = filename) {
  try { await access(path.join(root, filename)); }
  catch { fail(`${label}: missing ${filename}`); }
}
async function walk(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(filename) : [filename];
  }))).flat();
}

// The committed content tree is the coverage inventory. No sibling checkout,
// historical public-product allowlist, or manually synchronized product count.
const expectedIds = (await readdir(docsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name).sort();
const products = JSON.parse(await read('data/openfront-products.json'));
const actualIds = products.map((product) => product.id);
if (new Set(actualIds).size !== actualIds.length) fail('Product catalog has duplicate ids');
if (JSON.stringify([...actualIds].sort()) !== JSON.stringify(expectedIds)) {
  fail(`Catalog/tree membership mismatch: tree ${expectedIds.join(', ')}; catalog ${actualIds.join(', ')}`);
}
for (const product of products) {
  if (product.href !== `/docs/openfront/${product.id}`) fail(`${product.id}: invalid docs href`);
  if (!product.name || !product.description || !/^#[\da-f]{6}$/i.test(product.color)) fail(`${product.id}: name, description and hex color required`);
  // Public repository names can differ from local folder names (for example
  // analytics and coffee-shop); validate identity syntax, not an invented map.
  if (!/^[\w-]+$/.test(product.repository || '')) fail(`${product.id}: repository identity required`);
  if (product.sourceUrl && !/^https:\/\/github\.com\/openshiporg\/[\w.-]+$/.test(product.sourceUrl)) fail(`${product.id}: invalid source URL`);
  if (product.catalogUrl && !/^https:\/\/openship\.org\/products\/[\w-]+$/.test(product.catalogUrl)) fail(`${product.id}: invalid catalog URL`);
}
const sections = ['---Overview---', '---Dashboard---', '---Storefront---', '---Integrations---', '---Features---', '---How-to Guides---', '---API Reference---'];
const subjects = [
  ['architecture/schema', /\b(?:architecture|schema|data model)\b/i],
  ['operator surfaces', /\b(?:operator|staff|dashboard)\b/i],
  ['workflow/lifecycle', /\b(?:workflows?|lifecycles?)\b/i],
  ['API/commands', /\b(?:GraphQL|command|mutation|projection)\b/i],
  ['tenancy/ownership', /\b(?:tenant|tenancy|ownership|owned|scoped?|single-store|single-property|organization|workspace membership|independent|merchant|stateless)\b/i],
  ['setup', /\b(?:onboarding|setup|install)\b/i],
  ['integrations', /\b(?:integration|adapter|provider)\b/i],
  ['deployment', /\bdeploy(?:ment|ed|ing)?\b/i],
];
for (const id of expectedIds) {
  const relative = `content/docs/openfront/${id}`;
  for (const filename of ['index.mdx', 'meta.json', 'getting-started.mdx']) await exists(`${relative}/${filename}`, id);
  try {
    const meta = JSON.parse(await read(`${relative}/meta.json`));
    if (meta.root !== true || !Array.isArray(meta.pages) || meta.pages[1] !== 'index') fail(`${id}: product root must begin with overview/index`);
    const present = meta.pages.filter((entry) => entry.startsWith('---'));
    if (present.some((section, i) => !sections.includes(section) || (i && sections.indexOf(section) <= sections.indexOf(present[i - 1])))) fail(`${id}: incorrect section order`);
    for (const required of sections.slice(0, 3)) if (!present.includes(required)) fail(`${id}: missing ${required}`);
  } catch (error) { fail(`${id}: invalid metadata (${error.message})`); }
  const files = (await walk(path.join(docsRoot, id))).filter((filename) => filename.endsWith('.mdx'));
  const text = (await Promise.all(files.map((filename) => readFile(filename, 'utf8')))).join('\n');
  if ((text.match(/\b[\w'-]+\b/g)?.length || 0) < 500) fail(`${id}: documentation is not substantive`);
  for (const [label, pattern] of subjects) if (!pattern.test(text)) fail(`${id}: missing ${label} coverage`);
  const guides = id === 'ecommerce' ? ['dashboard/custom', 'storefront/custom'] : ['external-dashboard', 'external-storefront'];
  for (const guide of guides) await exists(`${relative}/${guide}.mdx`, id);
  for (const type of ['dashboard', 'storefront']) {
    const filename = `public/skills/openfront-${id === 'ecommerce' ? '' : `${id}-`}custom-${type}/SKILL.md`;
    try {
      const skill = await read(filename);
      for (const heading of ['## Source orientation to explain first', '## Then interview the user']) if (!skill.includes(heading)) fail(`${filename}: missing ${heading}`);
    } catch (error) { fail(`${filename}: ${error.message}`); }
  }
}
for (const filename of ['app/(home)/page.tsx', 'app/docs/[product]/layout.tsx', 'components/MobileVerticalSwitcher.tsx', 'components/product-config.tsx']) {
  if (!(await read(filename)).includes('openfront-products.json')) fail(`${filename}: must derive product coverage from local catalog`);
}
for (const directory of ['content', 'app', 'components']) for (const filename of await walk(path.join(root, directory))) {
  if (!/\.(mdx|tsx)$/.test(filename)) continue;
  const text = await readFile(filename, 'utf8');
  if (/\b(?:is|are|ships as|provides)\s+(?:fully\s+)?(?:HIPAA|PCI(?: DSS)?|SOC ?2|GDPR)[ -]?(?:compliant|certified)\b/i.test(text)) fail(`${filename}: unsupported compliance claim`);
}
// Openship is a separate routing product, not an Openfront catalog entry.
for (const filename of ['index.mdx', 'meta.json', 'getting-started.mdx']) await exists(`content/docs/openship/ecommerce/${filename}`, 'Openship');
if (failures.length) {
  console.error(`Found ${failures.length} product coverage problem(s):\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exitCode = 1;
} else console.log(`Checked all ${expectedIds.length} Openfront product roots and Openship: catalog membership, navigation, setup, substantive content, custom-client guides/skills, and public compliance copy agree.`);
