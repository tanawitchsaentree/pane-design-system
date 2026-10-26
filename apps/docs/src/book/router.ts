import { useEffect, useState } from 'react';
import routes from './routes.json';

export interface PageRef { path: string; title: string; part: string }
export const PAGES: PageRef[] = routes.parts.flatMap((p) => p.pages.map((pg) => ({ ...pg, part: p.title })));
export const PARTS = routes.parts;

const current = () => location.pathname.replace(/\/+$/, '') || '/';

/** Pathname routing; links keep the ?scene= so the backdrop survives navigation. */
export function useRoute() {
  const [path, setPath] = useState(current());
  useEffect(() => {
    const on = () => setPath(current());
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);
  return path;
}

export function navigate(to: string) {
  const [p, hash] = to.split('#');
  const url = `${p || location.pathname}${location.search}${hash ? `#${hash}` : ''}`;
  if (p && p !== current()) {
    history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  } else history.replaceState(null, '', url);
  if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }));
}
