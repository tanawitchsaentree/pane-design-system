import { resolveTokens, hexToFumadocsHsl } from './tokens';

/* kiln docs-shell 1.0.0 · framework: fumadocs-ui@14.7.7/fumadocs-core@14.7.7/fumadocs-mdx@11.0.0
 * · template: docs/DOCS-IA.md · adapter: this file (kiln tier-2 -> --fd-*, kiln name wins)
 * A later `kiln docs` run in this project MUST grep this exact marker line before rebuilding the
 * shell — finding it means the shell exists already: re-verify (framework version, adapter
 * mapping, template file) rather than regenerating from scratch, and never silently overwrite
 * this file or docs/DOCS-IA.md without stating the diff first, per the Docs Final Pass order's own
 * "state files before touching them" rule (references/safety.md).
 */

/**
 * Docs Final Pass, Task 3 (2026-08-11). Fumadocs installed pinned for Next 14.2.35/React 18 peer
 * compat — verified against npm's published peerDependencies before install, not guessed. This
 * file is the ONLY place kiln's tier-2 semantic tokens and Fumadocs' own --fd-* variable names
 * meet. Kiln's semantic name wins on any collision; Fumadocs' variable is the alias — per
 * .claude/skills/kiln/references/docs-shell.md's token contract. No kiln token is re-typed by hand
 * anywhere else in apps/docs.
 *
 * Fumadocs' real variable names and format were read from the installed package on disk, not from
 * memory or unopened docs — see node_modules/fumadocs-ui/dist/style.css's own `:root`/`.dark`
 * blocks. Format is HSL components, unitless hue + percent saturation/lightness, space-separated,
 * no `hsl()` wrapper (Fumadocs' generated CSS consumes each one as `hsl(var(--fd-x) / alpha)`).
 *
 * This is a build-time-only mapping (resolveTokens() reads packages/tokens/build/css/*.css at
 * build time, same discipline as every other token consumer in apps/docs) — regenerates on every
 * `next build`/`next dev` compile automatically. There is nothing to hand-regenerate: change a kiln
 * token, rebuild, this file's output changes with it.
 */

const MAPPING: Array<{ fd: string; ds: string }> = [
  { fd: '--fd-background', ds: 'color-surface-canvas' },
  { fd: '--fd-foreground', ds: 'color-text-default' },
  { fd: '--fd-muted', ds: 'color-surface-raised' },
  { fd: '--fd-muted-foreground', ds: 'color-text-subtle' },
  { fd: '--fd-popover', ds: 'color-surface-raised' },
  { fd: '--fd-popover-foreground', ds: 'color-text-default' },
  { fd: '--fd-card', ds: 'color-surface-raised' },
  { fd: '--fd-card-foreground', ds: 'color-text-default' },
  { fd: '--fd-border', ds: 'color-border-hairline' },
  { fd: '--fd-primary', ds: 'color-action-primary-default' },
  { fd: '--fd-primary-foreground', ds: 'color-text-on-primary' },
  { fd: '--fd-secondary', ds: 'color-surface-inset' },
  { fd: '--fd-secondary-foreground', ds: 'color-text-default' },
  { fd: '--fd-accent', ds: 'color-action-primary-default' },
  { fd: '--fd-accent-foreground', ds: 'color-text-on-primary' },
  { fd: '--fd-ring', ds: 'color-border-focus' },
];

/** Fumadocs has no dedicated "code block surface" variable of its own (it themes code blocks via
 * Shiki's own light/dark colour set, read separately) — kiln's tier-2 has no dedicated "code"
 * token either, so this mapping reuses `color-surface-inset`, the same token apps/docs' own
 * `.docs-demo-code` panel already uses for exactly this purpose (see globals.css). Not a new
 * token, not invented — the existing precedent in this same app. */
const CODE_BLOCK_SURFACE_DS = 'color-surface-inset';

function buildRule(selector: string, resolved: Map<string, string>): string {
  const lines = MAPPING.map(({ fd, ds }) => `  ${fd}: ${hexToFumadocsHsl(resolved.get(ds)!)};`);
  lines.push(`  --fd-code-surface: ${hexToFumadocsHsl(resolved.get(CODE_BLOCK_SURFACE_DS)!)};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}

export function FumadocsTokenAdapter() {
  const dsNames = Array.from(new Set([...MAPPING.map((m) => m.ds), CODE_BLOCK_SURFACE_DS]));
  const tokens = resolveTokens(dsNames);
  const lightResolved = new Map(tokens.map((t) => [t.name, t.light]));
  const darkResolved = new Map(tokens.map((t) => [t.name, t.dark]));

  const css = [
    buildRule(':root', lightResolved),
    // Fumadocs' own dark-mode selector is a plain `.dark` class (next-themes convention), not
    // Dial's own [data-theme="dark"] attribute — apps/docs' ThemeToggle sets both so either
    // mechanism's consumers stay correct; see ThemeToggle.tsx.
    buildRule('.dark', darkResolved),
  ].join('\n\n');

  // eslint-disable-next-line react/no-danger -- generated CSS text, not user input
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
