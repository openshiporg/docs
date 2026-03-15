import { docs } from '../.source/server';
import { type InferPageType, loader, source as makeSource } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

const baseSource = docs.toFumadocsSource();
const allFiles = baseSource.files ?? [];

const openfrontFiles = allFiles.filter((file) => {
  const path = file.path ?? '';
  return path.startsWith('openfront/') && !path.startsWith('openship/');
});

const openshipFiles = allFiles.filter((file) => (file.path ?? '').startsWith('openship/'));

const openfrontVirtualSource = makeSource({
  pages: openfrontFiles.filter((file) => file.type === 'page'),
  metas: openfrontFiles.filter((file) => file.type === 'meta'),
});

const openshipVirtualSource = makeSource({
  pages: openshipFiles.filter((file) => file.type === 'page'),
  metas: openshipFiles.filter((file) => file.type === 'meta'),
});

export const openfrontSource = loader(openfrontVirtualSource, {
  baseUrl: '/docs/openfront',
  url(slugs) {
    return '/docs/openfront/' + slugs.slice(1).join('/');
  },
  plugins: [lucideIconsPlugin()],
});

export const openshipSource = loader(openshipVirtualSource, {
  baseUrl: '/docs/openship',
  url(slugs) {
    return '/docs/openship/' + slugs.slice(1).join('/');
  },
  plugins: [lucideIconsPlugin()],
});

export const source = loader(baseSource, {
  baseUrl: '/docs',
  url(slugs) {
    return '/docs/' + slugs.join('/');
  },
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.webp'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}\n\n${processed}`;
}
