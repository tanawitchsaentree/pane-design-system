'use client';

import { useEffect, useRef, useState } from 'react';
import { create, load, search as oramaSearch } from '@orama/orama';
import { SearchDialog } from 'fumadocs-ui/components/dialog/search';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';

/**
 * Replaces fumadocs-core's built-in `createStaticClient` (src/search/client/static.ts) — used via
 * `RootProvider`'s documented `search.SearchDialog` extension point (per the Docs Final Pass
 * order's rule to extend through a framework's own API, not fork its layout), rather than patching
 * node_modules.
 *
 * Two confirmed upstream bugs in the installed fumadocs-core@14.7.7 (both reproduced in isolation
 * against the installed package, not usage errors on this file's part, and both still present in
 * 17.0.0, the latest published version as of this build — logged in BACKLOG.md):
 *
 * 1. `initSimpleSearch().export()` spreads `save(await doc)` without awaiting `save()` itself (an
 *    `async function`) — spreading an un-awaited Promise yields no own enumerable properties, so
 *    the default `createSearchAPI('simple', ...).staticGET()` response silently drops the entire
 *    index. Worked around server-side in src/app/api/search/route.ts (real `create`/
 *    `insertMultiple`/`save` calls, correctly awaited).
 * 2. `createStaticClient`'s returned `search()` calls `searchSimple(cached, query)`, passing the
 *    `{ type, db }` wrapper object it stores internally instead of unwrapping to `cached.db` —
 *    `searchSimple`'s real signature expects the raw Orama database. This throws
 *    "Cannot read properties of undefined (reading 'index')" internally, silently swallowed by
 *    `useDocsSearch`'s own `.catch((err) => setError(err))`, which never surfaces to the UI (no
 *    console error, no visible failure — the dialog just never shows results). This component
 *    replaces that broken client-side path entirely with a correct direct call to
 *    `@orama/orama`'s own public `search()` against the loaded db, matching exactly what
 *    fumadocs-core's own `searchSimple` does internally (see node_modules/fumadocs-core/dist/
 *    chunk-GIPLMX5F.js) — same query shape (`term`, `tolerance: 1`, `boost: { title: 2 }`), same
 *    result mapping (`type: 'page'`, `content` from `title`, `id`/`url` from `url`).
 */

const SIMPLE_SCHEMA = {
  url: 'string',
  title: 'string',
  description: 'string',
  content: 'string',
  keywords: 'string',
} as const;

export function DialSearchDialog(props: SharedProps) {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<
    { type: 'page'; id: string; content: string; url: string }[] | 'empty'
  >('empty');
  const dbRef = useRef<ReturnType<typeof loadDb> | null>(null);

  async function loadDb() {
    const res = await fetch('/api/search');
    const data = await res.json();
    const db = await create({ schema: SIMPLE_SCHEMA });
    await load(db, data);
    return db;
  }

  useEffect(() => {
    if (!props.open) return;
    if (!dbRef.current) {
      dbRef.current = loadDb();
    }
  }, [props.open]);

  useEffect(() => {
    if (search.length === 0) {
      setResults('empty');
      return;
    }
    if (!dbRef.current) return;

    let cancelled = false;
    setIsLoading(true);

    dbRef.current
      .then((db) => oramaSearch(db, { term: search, tolerance: 1, boost: { title: 2 } }))
      .then((result) => {
        if (cancelled) return;
        setResults(
          result.hits.map((hit) => ({
            type: 'page' as const,
            id: String(hit.document.url),
            content: String(hit.document.title),
            url: String(hit.document.url),
          })),
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search]);

  return (
    <SearchDialog
      {...props}
      search={search}
      onSearchChange={setSearch}
      isLoading={isLoading}
      results={results}
    />
  );
}
