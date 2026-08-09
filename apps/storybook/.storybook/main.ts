import { resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

// Storybook = workshop (BLUEPRINT §"Stack"), separate from apps/docs (docs site).
// Stories are read directly from the real @dial/react package source — nothing is copied.
// Foundations/* pages (Colors, Typography, Spacing, Motion — ORDERS A3) live under
// apps/storybook/src/foundations since they document tokens, not a @dial/react component.
const config: StorybookConfig = {
  stories: [
    '../../../packages/react/src/**/*.stories.@(ts|tsx)',
    '../src/foundations/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(viteConfig, {
      resolve: {
        alias: {
          // Resolve @dial/react to its TS source so Storybook picks up live component
          // changes without requiring a `pnpm build` of the package first.
          '@dial/react': resolve(__dirname, '../../../packages/react/src/index.ts'),
        },
      },
    });
  },
};

export default config;
