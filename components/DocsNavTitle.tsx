'use client';

import { DocsHomeButton } from '@/components/DocsHomeButton';
import { DocsSwitcher } from '@/components/DocsSwitcher';

export function DocsNavTitle(_props: { product: 'openfront' | 'openship' }) {
  return (
    <div className="flex items-center min-w-0 w-full">
      <div className="flex items-center gap-2 min-w-0 ml-2 md:ml-0">
        <div className="flex items-center gap-2 md:ml-auto">
          <div className="md:hidden flex items-center gap-2 shrink-0">
            <DocsHomeButton />
          </div>
          <DocsSwitcher />
        </div>
      </div>
      <div className="hidden md:block ml-auto">
        <DocsHomeButton />
      </div>
    </div>
  );
}
