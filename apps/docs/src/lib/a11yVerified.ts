import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

/**
 * Computes the real count of components with actual conformance-spec coverage, for the landing
 * page's stats row and any future a11y-status badge (SPEC DEBT #3, docs-engine-upgrade v1's
 * BACKLOG entry) — never hand-typed.
 *
 * Extracts real component slugs from every `story('{category}-{component}--{variant}')` call
 * across `packages/conformance/specs/*.spec.ts` (the actual story path each conformance test
 * navigates to — a real behavioral test target, not an incidental name mention). A naive whole-
 * word grep for a component's name against spec file TEXT overcounts (e.g. "Divider"/"FormField"/
 * "Toast" appear in comments or adjacent helper code without a real conformance test targeting
 * them) — this extraction only counts a component if its own story is the literal navigation
 * target of a real `test(...)` block.
 */
const REACT_COMPONENTS_ROOT = path.join(process.cwd(), '..', '..', 'packages', 'react', 'src', 'components');
const CONFORMANCE_SPECS_ROOT = path.join(process.cwd(), '..', '..', 'packages', 'conformance', 'specs');

export function getA11yVerifiedCount(): { verified: number; total: number } {
  const componentNames = readdirSync(REACT_COMPONENTS_ROOT);
  const specFiles = readdirSync(CONFORMANCE_SPECS_ROOT).filter((f) => f.endsWith('.spec.ts'));
  const specText = specFiles.map((f) => readFileSync(path.join(CONFORMANCE_SPECS_ROOT, f), 'utf8')).join('\n');

  const storySlugs = new Set<string>();
  const storyCallRegex = /story\('([a-z0-9-]+)--/g;
  let match: RegExpExecArray | null;
  while ((match = storyCallRegex.exec(specText))) {
    // Each slug is "{category}-{component}", e.g. "atoms-iconbutton" or "selection-radiocards" —
    // strip the leading category segment (always one word before the first hyphen).
    const withoutCategory = match[1].replace(/^[a-z]+-/, '');
    storySlugs.add(withoutCategory);
  }

  let verified = 0;
  for (const name of componentNames) {
    if (storySlugs.has(name.toLowerCase())) verified += 1;
  }

  return { verified, total: componentNames.length };
}
