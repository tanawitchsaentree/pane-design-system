// The book's pages are one chunk and each page's own content (examples, depth, specs) more chunks;
// none of it is in the first one. App shows a route only once loadPage has resolved for it, so the
// old page stays up while the next one loads and the new one paints whole.
import type { ReactElement } from 'react';

type Book = typeof import('./pages');
let book: Book | undefined;
const loading = new Map<string, Promise<void>>();

export function loadPage(path: string): Promise<void> {
  let p = loading.get(path);
  if (!p) {
    // a failed preload still shows the page; anything it missed suspends in place
    p = import('./pages').then((b) => { book = b; return b.preload(path); }).then(() => undefined, () => undefined);
    loading.set(path, p);
  }
  return p;
}

/** The page component for a loaded route; null when the book has no such page. */
export const pageFor = (path: string): (() => ReactElement) | null => book?.PAGE_COMPONENTS[path] ?? null;
