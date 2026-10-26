import { COMPONENT_CATEGORIES } from '@/lib/nav';
import { getA11yVerifiedCount } from '@/lib/a11yVerified';
import { TEMPLATES } from '@/lib/templates';
import thumbnailManifest from '../../public/template-thumbnails/manifest.json';
import { docsConfig } from '@/lib/docsConfig';
import { LandingPageContent } from './LandingPageContent';

export const metadata = { title: 'Dial — a Braun-derived design system' };

/**
 * Real landing page (docs-engine-v2 editorial capability) — replaces the previous bare
 * `<h1>Dial</h1>` + two links placeholder. Every number is computed at build time here (Server
 * Component), then passed as props to `LandingPageContent` (the `"use client"` half, needed
 * because `dial-react`'s `Link`/`Button` have no `"use client"` directive and use hooks
 * internally — importing them into a Server Component fails at build time, same rule as every
 * template in this app).
 *
 * - Component count: `COMPONENT_CATEGORIES` (nav.ts, itself derived from the package barrel).
 * - a11y-verified count: `getA11yVerifiedCount()` (a11yVerified.ts, real conformance-spec
 *   `story()` extraction).
 * - Example count: `TEMPLATES.length` (templates.ts, the same manifest `/examples` reads).
 *
 * No GitHub-star badge, no invented metric. `docsConfig.repoUrl` gates the external link — absent
 * today (no public remote yet, confirmed via `git remote -v`), so that link renders as nothing.
 */
export default function Page() {
  const totalComponents = COMPONENT_CATEGORIES.reduce((sum, cat) => sum + cat.components.length, 0);
  const { verified: a11yVerified } = getA11yVerifiedCount();

  return (
    <LandingPageContent
      totalComponents={totalComponents}
      a11yVerified={a11yVerified}
      categories={COMPONENT_CATEGORIES}
      templates={TEMPLATES}
      thumbnailManifest={thumbnailManifest}
      repoUrl={docsConfig.repoUrl}
    />
  );
}
