import type { MDXComponents } from 'mdx/types';
import { Demo } from '@/components/mdx/Demo';
import { PropsTable } from '@/components/mdx/PropsTable';
import { KeyboardTable } from '@/components/mdx/KeyboardTable';
import { DoDont } from '@/components/mdx/DoDont';
import { TokenList } from '@/components/mdx/TokenList';
import { FoundationSwatch } from '@/components/mdx/FoundationSwatch';
import { Playground } from '@/components/mdx/Playground';
import { CardGrid } from '@/components/mdx/CardGrid';
import { CodePanel } from '@/components/mdx/CodePanel';
import { DocsTable } from '@/components/mdx/DocsTable';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Demo,
    PropsTable,
    KeyboardTable,
    DoDont,
    TokenList,
    FoundationSwatch,
    Playground,
    CardGrid,
    // Registered as MDX's own `pre` override — every ```lang fenced block across all content
    // pages renders through CodePanel automatically (docs-engine craft-contract CODE PANEL
    // ANATOMY), no per-page edits. `children` here is the <code class="language-xxx"> element
    // rehypeCode/Shiki produced (next.config.mjs) — CodePanel adds the chrome around it.
    pre: CodePanel,
    // Registered as MDX's own `table` override — every raw `| a | b |` markdown table (remark-gfm
    // already turns these into real <table> elements) across all content pages renders through
    // DocsTable automatically (docs-engine craft-contract TABLE PATTERN), no per-page edits.
    table: DocsTable,
    ...components,
  };
}
