'use client';

import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
});

const sectionsByProduct = {
  openfront: [
    {
      url: '/docs/openfront/ecommerce',
      title: 'Ecommerce',
      description: 'Open-source e-commerce platform',
    },
    {
      url: '/docs/openfront/restaurant',
      title: 'Restaurant',
      description: 'Restaurant ordering and operations',
    },
    {
      url: '/docs/openfront/grocery',
      title: 'Grocery',
      description: 'Grocery storefront platform',
    },
    {
      url: '/docs/openfront/hotel',
      title: 'Hotel',
      description: 'Hotel booking platform',
    },
    {
      url: '/docs/openfront/dealership',
      title: 'Dealership',
      description: 'Vehicle dealership platform',
    },
    {
      url: '/docs/openfront/hospital',
      title: 'Hospital',
      description: 'Hospital digital platform',
    },
    {
      url: '/docs/openfront/gym',
      title: 'Gym',
      description: 'Gym and membership platform',
    },
  ],
  openship: [
    {
      url: '/docs/openship/ecommerce',
      title: 'Ecommerce',
      description: 'Multi-channel fulfillment docs',
    },
  ],
} as const;

export function DocsSectionSwitcher({ product }: { product: 'openfront' | 'openship' }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const options = sectionsByProduct[product];

  const selected = useMemo(() => {
    return options.findLast((item) => {
      return pathname === item.url || pathname.startsWith(item.url + '/');
    }) ?? options[0];
  }, [options, pathname]);

  return (
    <div
      className="relative shrink-0 max-md:flex md:hidden"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={cn(
          'flex items-center gap-1.5 hover:opacity-80 transition-opacity outline-none rounded-lg text-sm text-fd-foreground',
          spaceGrotesk.className
        )}
        type="button"
      >
        <span className="text-fd-muted-foreground text-base leading-none">|</span>
        <span className="font-medium">{selected.title}</span>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 z-50 min-w-56 overflow-hidden rounded-lg border bg-background p-1 shadow-lg">
            {options.map((item) => {
              const isActive = item.url === selected.url;
              return (
                <button
                  key={item.url}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(item.url);
                    setOpen(false);
                  }}
                  className="flex w-full items-start gap-2 rounded-lg p-2 hover:bg-accent hover:text-accent-foreground text-left"
                >
                  <div className="min-w-0">
                    <div className={cn('font-medium text-sm', spaceGrotesk.className)}>{item.title}</div>
                    <div className="text-xs text-fd-muted-foreground">{item.description}</div>
                  </div>
                  <CheckIcon className={cn('ms-auto mt-0.5 size-3.5 text-primary', !isActive && 'invisible')} />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
