/**
 * @dial/tokens — Style Dictionary v4 config.
 * Source = DTCG JSON (2025.10 spec, $type/$value) under src/{primitive,semantic,component}/**\/*.json
 *
 * Themes: each theme composes primitive + one semantic file (+ contrast-more overlay for light-contrast-more).
 * "component/" is intentionally not composed yet — no component tokens exist in Phase 2 (see src/component/README.md).
 */

const PRIMITIVE = "src/primitive/**/*.json";
const SEMANTIC_SHARED = ["src/semantic/space.json", "src/semantic/size.json", "src/semantic/typography.json", "src/semantic/motion.json", "src/semantic/layout.json"];

const THEMES = {
  light: {
    selector: ":root",
    source: [PRIMITIVE, ...SEMANTIC_SHARED, "src/semantic/light.json"],
  },
  dark: {
    selector: '[data-theme="dark"]',
    source: [PRIMITIVE, ...SEMANTIC_SHARED, "src/semantic/dark.json"],
  },
  "light-contrast-more": {
    selector: '[data-theme="light"][data-contrast="more"]',
    // contrast-more.json only overrides color.border.* — load light.json first, then let contrast-more.json's
    // border tokens win because it's listed last (Style Dictionary merges in source-array order).
    source: [PRIMITIVE, ...SEMANTIC_SHARED, "src/semantic/light.json", "src/semantic/contrast-more.json"],
  },
};

/** @type {import('style-dictionary/types').Config[]} */
const configs = Object.entries(THEMES).map(([themeName, theme]) => ({
  source: theme.source,
  usesDtcg: true,
  platforms: {
    css: {
      transformGroup: "css",
      prefix: "ds",
      buildPath: "build/css/",
      files: [
        {
          destination: `${themeName}.css`,
          format: "css/variables",
          options: {
            selector: theme.selector,
            outputReferences: true,
          },
        },
      ],
    },
    scss: {
      transformGroup: "scss",
      prefix: "ds",
      buildPath: "build/scss/",
      files: [
        {
          destination: `_${themeName}.scss`,
          format: "scss/variables",
          options: { outputReferences: true },
        },
      ],
    },
    json: {
      transformGroup: "js",
      buildPath: "build/json/",
      files: [
        {
          destination: `${themeName}.json`,
          format: "json/nested",
        },
        {
          destination: `${themeName}.flat.json`,
          format: "json/flat",
        },
      ],
    },
    ts: {
      transformGroup: "js",
      buildPath: "build/ts/",
      files: [
        {
          destination: `${themeName}.d.ts`,
          format: "typescript/es6-declarations",
        },
      ],
    },
    ...(themeName === "light"
      ? {
          tailwind: {
            transformGroup: "js",
            buildPath: "build/tailwind/",
            files: [
              {
                destination: "preset.cjs",
                format: "javascript/tailwind-preset",
              },
            ],
          },
        }
      : {}),
  },
}));

export default configs;
