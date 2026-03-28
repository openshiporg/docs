'use client';

import { HomeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DocsHomeButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Go to homepage"
      className="inline-flex items-center justify-center rounded-lg p-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push('/');
      }}
    >
      <HomeIcon className="size-4" />
    </button>
  );
}
