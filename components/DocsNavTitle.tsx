'use client';

import { DocsHomeButton } from '@/components/DocsHomeButton';
import { DocsSwitcher } from '@/components/DocsSwitcher';
import { MobileVerticalSwitcher } from '@/components/MobileVerticalSwitcher';

export function DocsNavTitle({ product }: { product: 'openfront' | 'openship' }) {
  return (
    <div className="flex min-w-0 w-full items-center">
      {/* Phone: Home | vertical switcher. -ml-3 puts the 16px icon (not the 40px tap box) on the page gutter. */}
      <div className="-ml-3 flex min-w-0 flex-1 items-center md:hidden">
        <DocsHomeButton />
        <MobileVerticalSwitcher product={product} />
      </div>
      <div className="hidden min-w-0 items-center gap-2 md:flex">
        <DocsSwitcher />
      </div>
      <div className="ml-auto hidden md:block">
        <DocsHomeButton />
      </div>
    </div>
  );
}
