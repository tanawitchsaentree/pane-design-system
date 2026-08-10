import type { Preview } from '@storybook/react';
import React from 'react';

// Real token CSS build (packages/tokens/build/css/*.css) — light.css defines the :root
// --ds-* variables; dark.css / light-contrast-more.css apply under [data-theme="..."]
// selectors, so importing all three lets the toolbar below switch themes live.
import '../../../packages/tokens/build/css/light.css';
import '../../../packages/tokens/build/css/dark.css';
import '../../../packages/tokens/build/css/light-contrast-more.css';

const THEMES = {
  light: 'light',
  dark: 'dark',
  'light-contrast-more': 'light-contrast-more',
} as const;

const preview: Preview = {
  // Project-wide autodocs (Storybook 8): every component gets a Docs tab unless its own meta
  // opts out with `tags: ['!autodocs']` — no per-file `tags: ['autodocs']` needed on 60+ story
  // files (ORDERS A1).
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      // MUST stay an inline literal, and MUST stay identical to STORY_SORT_ORDER in
      // tooling/story-categories.mjs.
      //
      // Storybook's csf-tools reads this file with a static parser, not by executing it, so an
      // imported identifier here is a hard build failure ("Unexpected 'STORY_SORT_ORDER'.
      // Parameter 'options.storySort' should be defined inline") — importing the shared constant
      // is exactly what a first attempt did, and `tsc` passed while `storybook build` broke.
      //
      // So this one list is duplicated by necessity. tooling/story-title-check.mjs compares these
      // literal strings against story-categories.mjs and fails the build if they drift, which is
      // what keeps the duplication from becoming the 'DataDisplay' vs 'Data Display' bug again.
      storySort: {
        order: ['Foundations', 'Layout', 'Atoms', 'Forms', 'Overlays', 'Selection', 'Data Display', '*'],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components (D-011 tokens)',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: THEMES.light, title: 'Light' },
          { value: THEMES.dark, title: 'Dark' },
          { value: THEMES['light-contrast-more'], title: 'Light (contrast more)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) || 'light';
      const root = document.documentElement;
      // Matches the selectors actually emitted by dial-tokens build:
      //   light.css                -> :root (no attribute needed)
      //   dark.css                 -> [data-theme="dark"]
      //   light-contrast-more.css  -> [data-theme="light"][data-contrast="more"]
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        root.removeAttribute('data-contrast');
      } else if (theme === 'light-contrast-more') {
        root.setAttribute('data-theme', 'light');
        root.setAttribute('data-contrast', 'more');
      } else {
        root.removeAttribute('data-theme');
        root.removeAttribute('data-contrast');
      }
      return React.createElement(Story);
    },
  ],
};

export default preview;
