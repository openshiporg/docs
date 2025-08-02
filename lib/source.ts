import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';
import { icons } from 'lucide-react';
import { createElement } from 'react';

// Filter docs and meta arrays based on file paths
const openfrontDocs = docs.docs.filter(doc => doc._file.path.startsWith('openfront/') && !doc._file.path.startsWith('openship/'));
const openfrontMeta = docs.meta.filter(meta => meta._file.path.startsWith('openfront/') && !meta._file.path.startsWith('openship/'));

const openshipDocs = docs.docs.filter(doc => doc._file.path.startsWith('openship/'));
const openshipMeta = docs.meta.filter(meta => meta._file.path.startsWith('openship/'));

// Openship removed

// Openfront source - only openfront content
export const openfrontSource = loader({
  baseUrl: '/docs/openfront',
  url(slugs, locale) {
    return '/docs/openfront/' + slugs.slice(1).join('/');
  },
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
  source: createMDXSource(openfrontDocs, openfrontMeta),
});

// Openship source - only openship content
export const openshipSource = loader({
  baseUrl: '/docs/openship',
  url(slugs, locale) {
    return '/docs/openship/' + slugs.slice(1).join('/');
  },
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
  source: createMDXSource(openshipDocs, openshipMeta),
});

// Openship removed

// Combined source (kept for backward compatibility)
export const source = loader({
  baseUrl: '/docs',
  url(slugs, locale) {
    return '/docs/' + slugs.join('/');
  },
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
  source: docs.toFumadocsSource(),
});

