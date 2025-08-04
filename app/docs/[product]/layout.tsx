import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { openfrontSource, openshipSource } from '@/lib/source';
import { LogoIcon as OpenfrontLogoIcon } from '@/components/LogoIcon-openfront';
import { LogoIcon as OpenshipLogoIcon } from '@/components/LogoIcon';
import { DocsSwitcher } from '@/components/DocsSwitcher';
import { notFound } from 'next/navigation';

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

  return (
    <DocsLayout
      {...baseOptions}
      nav={{
        ...baseOptions.nav,
        title: <DocsSwitcher />,
      }}
      tree={currentSource.pageTree}
      sidebar={{
        tabs: {
          transform(option, node) {
            const meta = currentSource.getNodeMeta(node);
            if (!meta) return option;

            const verticalColors: Record<string, string> = product === 'openfront' ? {
              ecommerce: '#6366f1',    // indigo-500
              restaurant: '#f59e0b',   // amber-500  
              grocery: '#10b981',      // green-500
              hotel: '#ec4899',        // pink-500
              dealership: '#ef4444',   // red-500
              hospital: '#06b6d4',     // cyan-500
              gym: '#d946ef',          // fuchsia-500
            } : {
              ecommerce: '#f59e0b',     // amber-500 for Openship
            };

            // Extract the vertical from the path - first segment after product
            const pathSegments = meta.path.split('/');
            // For openfront/{vertical}/... structure, get the second segment
            const vertical = pathSegments[1] || pathSegments[0];
            const color = verticalColors[vertical] || (product === 'openfront' ? '#6366f1' : '#f59e0b');
            const LogoComponent = product === 'openfront' ? OpenfrontLogoIcon : OpenshipLogoIcon;

            return {
              ...option,
              icon: (
                <div
                  className="[&_svg]:size-full rounded-lg size-full max-md:border max-md:p-1.5"
                  style={
                    {
                      color: color,
                      backgroundColor: `${color}10`,
                    } as object
                  }
                >
                  <LogoComponent className="size-full" color={color} />
                </div>
              ),
              description: option.description,
            };
          },
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}