import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { CombinedLogo } from '@/components/CombinedLogo';

export const gitConfig = {
  user: 'yourusername',
  repo: 'docs-combined',
  branch: 'main',
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <CombinedLogo />,
    },
    links: [],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
