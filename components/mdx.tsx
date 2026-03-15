import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import * as icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IntroDiagram } from '@/components/IntroDiagram';
import { ShopDiagram } from '@/components/ShopDiagram';
import { ChannelDiagram } from '@/components/ChannelDiagram';
import { LinkDiagram } from '@/components/LinkDiagram';
import { MatchDiagram } from '@/components/MatchDiagram';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...(defaultMdxComponents as unknown as MDXComponents),
    ...(icons as unknown as MDXComponents),
    Button,
    IntroDiagram,
    ShopDiagram,
    ChannelDiagram,
    LinkDiagram,
    MatchDiagram,
    ...components,
  } as MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
