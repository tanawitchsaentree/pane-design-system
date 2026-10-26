import type { PageTree } from 'fumadocs-core/server';
import { COMPONENT_CATEGORIES, FOUNDATIONS_PAGES, OVERVIEW_PAGES, kebabCase } from './nav';

/**
 * Fumadocs' DocsLayout takes a PageTree.Root (its own real type, read from
 * fumadocs-core/server on disk) — it does not read the filesystem itself when a project's routes
 * are hand-authored App Router pages (as apps/docs' are) rather than fumadocs-mdx's own content
 * collection convention. This file is the one generator that builds that tree, from the same
 * COMPONENT_CATEGORIES/FOUNDATIONS_PAGES/OVERVIEW_PAGES data nav.ts already derives from
 * packages/react/src/barrel.manifest.mjs — not a second hand-typed nav list. Changing the barrel
 * manifest changes this tree the same way it changes DocsLayout's rendered sidebar and (via
 * fumadocs-core's findNeighbour reading this same tree) every page's prev/next footer.
 */

function pageItem(name: string, url: string): PageTree.Item {
  return { type: 'page', name, url };
}

export function buildPageTree(): PageTree.Root {
  const overview: PageTree.Folder = {
    type: 'folder',
    name: 'Overview',
    defaultOpen: true,
    children: OVERVIEW_PAGES.map((p) => pageItem(p, `/${kebabCase(p)}`)),
  };

  const foundations: PageTree.Folder = {
    type: 'folder',
    name: 'Foundations',
    defaultOpen: true,
    children: FOUNDATIONS_PAGES.map((p) => pageItem(p, `/foundations/${kebabCase(p)}`)),
  };

  const componentFolders: PageTree.Folder[] = COMPONENT_CATEGORIES.map((cat) => ({
    type: 'folder',
    name: cat.title,
    children: cat.components.map((c) => pageItem(c.name, `/components/${c.slug}`)),
  }));

  return {
    name: 'Dial',
    children: [overview, foundations, ...componentFolders],
  };
}
