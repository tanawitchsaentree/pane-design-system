# Docs IA — Dial documentation site spec

Written to unblock ORDER "Phase 6: docs site" — the order names this file as the full spec to read
before starting, but the file did not exist. Reconstructed from the order's own text (Stage 1/2
requirements, Definition of Done) plus what already exists in the repo (`packages/spec/*.md`'s
6-section convention, `packages/tokens/build/`, `packages/react`'s exported types). Every default
decision made while writing this file is logged in `BACKLOG.md`, not decided permanently — this is
IA-level scaffolding, not a new design-system decision.

## Two non-negotiable rules (carried verbatim from kiln's `docs-shell.md`, per the Docs Final Pass order)

- **Live-example code is generated from the same source that produces the render — never
  hand-written beside it.** A hand-maintained code sample drifts from the actual component the
  moment either one changes.
- **Props tables are generated from TS types — never typed by hand.**

These are the only two rules this file inherited from kiln's docs template with zero
modification. Everything else in kiln's eight-section template was merged into the 13-point
structure below (see "Component page structure" section's mapping table), or logged as a
TEMPLATE GAP where no clean 13-point equivalent existed.

## Site

Next.js (App Router) + MDX, at `apps/docs`, chrome (sidebar/TOC/search/theme-toggle) on Fumadocs.
Static export so `pnpm build` produces static files deployable anywhere, per the order's DoD.

## Global layout

- **Left sidebar**: nav tree — Overview, Foundations, Components (grouped by the same categories
  `apps/storybook`'s `storySort` already uses: Layout, Atoms, Forms, Overlays, Selection, Data
  Display).
- **Right sidebar**: sticky table of contents, generated from the page's own headings (h2/h3),
  scroll-spy highlighting the active section.
- **Every heading gets an anchor** (slug from heading text, `#kebab-case`).
- **Breadcrumb** above the page title (Section / Page).
- **Prev/Next** footer links, ordered by the sidebar's own tree order.
- **Theme switcher**: light/dark toggle in the header, switching `data-theme` on `<html>` exactly
  the way `apps/storybook/.storybook/preview.ts` already does — imports the same
  `dial-tokens` build CSS (`light.css`, `dark.css`), no new token values invented.
- **Search**: Pagefind, indexed at build time over the exported static HTML.

## MDX components (Stage 1 deliverables)

| Component | Job |
|---|---|
| `<Demo>` | Renders a real imported component from `dial-react` (never an iframe, never a static image) with a code panel below showing the exact source that produced the render. |
| `<PropsTable>` | Auto-generated from the component's real TypeScript prop types (`react-docgen-typescript` or equivalent against `packages/react/src/components/{Name}/{Name}.tsx`) — never hand-typed. Columns: prop, type, default, description. |
| `<KeyboardTable>` | Key / action table for components with keyboard behavior. Sourced from the component's own spec file's Accessibility section where that section names specific keys; components with no named keyboard behavior get this section omitted (see per-page structure below) rather than an invented table. |
| `<DoDont>` | Two-column list, sourced directly from the spec file's own `## Do` / `## Don't` sections. |
| `<TokenList>` | Table of the semantic/component tokens a component actually consumes, with live resolved values per theme (reads `packages/tokens/build/css/*.css` at build time, same discipline as `apps/storybook`'s `useCssVar` pattern — read real values, never hardcode). |

## Component page structure — 13 points (merged with kiln's 8-section template)

The order specifies 46 component pages each needing "ครบ 13 ข้อ" without enumerating all 13 by
name. Reconstructed here as the concrete checklist Stage 2 builds against. Every point maps to
something either already in `packages/spec/*.md` (6 existing sections) or named explicitly
elsewhere in the order (Demo, PropsTable, KeyboardTable, DoDont, TokenList, related components).

Per the Docs Final Pass order (standing decision 4), this is now also the **single surviving page
template** — kiln's `docs-shell.md` eight-section template is merged in below rather than living
as a second template file. Mapping, point by point:

| DOCS-IA point | Kiln section | Fit |
|---|---|---|
| 1. Title + description | 1. Name/status/version/sentence | Partial — see TEMPLATE GAPS below |
| 2. Live demo | 2. Live example | Exact — same non-negotiable rule (code generated from the same source as the render) |
| 3. Import statement | (part of 2) | Exact |
| 4. Usage | (part of 1's sentence, expanded) | Exact |
| 5. Do | 3. When to use | Exact |
| 6. Don't | 3. When *not* to use (+ what it's confused with) | Exact |
| 7. Variants | 5. Variants and states | Partial — see TEMPLATE GAPS |
| 8. Props (auto-gen) | 6. API (props/types/defaults) | Exact — same non-negotiable rule (generated from TS types, never hand-typed) |
| 9. Keyboard interaction | (folded into 7. Accessibility's keyboard map) | Exact, different grouping only |
| 10. Accessibility | 7. Accessibility, including what's not covered | Exact — DOCS-IA's existing "UNVERIFIED, never dropped or softened" rule already satisfies kiln's "including what the component does not do" |
| 11. Tokens used | (part of 6. API's "seams" — CSS custom properties exposed for override) | Partial — see TEMPLATE GAPS |
| 12. Related components | 8. Related components (+ what it's confused with) | Exact |
| 13. Source + spec links | — (no kiln equivalent) | DOCS-IA-only, kept as-is |

### TEMPLATE GAPS (kiln sections with no clean DOCS-IA equivalent)

- **Status/version per component** (kiln point 1) — Dial has no per-component status model
  (experimental/stable/deprecated) or per-component version; the whole package ships one semver.
  Not added to the 13-point structure this pass — would require a real status-tracking decision
  (a new field somewhere, maintained by whom) that this order's standing decisions don't authorize.
  Logged to `BACKLOG.md`, not invented.
- **Anatomy diagram with named parts matching the API 1:1** (kiln point 4) — no equivalent exists
  anywhere in `packages/spec/*.md`'s 6-section convention, and no diagramming convention exists in
  this repo. Point 8 (Props) already names real sub-parts for compound components (e.g.
  `Dialog.Root`/`Dialog.Content`/`Dialog.Title`), which covers the "part names match the API"
  half of kiln's rule but not the "diagrammed" half. Not added this pass. Logged to `BACKLOG.md`.
- **"Seams" as a distinct sub-section of API** (kiln point 6) — kiln separates a component's
  publicly overridable CSS custom properties ("seams") from its internal implementation tokens;
  DOCS-IA's point 11 (Tokens used) lists every token a component *consumes*, which is a superset
  that doesn't distinguish "meant for consumer override" from "internal to this component's own
  render." Not split this pass (would require auditing each token's actual override-intent, which
  is a real Dial-side decision, not a docs-site default). Logged to `BACKLOG.md`.
- **"States" named separately from "variants"** (kiln point 5) — DOCS-IA's point 7 folds both under
  one "Variants" heading; kiln explicitly calls out that a disabled/loading/error state must be
  shown even when it "feels unnecessary." This is achievable within the existing point 7 without a
  structural change (the generation instructions below now say so explicitly) — not a gap requiring
  a new point, just a stricter instruction under the existing one.

1. **Title + one-line description** — component name, one sentence (from spec's `## Usage`
   opening line).
2. **Live demo** (`<Demo>`) — a real rendered example, interactive, with visible source.
3. **Import statement** — the exact `import { X } from 'dial-react'` line.
4. **Usage** — full prose from spec's `## Usage` section.
5. **Do** — from spec's `## Do` (via `<DoDont>`).
6. **Don't** — from spec's `## Don't` (via `<DoDont>`).
7. **Variants** — every named variant/prop-driven visual state, each with its own small demo where
   the spec or Storybook story names one; a component with no variants gets this section stating
   so explicitly rather than omitted silently. Per kiln's merged rule (point 5, "states"): a
   disabled/loading/error/invalid state named in the spec's Props table gets shown here too, even
   on a component where that state "feels unnecessary" — not just the happy-path variants.
8. **Props** (`<PropsTable>`) — auto-generated, all props, all sub-components (e.g. `Card.Root`,
   `Card.Header`) get their own table.
9. **Keyboard interaction** (`<KeyboardTable>`) — only for components whose spec's Accessibility
   section names specific keys; components with no named keyboard behavior beyond native Tab show
   a one-line note ("no keyboard behavior beyond native Tab focus") instead of an empty table.
10. **Accessibility** — full prose from spec's `## Accessibility` section, including any stated
    `UNVERIFIED` notes verbatim — never dropped or softened.
11. **Tokens used** (`<TokenList>`) — every `--ds-{component}-*` token the component consumes.
12. **Related components** — from spec's `## Related` section.
13. **Source + spec links** — a link to the component's source directory in the repo and to its
    original `packages/spec/{name}.md` file, so a reader can verify the page against its source.

**Where a spec file is missing information a point above needs** (per the order: "spec ไหนขาด
ข้อมูล → ใส่ placeholder + list ไว้ ห้ามแต่งเติมเอง"): render a visible placeholder block
(e.g. "Not documented yet — see `BACKLOG.md`") and add one line to `BACKLOG.md` naming the
component and the missing point. Never invent content to fill a gap.

## Foundations pages

Colors, Typography, Spacing, Motion, Icons. Each reads real resolved values from
`packages/tokens/build/css/{light,dark}.css` at build time (same `getComputedStyle`/build-time-read
discipline `apps/storybook/src/foundations/_shared.tsx`'s `useCssVar` already establishes) — never
a hardcoded hex/px value written into the docs site's own source.

**Icons** foundation page is new (no equivalent exists yet in `apps/storybook/src/foundations/`).
Default scope: list every icon the design system currently ships (from `packages/react/src/components/Icon/`
or wherever the icon set's source of truth is), name + preview + how to reference it. If no formal
icon set exists yet as of Stage 2, this page states that plainly and links to `BACKLOG.md` rather
than inventing an icon inventory.

## Overview pages

- **Introduction** — what Dial is, one paragraph, links to Foundations/Components.
- **Installation** — `npm install dial-react dial-tokens`, peer deps, setup snippet (same content
  already in `packages/react/README.md`, reused not rewritten).
- **Theming** — how the token pipeline works (primitive → semantic → component tiers), how a
  consumer overrides at the semantic layer, cross-referenced from `packages/tokens/README.md` if
  one exists, otherwise from the token package's own build output structure.
- **Dark mode** — `data-theme="dark"` attribute switch, same mechanism the docs site's own theme
  switcher uses, documented so a consumer can replicate it.
- **Comparison with alternatives** — one page naming a small number of comparable systems (e.g.
  Radix Themes, Chakra, MUI — the same three named in `ds-conventions`'s Reuse Check language
  elsewhere in this repo) and what Dial's own stated positions are (accent scarcity, Braun-derived
  lineage, logical-properties-only). Written from `system/DECISIONS.md`'s own locked decisions,
  never from unverified claims about the competitors' current feature sets.

## Defaults chosen while writing this file (logged, not permanent decisions)

- Next.js App Router + MDX (order didn't specify a routing style; App Router is the current
  Next.js default and static-exports cleanly).
- Pagefind for search (order named it explicitly — no default needed here, included for
  completeness of this list's own audit trail).
- Component category grouping in the sidebar mirrors Storybook's existing `storySort` order rather
  than inventing a new taxonomy.
- The three comparison systems on the "compared to alternatives" page default to the same three
  Reuse Check already references elsewhere in this repo, rather than picking new ones.
- Icons foundation page's scope (list what exists, flag if nothing formal exists yet) is a default
  pending confirmation of where the icon set's actual source of truth lives — logged to
  `BACKLOG.md`.
