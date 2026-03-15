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
  const githubUrl = `https://github.com/yourusername/docs-combined/blob/main/content/docs/${fullSlug}.mdx`;

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
      <div className="flex flex-row gap-2 items-center border-b pt-2 pb-6">
        <LLMCopyButton markdownUrl={markdownUrl} />
        <ViewOptions markdownUrl={markdownUrl} githubUrl={githubUrl} />
      </div>
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
