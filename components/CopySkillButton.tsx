'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

const cache = new Map<string, string>();

export function CopySkillButton({
  skillUrl,
  label,
}: {
  skillUrl: string;
  label: string;
}) {
  const [state, setState] = useState<'idle' | 'loading' | 'copied' | 'error'>('idle');

  async function copySkill() {
    setState('loading');
    try {
      let markdown = cache.get(skillUrl);
      if (!markdown) {
        const response = await fetch(skillUrl);
        if (!response.ok) throw new Error(`Skill request returned ${response.status}`);
        markdown = await response.text();
        cache.set(skillUrl, markdown);
      }
      await navigator.clipboard.writeText(markdown);
      setState('copied');
      window.setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('error');
      window.setTimeout(() => setState('idle'), 2000);
    }
  }

  return (
    <button
      type="button"
      disabled={state === 'loading'}
      onClick={copySkill}
      className={cn(
        buttonVariants({
          color: 'primary',
          size: 'sm',
          className: 'gap-2 [&_svg]:size-3.5',
        }),
      )}
    >
      {state === 'copied' ? <Check /> : <Copy />}
      {state === 'copied'
        ? 'Copied skill'
        : state === 'error'
          ? 'Copy failed'
          : state === 'loading'
            ? 'Copying…'
            : label}
    </button>
  );
}
