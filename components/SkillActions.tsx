'use client';

import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useId, useState } from 'react';
import { CopySkillButton } from '@/components/CopySkillButton';
import { cn } from '@/lib/utils';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

export function SkillActions({
  skillUrl,
  copyLabel,
  title,
}: {
  skillUrl: string;
  copyLabel: string;
  title: string;
}) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleViewer() {
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);
    if (markdown || loading) return;

    setLoading(true);
    setError(false);
    try {
      const response = await fetch(skillUrl);
      if (!response.ok) throw new Error(`Skill request returned ${response.status}`);
      setMarkdown(await response.text());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-b pb-6 pt-2">
      <div className="flex flex-wrap items-center gap-2">
        <CopySkillButton skillUrl={skillUrl} label={copyLabel} />
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggleViewer}
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'sm',
              className: 'gap-2 [&_svg]:size-3.5',
            }),
          )}
        >
          <Eye />
          {open ? 'Hide skill' : 'View skill'}
          {open ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {open ? (
        <div
          id={panelId}
          className="mt-4 overflow-hidden rounded-xl border bg-fd-secondary/30"
        >
          <div className="border-b px-4 py-2 text-sm font-medium">{title}</div>
          <div className="max-h-[60vh] overflow-auto overscroll-contain p-4">
            {loading ? (
              <p className="m-0 text-sm text-fd-muted-foreground">Loading skill…</p>
            ) : error ? (
              <p className="m-0 text-sm text-fd-muted-foreground">
                The skill could not be loaded. Close this panel and try again.
              </p>
            ) : (
              <pre className="m-0 min-w-max whitespace-pre font-mono text-xs leading-relaxed text-fd-foreground">
                {markdown}
              </pre>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
