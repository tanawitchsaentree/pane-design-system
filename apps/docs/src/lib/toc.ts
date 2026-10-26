import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import GithubSlugger from 'github-slugger';
import type { TableOfContents } from 'fumadocs-core/server';

/**
 * Fumadocs' <DocsPage toc={...}> needs a real TableOfContents array (title/url/depth per
 * heading) — it does not auto-detect headings from `children` the way the old hand-built
 * TableOfContents.tsx did (that one scanned `.docs-main h2, h3` client-side after mount). This
 * reads the actual `.mdx` file's `## `/`### ` lines at build time and slugs them with
 * `github-slugger` — the exact same package (and the same stateful class, reset per page, so
 * duplicate heading text gets the same "-1"/"-2" suffix behavior) that rehype-slug itself uses
 * under the hood (see node_modules/rehype-slug's own dependency on github-slugger), so the
 * generated anchors match the real heading `id`s rehype-slug assigns at render time — not a
 * hand-rolled regex that could drift from rehype-slug's actual algorithm (duplicate-heading
 * suffixing, punctuation handling) over time.
 *
 * Heading text is stripped of Markdown inline syntax (`code`, *emphasis*, backslash-escapes)
 * before slugging, since rehype-slug slugs the heading's rendered TEXT content (via
 * hast-util-to-string on the parsed HTML), not its raw Markdown source.
 */

function stripMarkdownInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\\(.)/g, '$1');
}

/**
 * Content pages physically live under `src/app/(docs)/...` (a Next.js route group — invisible in
 * the URL, but a real segment on disk) since the docs-engine-v2 route-group split moved every
 * content/reference page out of the root layout so `/examples/*` could render without the docs
 * sidebar. Every existing `getPageToc('foo/page.mdx')` call across ~56 pages predates that move
 * and doesn't know about the `(docs)` segment — resolving through it here (rather than rewriting
 * every call site) keeps this fix in one place.
 */
function resolveContentPagePath(mdxRelativePath: string): string {
  const directPath = path.join(process.cwd(), 'src/app', mdxRelativePath);
  if (existsSync(directPath)) return directPath;
  return path.join(process.cwd(), 'src/app/(docs)', mdxRelativePath);
}

export function getPageToc(mdxRelativePath: string): TableOfContents {
  const fullPath = resolveContentPagePath(mdxRelativePath);
  const raw = readFileSync(fullPath, 'utf8');
  const slugger = new GithubSlugger();
  const toc: TableOfContents = [];

  for (const line of raw.split('\n')) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    const match = h2 ?? h3;
    if (!match) continue;
    const depth = h2 ? 2 : 3;
    const title = stripMarkdownInline(match[1].trim());
    toc.push({ title, url: `#${slugger.slug(title)}`, depth });
  }

  return toc;
}
