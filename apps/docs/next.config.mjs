import createMDX from '@next/mdx';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { rehypeCode } from 'fumadocs-core/mdx-plugins';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['dial-react'],
  images: {
    unoptimized: true,
  },
};

// rehype-slug gives every heading a real id (kebab-case of its text) — without it every h2/h3
// has an empty .id, which is what produced TableOfContents' duplicate-key warning and made its
// anchor links (#slug) go nowhere. @next/mdx forwards pluginOptions.options straight to
// @mdx-js/loader, so plugin arrays must be nested under `options`, not passed at the top level.
//
// remark-gfm adds GitHub-flavored markdown (tables, strikethrough, task lists, autolinks) — plain
// CommonMark (MDX's default) has no table syntax at all, so a `| a | b |` block renders as literal
// pipe-delimited text instead of a real <table> without this. Found live during the
// docs-engine-upgrade order's overview-page uplift: newly-added markdown tables leaked raw `|`
// syntax into the page (a real G-D3 render-integrity violation) until this was added.
//
// rehypeCode (fumadocs-core/mdx-plugins — the same real transform Fumadocs' own docs use, not a
// hand-rolled highlighter) turns every ```lang fenced block into a real Shiki-highlighted <pre>.
// Root-caused live (docs-engine-amendment-craft-contract order): apps/docs/globals.css only ever
// styled `.docs-demo-code` (the class <Demo>/<Playground> apply themselves) — a plain MDX-authored
// fence outside those components had ZERO pre/code styling, so each line's inline `<code>` still
// got Fumadocs' inline-code pill treatment with no fence styling to override it. Confirmed
// repo-wide: 48 of 56 content pages have at least one raw fence (every component page's "import"
// snippet, dark-mode's "How it works", installation's setup commands). This plugin is the fix at
// the generator layer — no per-page edits, every existing fence gets real highlighting for free.
// Dual-theme: Shiki emits both light+dark token colors as CSS variables per span; which one is
// visible follows this site's own [data-theme="dark"] attribute (see globals.css's
// `[data-theme='dark'] .docs-demo-code` override, added alongside this).
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeCode,
        {
          themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
          defaultColor: false,
          addLanguageClass: true,
          icon: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
