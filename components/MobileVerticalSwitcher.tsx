'use client';

import { CheckIcon, ChevronDownIcon, SearchIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogoIcon as OpenfrontLogoIcon } from '@/components/LogoIcon-openfront';
import { LogoIcon as OpenshipLogoIcon } from '@/components/LogoIcon';
import { cn } from '@/lib/utils';
import openfrontProducts from '@/data/openfront-products.json';

const preferredOrder = ['ecommerce', 'restaurant', 'gym', 'hotel', 'grocery'];
const openfrontOptions = [...openfrontProducts]
  .sort((a, b) => {
    const ai = preferredOrder.indexOf(a.id);
    const bi = preferredOrder.indexOf(b.id);
    if (ai !== -1 || bi !== -1) {
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    }
    return a.name.localeCompare(b.name);
  })
  .map((p) => ({
    url: p.href,
    title: p.id === 'ecommerce' ? 'E-commerce' : p.name,
    color: p.color,
  }));

const openshipOptions = [{ url: '/docs/openship/ecommerce', title: 'Ecommerce', color: '#f59e0b' }];

/** Phone-only: current vertical in the top bar, one tap to a bottom sheet listing every vertical. */
export function MobileVerticalSwitcher({ product }: { product: 'openfront' | 'openship' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const pathname = usePathname() ?? '';
  const router = useRouter();

  const options = product === 'openfront' ? openfrontOptions : openshipOptions;
  const selected =
    options.findLast((o) => pathname === o.url || pathname.startsWith(o.url + '/')) ?? options[0];
  const filtered = useMemo(
    () => options.filter((o) => o.title.toLowerCase().includes(query.trim().toLowerCase())),
    [options, query],
  );

  useEffect(() => {
    setOpen(false);
    setQuery('');
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const Logo = product === 'openfront' ? OpenfrontLogoIcon : OpenshipLogoIcon;

  return (
    <div className="min-w-0 flex-1 md:hidden">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Switch ${product} vertical, current ${selected.title}`}
        onClick={() => setOpen(true)}
        className="flex h-10 min-w-0 max-w-full items-center gap-2 rounded-lg px-2 text-sm font-medium outline-none hover:bg-fd-accent"
      >
        <span className="size-5 shrink-0">
          <Logo className="size-5" color={selected.color} />
        </span>
        <span className="truncate">{selected.title}</span>
        <ChevronDownIcon className="size-4 shrink-0 text-fd-muted-foreground" />
      </button>

      {open &&
        createPortal(
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Switch vertical">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[80dvh] flex-col rounded-t-2xl border-t bg-fd-background p-3 shadow-xl">
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-fd-muted p-1 text-sm font-medium">
              {(
                [
                  ['openfront', '/docs/openfront/ecommerce'],
                  ['openship', '/docs/openship/ecommerce'],
                ] as const
              ).map(([id, url]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => (id === product ? undefined : router.push(url))}
                  className={cn(
                    'h-10 rounded-md capitalize',
                    id === product ? 'bg-fd-background shadow-sm' : 'text-fd-muted-foreground',
                  )}
                >
                  {id}
                </button>
              ))}
            </div>
            {options.length > 6 && (
              <label className="mb-2 flex h-10 items-center gap-2 rounded-lg border px-3">
                <SearchIcon className="size-4 text-fd-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search verticals"
                  className="h-full min-w-0 flex-1 bg-transparent text-base outline-none"
                />
              </label>
            )}
            <div className="-mx-1 overflow-y-auto overscroll-contain px-1" role="menu">
              {filtered.map((o) => (
                <button
                  key={o.url}
                  type="button"
                  role="menuitem"
                  onClick={() => router.push(o.url)}
                  className="flex h-11 w-full items-center gap-3 rounded-lg px-2 text-left hover:bg-fd-accent"
                >
                  <span className="size-6 shrink-0 rounded-md p-1" style={{ backgroundColor: `${o.color}20` }}>
                    <Logo className="size-full" color={o.color} />
                  </span>
                  <span className="truncate text-sm font-medium">{o.title}</span>
                  <CheckIcon className={cn('ms-auto size-4 text-fd-primary', o.url !== selected.url && 'invisible')} />
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="p-3 text-sm text-fd-muted-foreground">No matching vertical.</p>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
