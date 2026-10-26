import { create, insertMultiple, save } from '@orama/orama';
import { buildSearchIndexes } from '@/lib/searchIndex';

/**
 * apps/docs is a static export (output: 'export') — the search dialog's default `type: 'fetch'`
 * mode expects a live API route, which a static export cannot serve. `RootProvider`'s
 * `search.options.type: 'static'` (set in src/app/layout.tsx) instead fetches this route ONCE at
 * runtime and loads the whole serialized search database client-side (fumadocs-core's own
 * createStaticClient, see node_modules/fumadocs-core/dist/static-*.js) — this route's only job is
 * to return that exact serialized shape.
 *
 * NOT using fumadocs-core/search/server's `createSearchAPI('simple', ...).staticGET` here: its
 * `initSimpleSearch().export()` has a confirmed upstream bug (present in the installed 14.7.7 and
 * still present in 17.0.0, the latest published version as of this build) — it spreads
 * `save(await doc)` without awaiting `save()` itself (an `async function`), so spreading an
 * un-awaited Promise yields no own enumerable properties and the real response body is just
 * `{"type":"simple"}` with the entire index silently missing. Reproduced in isolation against the
 * installed package, not a usage error on this file's part.
 *
 * Worked around by building the exact same "simple" schema Orama database
 * (fumadocs-core/dist/search/server.js's own `simpleSchema`/`createDBSimple`, replicated here using
 * only @orama/orama's public API — create/insertMultiple/save, the same functions
 * createDBSimple itself calls internally) and awaiting `save()` correctly, per the Docs Final Pass
 * order's rule to extend through a framework's own documented API rather than forking its layout —
 * @orama/orama is fumadocs-core's own declared dependency, not a new library introduced here.
 */

const simpleSchema = {
  url: 'string',
  title: 'string',
  description: 'string',
  content: 'string',
  keywords: 'string',
} as const;

let cachedResponse: Response | null = null;

export async function GET() {
  if (cachedResponse) return cachedResponse.clone();

  const items = buildSearchIndexes();
  const db = await create({ schema: simpleSchema });
  await insertMultiple(
    db,
    items.map((page) => ({
      title: page.title,
      description: page.description ?? '',
      content: page.content,
      url: page.url,
      keywords: page.keywords ?? '',
    })),
  );

  const exported = await save(db);
  cachedResponse = Response.json({ type: 'simple', ...exported });
  return cachedResponse.clone();
}
