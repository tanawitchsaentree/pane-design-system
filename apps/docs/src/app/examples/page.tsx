import { TEMPLATES } from '@/lib/templates';
import thumbnailManifest from '../../../public/template-thumbnails/manifest.json';
import { ExamplesIndexContent } from './ExamplesIndexContent';

export const metadata = { title: 'Examples — Dial' };

/**
 * Templates index — real generated thumbnails (G-T4: `scripts/generate-template-thumbnails.mjs`
 * writes both the PNG and its content hash into `manifest.json`; this page just reads that real
 * manifest, it never invents or hand-draws a thumbnail). Outside the `(docs)` route group so it
 * renders full-bleed, matching the templates it showcases rather than framing them inside the
 * docs sidebar. Thin Server Component wrapper — real content lives in `ExamplesIndexContent`
 * (`"use client"`, needed for `dial-react`'s `Link`).
 */
export default function Page() {
  return <ExamplesIndexContent templates={TEMPLATES} thumbnailManifest={thumbnailManifest} />;
}
