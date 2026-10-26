import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Reads a template page's own real source text at build time — same discipline as
 * `propsTable.ts`'s `getPropsDoc`, applied to full-page examples (G-T2 same-source rule: the code
 * panel shown to the reader must byte-match the module that actually renders the page, never a
 * hand-copied second string that can drift).
 */
const APP_ROOT = path.join(process.cwd(), 'src', 'app');

/** @param relativePath Path relative to src/app, e.g. "examples/sign-in/page.tsx". */
export function getTemplateSource(relativePath: string): string {
  return readFileSync(path.join(APP_ROOT, relativePath), 'utf8');
}
