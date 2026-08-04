import React from 'react';
import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/components/mdx';
import { LLMCopyButton, ViewOptions } from '@/components/llm-copy-button';
import { SkillActions } from '@/components/SkillActions';
import { existsSync } from 'node:fs';
import path from 'node:path';
import openfrontProducts from '@/data/openfront-products.json';

export default async function ProductDocsPage(props: {
  params: Promise<{ product: string; slug?: string[] }>;
}) {
  const { product, slug } = await props.params;

  if (!['openfront', 'openship'].includes(product)) notFound();

  const page = source.getPage([product, ...(slug || [])]);
  if (!page) notFound();

  const MDX = (page.data as typeof page.data & { body: React.ComponentType<{ components?: unknown }> }).body;
  const fullSlug = [product, ...(slug || [])].join('/');
  const markdownUrl = `/api/source/${fullSlug}`;
  const indexSourcePath = `content/docs/${fullSlug}/index.mdx`;
  const sourcePath = existsSync(path.join(process.cwd(), indexSourcePath))
    ? indexSourcePath
    : `content/docs/${fullSlug}.mdx`;
  const githubUrl = `https://github.com/openshiporg/docs/blob/main/${sourcePath}`;
  const vertical = product === 'openfront' ? slug?.[0] : undefined;
  const verticalName = openfrontProducts.find((item) => item.id === vertical)?.name;
  const clientType = slug?.at(-1) === 'external-dashboard'
    ? 'dashboard'
    : slug?.at(-1) === 'external-storefront'
      ? 'storefront'
      : null;
  const skill = fullSlug === 'openfront/ecommerce/dashboard/custom'
    ? {
        url: '/skills/openfront-custom-dashboard/SKILL.md',
        copyLabel: 'Copy dashboard skill',
        title: 'Openfront Ecommerce custom dashboard skill',
      }
    : fullSlug === 'openfront/ecommerce/storefront/custom'
      ? {
          url: '/skills/openfront-custom-storefront/SKILL.md',
          copyLabel: 'Copy storefront skill',
          title: 'Openfront Ecommerce custom storefront skill',
        }
      : vertical && verticalName && clientType
        ? {
            url: `/skills/openfront-${vertical}-custom-${clientType}/SKILL.md`,
            copyLabel: `Copy ${clientType} skill`,
            title: `Openfront ${verticalName} custom ${clientType} skill`,
          }
        : null;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        enabled: page.data.toc.length > 0,
        style: 'clerk',
      }}
      tableOfContentPopover={{
        enabled: page.data.toc.length > 0,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      {skill ? (
        <SkillActions skillUrl={skill.url} copyLabel={skill.copyLabel} title={skill.title} />
      ) : (
        <div className="flex flex-row items-center gap-2 border-b pb-6 pt-2">
          <LLMCopyButton markdownUrl={markdownUrl} />
          <ViewOptions markdownUrl={markdownUrl} githubUrl={githubUrl} />
        </div>
      )}
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ product: string; slug?: string[] }>;
}) {
  const { product, slug } = await props.params;

  if (!['openfront', 'openship'].includes(product)) return {};

  const page = source.getPage([product, ...(slug || [])]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
