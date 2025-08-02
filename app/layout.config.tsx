import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { DocsSwitcher } from '@/components/DocsSwitcher';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/[product]/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <DocsSwitcher />,
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
