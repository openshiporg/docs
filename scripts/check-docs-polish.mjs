import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { icons } from 'lucide-react';
import config from '../next.config.mjs';

const root = 'content/docs';
const errors = [];
const fail = (message) => errors.push(message);
async function walk(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  }))).flat();
}
const files = await walk(root);
const pages = new Map();
const metas = new Map();
const route = (file) => '/docs/' + path.relative(root, file).replace(/\.mdx$/, '').replace(/\/index$/, '');
for (const file of files) {
  const text = await readFile(file, 'utf8');
  if (file.endsWith('.mdx')) {
    const frontmatter = text.split('---', 3)[1] || '';
    const icon = frontmatter.match(/^icon: (.+)$/m)?.[1];
    if (!icon || !icons[icon]) fail(`${file}: missing or unknown lucide icon ${icon}`);
    if (!frontmatter.match(/^title: .+/m)) fail(`${file}: missing title`);
    const body = text.slice(text.indexOf('\n---', 4) + 4).trim();
    if (body.length < 20) fail(`${file}: empty body`);
    if (/\b(?:TODO:|TBD|lorem ipsum|coming soon)\b/.test(body)) fail(`${file}: unfinished copy`);
    if (/\/what-is-[^/]+\.mdx$/.test(file)) fail(`${file}: duplicate product introduction`);
    pages.set(file, { text, icon });
  } else if (file.endsWith('meta.json')) {
    const meta = JSON.parse(text);
    if (!meta.icon || !icons[meta.icon]) fail(`${file}: missing or unknown folder icon`);
    metas.set(path.dirname(file), meta);
  }
}
const referenced = new Set();
function resolveEntry(directory, entry) {
  const target = path.join(directory, entry);
  if (pages.has(target + '.mdx')) return [target + '.mdx'];
  if (pages.has(target + '/index.mdx')) return [target + '/index.mdx'];
  const folder = metas.get(target);
  if (folder) return folder.pages.flatMap((child) => resolveEntry(target, child));
  fail(`${directory}/meta.json: unresolved entry ${entry}`);
  return [];
}
for (const [directory, meta] of metas) {
  const used = new Map();
  for (const entry of meta.pages || []) {
    if (entry.startsWith('---')) continue;
    for (const file of resolveEntry(directory, entry)) {
      referenced.add(file);
      const icon = pages.get(file).icon;
      if (used.has(icon)) fail(`${directory}: repeated sibling icon ${icon} (${used.get(icon)}, ${file})`);
      used.set(icon, file);
    }
  }
  if (meta.root) {
    const sections = meta.pages.filter((entry) => entry.startsWith('---'));
    const order = ['---Overview---', '---Dashboard---', '---Storefront---', '---Integrations---', '---Features---', '---How-to Guides---', '---API Reference---'];
    if (sections.some((section, i) => !order.includes(section) || (i && order.indexOf(section) <= order.indexOf(sections[i - 1])))) fail(`${directory}: inconsistent section order`);
    if (meta.pages[1] !== 'index' || !meta.pages.includes('getting-started')) fail(`${directory}: overview/setup order`);
    for (let i = 0; i < meta.pages.length; i++) {
      if (meta.pages[i].startsWith('---') && (!meta.pages[i + 1] || meta.pages[i + 1].startsWith('---'))) fail(`${directory}: empty section`);
    }
  }
}
for (const file of pages.keys()) if (!referenced.has(file)) fail(`${file}: not reachable from sidebar metadata`);
const routes = new Set([...pages.keys()].map(route));
const redirects = await config.redirects();
for (const redirect of redirects) {
  if (!routes.has(redirect.destination)) fail(`${redirect.source}: redirect target missing`);
}
for (const [file, { text }] of pages) {
  for (const match of text.matchAll(/(?:\]\(|href=["'])(\/docs\/[^\s"')<>]*)/g)) {
    if (!routes.has(match[1].split(/[?#]/)[0].replace(/\/$/, ''))) fail(`${file}: broken or noncanonical link ${match[1]}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Docs polish: ${pages.size} pages, ${metas.size} metadata files; all sidebar entries reachable, valid unique sibling icons, canonical internal links, nonempty bodies/sections, ordered navigation, and ${redirects.length} valid redirects.`);
