'use client';

import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import openfrontProducts from '@/data/openfront-products.json';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
});

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

const sectionsByProduct = {
  openfront: [
    ...orderedOpenfrontProducts.map((product) => ({
      url: product.href,
      title: product.id === 'ecommerce' ? 'E-commerce' : product.name,
    })),
  ],
  openship: [
    {
      url: '/docs/openship/ecommerce',
      title: 'Ecommerce',
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
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <button
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((previous) => !previous);
        }}
        className={cn(
          'flex items-center gap-1.5 rounded-lg text-sm text-fd-foreground outline-none transition-opacity hover:opacity-80',
          spaceGrotesk.className
        )}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="text-base leading-none text-fd-muted-foreground">|</span>
        <span className="font-medium">{selected.title}</span>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full z-50 mt-2 max-h-[70vh] w-56 max-w-[calc(100vw-1rem)] overflow-y-auto overscroll-contain rounded-lg border bg-background p-1 shadow-lg"
            role="menu"
          >
            {options.map((item) => {
              const isActive = item.url === selected.url;
              return (
                <button
                  key={item.url}
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(item.url);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-accent hover:text-accent-foreground"
                  role="menuitem"
                >
                  <span className={cn('text-sm font-medium', spaceGrotesk.className)}>{item.title}</span>
                  <CheckIcon className={cn('ms-auto size-3.5 text-primary', !isActive && 'invisible')} />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
