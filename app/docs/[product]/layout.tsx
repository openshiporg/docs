import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { openfrontSource, openshipSource } from '@/lib/source';
import { LogoIcon as OpenfrontLogoIcon } from '@/components/LogoIcon-openfront';
import { LogoIcon as OpenshipLogoIcon } from '@/components/LogoIcon';
import { DocsNavTitle } from '@/components/DocsNavTitle';
import { notFound } from 'next/navigation';
import openfrontProducts from '@/data/openfront-products.json';

const preferredProductOrder = ['ecommerce', 'restaurant', 'gym', 'hotel', 'grocery'];
const orderedOpenfrontProducts = [...openfrontProducts].sort((left, right) => {
  const leftIndex = preferredProductOrder.indexOf(left.id);
  const rightIndex = preferredProductOrder.indexOf(right.id);
  if (leftIndex !== -1 || rightIndex !== -1) {
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  }
  return left.name.localeCompare(right.name);
});

function TabIcon({ color, product }: { color: string; product: 'openfront' | 'openship' }) {
  return (
    <div
      className="size-full rounded-lg max-md:border max-md:p-1.5 [&_svg]:size-full"
      style={{ color, backgroundColor: `${color}10` }}
    >
      {product === 'openfront' ? (
        <OpenfrontLogoIcon className="size-full" color={color} />
      ) : (
        <OpenshipLogoIcon className="size-full" />
      )}
    </div>
  );
}

export default async function Layout({ 
  children, 
  params 
}: { 
  children: ReactNode;
  params: Promise<{ product: string }>;
}) {
  const { product } = await params;
  
  // Validate product parameter
  if (!['openfront', 'openship'].includes(product)) {
    notFound();
  }

  // Get the appropriate source based on product
  const currentSource = product === 'openfront' ? openfrontSource : openshipSource;
  const sidebarTabs = product === 'openfront'
    ? [
        ...orderedOpenfrontProducts.map((item) => ({
          url: item.href,
          title: item.id === 'ecommerce' ? 'E-commerce' : item.name,
          icon: <TabIcon color={item.color} product="openfront" />,
        })),
      ]
    : [
        {
          url: '/docs/openship/ecommerce',
          title: 'Ecommerce',
          icon: <TabIcon color="#f59e0b" product="openship" />,
        },
      ];

  return (
    <DocsLayout
      {...baseOptions}
      nav={{
        ...baseOptions.nav,
        title: () => <DocsNavTitle product={product as 'openfront' | 'openship'} />,
        url: undefined,
      }}
      tree={currentSource.pageTree}
      sidebar={{
        tabs: sidebarTabs,
      }}
    >
      {children}
    </DocsLayout>
  );
}