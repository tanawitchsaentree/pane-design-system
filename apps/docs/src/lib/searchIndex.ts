import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import type { Index } from 'fumadocs-core/search/server';
import { COMPONENT_CATEGORIES, FOUNDATIONS_PAGES, OVERVIEW_PAGES, kebabCase } from './nav';

/**
 * Search must index component names AND usage-text content (DoD requirement), not just titles.
 * Since apps/docs' pages are hand-authored .mdx route files rather than fumadocs-mdx's own content
 * collection, this reads each real page.mdx file at build time and strips it down to plain
 * searchable text — real content, not invented — for fumadocs-core's simple search schema
 * (title/description/content/url).
 */

function stripToPlainText(mdx: string): string {
  return mdx
    // drop the import/export lines entirely — never searchable content
    .replace(/^import .*$/gm, '')
    .replace(/^export .*$/gm, '')
    // drop JSX component tags but keep their text children
    .replace(/<[^>]+>/g, ' ')
    // drop the {`...`} / {[...]} JS expression bodies used for demo code / prop arrays
    .replace(/\{[^{}]*\}/g, ' ')
    // markdown emphasis/code markers
    .replace(/[`*_#>|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface PageMeta {
  title: string;
  url: string;
  mdxRelativePath: string;
}

function collectPageMeta(): PageMeta[] {
  const pages: PageMeta[] = [];

  for (const p of OVERVIEW_PAGES) {
    pages.push({ title: p, url: `/${kebabCase(p)}`, mdxRelativePath: `${kebabCase(p)}/page.mdx` });
  }
  for (const p of FOUNDATIONS_PAGES) {
    pages.push({
      title: p,
      url: `/foundations/${kebabCase(p)}`,
      mdxRelativePath: `foundations/${kebabCase(p)}/page.mdx`,
    });
  }
  for (const cat of COMPONENT_CATEGORIES) {
    for (const c of cat.components) {
      pages.push({
        title: c.name,
        url: `/components/${c.slug}`,
        mdxRelativePath: `components/${c.slug}/page.mdx`,
      });
    }
  }

  return pages;
}

/**
 * Content pages live under `src/app/(docs)/...` on disk (route group, invisible in the URL) since
 * the docs-engine-v2 route-group split — see `toc.ts`'s identical helper for the full rationale.
 */
function resolveContentPagePath(mdxRelativePath: string): string {
  const directPath = path.join(process.cwd(), 'src/app', mdxRelativePath);
  if (existsSync(directPath)) return directPath;
  return path.join(process.cwd(), 'src/app/(docs)', mdxRelativePath);
}

export function buildSearchIndexes(): Index[] {
  const pages = collectPageMeta();

  return pages.map((page) => {
    const fullPath = resolveContentPagePath(page.mdxRelativePath);
    const raw = readFileSync(fullPath, 'utf8');
    return {
      title: page.title,
      url: page.url,
      content: stripToPlainText(raw),
    };
  });
}
