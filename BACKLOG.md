# Backlog

Single backlog for the whole kit — root-level, one file, per the Docs Final Pass order's Part 3.1
("ทุกหัวข้อเหลือแหล่งความจริงเดียว"). Previously split between this file (Dial docs site work) and
`.claude/skills/kiln/BACKLOG.md` (the kiln audit/build engagement); merged here 2026-08-11, the
skill-scoped copy removed. Items below carry their original section header noting which engagement
found them — that provenance is kept, the file split is not.

Not a priority list — order of discovery. No priority ranking implied by order.

---

## Dial docs site (ORDER Phase 6 / Docs Final Pass)

Items found while building `apps/docs`, per that order's explicit rule: log and move on, no
exceptions except a previously-green gate going red.

---

## `docs/DOCS-IA.md` did not exist and was reconstructed

The order named this file as the spec to read before starting. It was missing entirely. Rebuilt
from the order's own text (Stage 1/2 requirements, Definition of Done) plus what already exists in
the repo (`packages/spec/*.md`'s section convention, `apps/storybook/src/foundations/_shared.tsx`'s
live-token-read pattern). Every default decision made while reconstructing it is listed in that
file's own "Defaults chosen" section and repeated below. If a real `DOCS-IA.md` existed elsewhere
and was simply not committed, reconcile against this reconstruction rather than discarding it.

## Icons foundation page — source of truth unclear

The order lists "Icons" as a Foundations page. No existing `apps/storybook/src/foundations/`
equivalent exists for icons (Colors/Typography/Spacing/Motion all have one; Icons does not).
Unclear whether Dial has a formal icon set with a canonical source location, or whether `Icon.tsx`
wraps an external icon library per-instance with no fixed inventory. Default taken: the docs page
lists whatever is discoverable at build time and states plainly if no formal set exists, rather
than inventing an icon inventory. Needs a real answer before Stage 2's Icons page can be more than
a placeholder.

## Sidebar category grouping — defaulted to Storybook's existing storySort

No IA existed to specify component grouping in the docs sidebar. Defaulted to reusing
`apps/storybook/.storybook/preview.ts`'s existing `storySort` category order (Layout, Atoms, Forms,
Overlays, Selection, Data Display) rather than inventing a new taxonomy. If the docs site ever
wants a different grouping (e.g. by use-case rather than atomic-design tier), that's a real IA
decision for someone to make deliberately, not inherited by default.

## "Compared to alternatives" page — comparison set defaulted, not confirmed

No IA specified which competing systems to name on the overview comparison page. Defaulted to the
same three systems (Radix Themes, Chakra, MUI) that `ds-conventions`'s Reuse Check language already
references elsewhere in this repo, since that's the only place in the existing project any
comparison set was ever named. This is a real editorial decision for a page real users will read —
worth a deliberate confirmation rather than staying on this default long-term.

## Spec files with genuinely thin sections, once Stage 2 walks all 46

Not yet enumerated — Stage 2 is where every one of the 46 `packages/spec/*.md` files gets read
against the 13-point page structure. Any file missing information a point needs gets a placeholder
on its docs page (per the order's own instruction) and a line appended here naming the component
and the missing point, at the time Stage 2 actually processes it — not predicted in advance here.

## Keyboard-behavior components without a clean "named keys" list

`DOCS-IA.md`'s point 9 (Keyboard interaction) only renders a `<KeyboardTable>` where a spec file's
Accessibility section names specific keys. Components whose spec describes keyboard behavior only
in prose (not as a clean key-by-key list) will need that judgment call made per-component during
Stage 2 — logged here as a class of decision to expect, not resolved in advance.

## `react-docgen-typescript` doesn't resolve runtime `.displayName` for plain function exports

Build (`pnpm run build`) failed on 5 pages (`dialog`, `drawer`, `popover`, `tooltip`, `radio-cards`)
because `getPropsDoc()`'s `displayName` matching compares against what `react-docgen-typescript`'s
parser reports, not the source's own `Foo.displayName = 'Compound.Sub'` string literal. The parser
only picks up that reassignment correctly for `forwardRef`-wrapped exports (e.g. `Dialog.Content` →
reports as `"Dialog.Content"`, matching its runtime `.displayName`); for a plain function export
like `export function Root(...) { ... }` followed by `Root.displayName = 'Dialog.Root';`, the
parser reports the doc under the literal declared function name (`"Root"`), not the reassigned
string. Affects `Dialog.Root`/`Drawer.Root`/`Popover.Root`/`Tooltip.Root`/`Tooltip.Provider` (all
plain function exports in their own `.tsx` source, unlike their sibling `Trigger`/`Content`/`Close`
sub-parts, which are `forwardRef`-wrapped and resolve correctly). Fixed by passing the parser's own
reported name (`"Root"`, `"Provider"`) to `<PropsTable>` instead of the runtime displayName string
— cosmetically inconsistent with every other sub-heading on those 4 pages (which do show the full
`Dialog.Content`-style name), but correct. Separately, `RadioCards.Item` isn't resolvable at all —
`RadioCardsItem` is a module-private `const` in `RadioCards.tsx`, attached to the public
`RadioCards` export as a static property rather than exported directly, so no doc exists for the
parser to find under any name; that one page now uses a plain markdown table transcribed from the
spec instead. Not fixing `propsTable.ts`'s matching logic itself (e.g. falling back to a second
match attempt against each doc's underlying declaration name) since that's beyond a docs-site
bug fix — logged here rather than decided.

## Two confirmed upstream bugs in `fumadocs-core@14.7.7`'s static search path (Docs Final Pass, Task 3)

Both reproduced in isolation against the installed package (not usage errors on this project's
part), and both still present in `fumadocs-core@17.0.0`, the latest published version as of this
build (checked its published `dist/search/server.js`/`dist/static-*.js` source directly — not
fixed upstream yet):

1. `initSimpleSearch().export()` (`src/search/server.ts`) spreads `save(await doc)` without
   awaiting `save()` itself — `save()` is an `async function`, so spreading its un-awaited
   `Promise` yields no own enumerable properties. `createSearchAPI('simple', ...).staticGET()`'s
   real HTTP response body is therefore just `{"type":"simple"}`, silently missing the entire
   serialized index. Worked around in `src/app/api/search/route.ts` by calling `@orama/orama`'s
   own public `create`/`insertMultiple`/`save` directly (the same functions `createDBSimple` uses
   internally) with `save()` correctly awaited, instead of using `createSearchAPI` at all.
2. `createStaticClient` (`src/search/client/static.ts`)'s returned `search()` method calls
   `searchSimple(cached, query)`, passing the `{ type, db }` wrapper object it stores internally
   instead of unwrapping to `cached.db` — `searchSimple`'s real signature expects the raw Orama
   database. This throws `Cannot read properties of undefined (reading 'index')` internally,
   silently swallowed by `fumadocs-core`'s own `useDocsSearch` hook (`.catch((err) =>
   setError(err))` never surfaces to the UI) — the search dialog opens, accepts input, shows no
   console error, and simply never renders results. Worked around in
   `src/components/DialSearchDialog.tsx`, which replaces Fumadocs' built-in static search client
   entirely via `RootProvider`'s own documented `search.SearchDialog` extension point (not a fork
   of its layout) — calls `@orama/orama`'s public `search()` directly against a client-loaded db,
   matching `searchSimple`'s own query shape (`term`/`tolerance: 1`/`boost: { title: 2 }`) and
   result mapping.

Not filed upstream (no public remote/issue tracker access authorized in this session) — logged
here so a future session with that access can file both against `fumadocs-core`. Both workarounds
are additive (new files/exports), not patches to `node_modules`, so a future `fumadocs-core`
version bump that fixes either bug can drop the corresponding workaround without a forced choice
made now.

## Fumadocs' own theme toggle has no accessible label

`fumadocs-ui@14.7.7`'s `ThemeToggle` (`src/components/layout/theme-toggle.tsx`, `mode:
'light-dark'` — the default `DocsLayout` renders in its sidebar footer) renders a bare
`<button data-theme-toggle>` with only an SVG icon child and no `aria-label`/`aria-labelledby`.
Chrome is Fumadocs' own per the Docs Final Pass order's standing decision 1, so not patched here —
logged as a real a11y gap in the framework's own default chrome, for whoever eventually files
upstream or swaps the toggle via `DocsLayout`'s own `disableThemeSwitch` + a custom replacement.

---

## Dial Uplift (2026-08-12) — dead-role scan + two-counts + shadow/state sweep

### `button.solid.bg.{primary,danger}.disabled` — real gap, kept and documented, not fixed

`packages/tokens/src/component/button.json` declares `solid.bg.{primary,neutral,danger}.disabled`
symmetrically (every intent × every state, disabled included) — but
`packages/react/src/components/Button/Button.module.css:85` has exactly one disabled rule for the
entire solid variant (`.button[data-variant='solid']:disabled`), unconditionally using
`--ds-button-solid-bg-neutral-disabled` regardless of `data-intent`. Outline variant's disabled
state (`button.outline.border.disabled` → `color.border.subtle`) shows the same pattern — no
per-intent branching once disabled. So `button-solid-bg-primary-disabled` and
`button-solid-bg-danger-disabled` are real, resolvable, declared tokens that zero CSS selector
anywhere ever consumes.

This reads as consistent, deliberate design (disabled = uniformly muted, intent stops mattering
once inactive) rather than a bug — the component's actual disabled treatment is internally
consistent across both variants. But nothing in `packages/spec/button.md` or either token's
`$description` states this intent explicitly, so it's not confirmable as decided rather than
merely convenient. Per this round's own gap-class rule ("gap จริง — เก็บ+document"), not resolved
here — kept as real gap, not removed as a synonym, since removing it would be a token-set edit
requiring the same design-intent confirmation this note itself says is missing.

### `color.text.color.*` (the `--ds-text-color-*` var family) — orphaned from all docs coverage

`packages/tokens/src/semantic/typography.json` defines `text.color.{default,subtle,disabled,
inverse}` as an alias into `color.text.*` (same resolved values, different namespace — likely
meant for typography-composite contexts that want a text color under the `text.*` prefix rather
than reaching into `color.*`). Confirmed via grep: not shown as a swatch on the Colors foundation
page (which covers `color.text.*` directly, not this alias) nor on the Typography foundation page
(which covers `text.body/heading/code.*` composite tokens, not this raw color sub-family) nor
anywhere else in `apps/docs`. Two-counts on the Colors page (128 real `color.*` tokens vs. shown
swatches) is exact after this round's fix — this family doesn't belong to that count at all, since
its real prefix is `text.*`, not `color.*`, which is exactly why it slipped past that specific
check. Not added to either foundations page this round (deciding which page should own it, or
whether it should exist as a separate `text.color.*` namespace at all vs. being a straight
duplicate warranting removal, is a real editorial/naming call outside this round's fixed 3-class
scope) — logged here as a real, confirmed gap for a future round to place or remove deliberately.

## `dial-react`'s public barrel re-exports enum TYPES but not their runtime array constants

`packages/react/src/types.ts` defines real runtime array constants alongside their types —
`ACTION_INTENTS: readonly ActionIntent[]` (types.ts:52), `CONTROL_SIZE_TOKENS: readonly
ControlSizeToken[]` (types.ts:40) — but `packages/react/src/index.ts`'s barrel only re-exports the
*types* (`export type { ..., ActionIntent, ControlSizeToken, ... } from './types'`), never the
runtime consts alongside them. A consumer importing from `dial-react` can name the type in a type
position but cannot import the real options array to build a select/enum control against — exactly
the case the new docs Playground component (`apps/docs/src/components/mdx/Playground.tsx`,
added 2026-08-12 per user request for real prop-combination controls, not just fixed `<Demo>`
examples) hit immediately. Separately, `ButtonVariant` (`Button.tsx:8`) has no runtime array
constant at all, exported or not — only the type. Worked around in
`apps/docs/src/content/demos/ButtonDemos.tsx` by transcribing the literal arrays by hand from the
real type unions/exported consts (not invented, but not the same as importing the real one), since
editing `packages/react`'s own barrel is outside this order's forward-only scope. If the docs site
adds more Playgrounds against components with real exported array constants (any Wave 2+ atom
using `ColorRoleToken`/etc.), the same workaround will repeat — fixing this once in the barrel
(add `export { ACTION_INTENTS, CONTROL_SIZE_TOKENS, ... } from './types'` alongside the existing
type-only export, plus a `BUTTON_VARIANTS` const in `Button.tsx` matching its sibling components'
convention) would remove the need for every future Playground's hand-transcribed array.

## Docs site now dogfoods `dial-react` for its own chrome — one gap surfaced: no Select component

Per explicit user instruction ("ทำ design system เองแต่ไม่เอาของตัวเองมาใช้" — you build a design
system and don't use your own), audited `apps/docs`'s own custom components (not Fumadocs' chrome,
which already mapped tokens via `fumadocsTokenAdapter.tsx` — see the entry two sections up) and
found `Demo.tsx`/`Playground.tsx` used raw `<button>`/`<input type="checkbox">`/`<input type="text">`
instead of `dial-react`'s own `Button`/`Switch`/`Input`/`Label`, despite token-level styling already
being real. Fixed: both files now import and render the real components (`Demo`'s show/copy
controls → `Button variant="link"`; `Playground`'s boolean controls → `Switch` + `Label`; text
controls → `Input`). Verified live via Playwright — toggling the real `Switch` updates both the
rendered `Button`'s loading state and the generated code string together, and the real `Button`'s
onClick still fires for copy-to-clipboard.

One control could not be converted: the enum `<select>` (Variant/Intent/Size) stays a native HTML
`<select>` because `dial-react` has no Select/Combobox component — `Listbox` is the only
selection-family component that exists (per `packages/react/src/index.ts`'s exports), and it's a
`ul[role=listbox]` built for an always-visible option list (React Aria collection component), not a
compact closed/open dropdown — not a drop-in replacement for a native `<select>`'s interaction
model. Building a real Select is a new component (wave/scope decision, not a docs-site fix) — not
attempted here.

---

## docs-engine-upgrade (2026-08-13) — new `docs-engine` skill built, Dial docs uplifted through it

Full PLAN + before/after numbers live in `PLAN.md` (root) and this order's two capped reports, not
duplicated here. This section is only the SPEC DEBT and real gaps the run surfaced, per the order's
own research-protocol instruction to log rather than invent when a checklist item lacks material.

### `remark-gfm` was missing — markdown tables leaked as raw text (real G-D3 violation, fixed)

`apps/docs/next.config.mjs`'s MDX pipeline had no `remarkPlugins` at all — plain CommonMark (MDX's
default) has no table syntax, so every `| a | b |` block rendered as literal pipe-delimited text
instead of a real `<table>`. Found live while adding the Compared-to-alternatives comparison table
and Theming's tier table (both new, this run). Fixed by adding `remark-gfm` as a direct dependency
and wiring `remarkPlugins: [remarkGfm]` into `withMDX`'s options. This was a repo-wide latent gap —
any future markdown table anywhere in `apps/docs` would have hit the same failure; not scoped to
just the two pages this run added.

### Two pre-existing raw `<p>` JSX blocks caused a real hydration error (fixed)

`apps/docs/src/app/compared-to-alternatives/page.mdx` and `.../foundations/icons/page.mdx` both
had a literal `<p className="docs-placeholder">...</p>` block written directly in MDX prose — MDX's
own remark pipeline wraps a JSX block's inner text in another `<p>` when parsing it as markdown,
producing `<p><p>...</p></p>`, an invalid HTML nesting that React flags as a hydration error
(confirmed via a live Playwright console-error check, not by inspection alone). Fixed by changing
both wrappers to `<div className="docs-placeholder">` — same visual/CSS result, valid nesting.
Found incidentally while verifying the new comparison table rendered correctly; not something this
order's own edits caused, but real and worth flagging since it was silently failing before.

### Bundle-size badge (checklist point 2) is real code but reports as UNMEASURABLE against dial-react

Built `.claude/skills/docs-engine/scripts/bundle-size.mjs` (esbuild-based, per-export minify+gzip
measurement) per this order's SPEC DEBT #1. Confirmed against `dial-react`: every export
(`Button`/`IconButton`/`Input`/`Stack`/`Dialog`/`Popover`/`Spacer`, tested) reports the same size
(209.9 KB min / 66.4 KB gzip, within single-digit-byte minifier-noise variance) because
`packages/react/dist/index.mjs` is a single ~10k-line flat pre-bundled file — esbuild cannot
tree-shake an already-bundled file, so importing any one name still pulls in the textual whole. The
script now detects this (near-identical sizes across measured exports) and reports "UNMEASURABLE
per-component" rather than emitting a misleading per-component number — this is the Honesty Rule
applied to a badge value, not a script bug. A real per-component bundle-size badge requires
`packages/react`'s own build to either code-split per component or ship a metafile/analyze output
the docs site can attribute sizes from — that's a `packages/react` build-config decision, outside
this docs-only order's scope.

### `Snackbar` has no primary component export — a11y/keyboard-table generation can't run against it

`packages/react/src/components/Snackbar/Snackbar.tsx` exports `useSnackbar()` (a hook) and a
`SnackbarOptions` type — no rendered `Snackbar` component exists to introspect via
`react-docgen-typescript`, confirmed by the audit script's own "no component doc found" result and
independently by the agent that built Snackbar's demo-ladner ("confirmed `Snackbar.tsx` genuinely
has no rendered component export... the docgen parse error is expected/correct, not a bug"). Its
docs page already reflects this (plain prose instead of `<PropsTable>`). Not a docs-engine gap —
correctly excluded from the demo-floor's dimension count rather than defaulted to 0 silently.

### Keyboard-table coverage — 17/46 component pages use `<KeyboardTable>`, the other 29 unclassified

Unchanged by this run (out of scope — this run's work was the G-D1 demo floor, not checklist point
9). Per `PLAN.md`'s original audit, each of the 29 needs a real per-component judgment call against
its own spec/test file (has real keyboard behavior worth a table vs. genuinely nothing beyond
native semantics) — not guessed. A future `docs uplift` pass targeting checklist point 9
specifically should do this classification pass; premature to guess it here.

---

## docs-engine-v2 (2026-08-13) — examples capability + editorial pass built, 6 templates shipped on Dial

Full catalog decision, skeleton assignment, and landing-page outline live in `PLAN.md`'s v2
addendum; this section is only the real bugs and SPEC DEBT this run surfaced.

### `Button`/`IconButton`'s icon slot renders a raw `<svg>` at 0×0 — a real, repo-wide bug, not fixed here

Confirmed via live Playwright inspection (`getComputedStyle` on the actual rendered SVG): passing
a raw `<svg>` element directly into `Button`'s `leftIcon`/`rightIcon` prop or `IconButton`'s
`children` renders it at `width: 0px; height: 0px` — invisible, not just small. Root cause:
`packages/react/src/components/Icon/Icon.module.css` has the rule that actually sizes a raw SVG
child (`.icon > svg { inline-size: 100%; block-size: 100% }`), but
`packages/react/src/components/Button/Button.module.css`'s own `.icon` class (which wraps
`leftIcon`/`rightIcon`/IconButton's children) has no equivalent rule — nothing in Button's own CSS
gives an unwrapped SVG intrinsic size. The fix that works today is wrapping the SVG in a real
`<Icon>` first (`<IconButton><Icon><MySvg /></Icon></IconButton>`), which is NOT what any existing
demo in this docs site does.

**This is repo-wide, predates this run, and was caught by accident** (screenshot-comparing a new
template's icon against an existing `/components/icon-button` demo, which turned out to show the
identical invisible-icon bug). Confirmed affected: `IconButtonDemos.tsx`, `DividerDemos.tsx`,
`FlexDemos.tsx`, `TooltipDemos.tsx`, `StackDemos.tsx`, `VisuallyHiddenDemos.tsx` (every file
grepped for `IconButton` usage without a `<Icon` wrapper) — meaning the live `/components/icon-button`
page and others have been silently showing invisible icons in their own canonical demos. This
docs-engine-v2 run's own two new templates that hit this (`error-404`'s search icon,
`dashboard`'s notification bell) were fixed by wrapping in `<Icon>` before shipping — but the
underlying CSS gap in `Button.module.css` itself was NOT touched (forward-only rule: no
`packages/react` source edits without a formal decision-log entry). A future session should either
add the missing `.icon > svg` sizing rule to `Button.module.css` (matching Icon's own), or decide
that Button's icon slots require an `<Icon>` wrapper by contract and fix the 6+ affected demo
files to model that correctly — either way, this is a real defect affecting live, already-shipped
docs pages, not a hypothetical.

### Full-page examples reveal the docs chrome/example-page layout coupling — fixed via route groups

Before this run, every page under `apps/docs/src/app` rendered inside Fumadocs' `DocsLayout`
(sidebar + right-rail TOC) because `DocsLayout` lived in the single root `layout.tsx`. Building
the first `/examples/*` template exposed this immediately: a "full-page example a reader could
ship" rendered framed inside the docs site's own sidebar, defeating the entire point. Fixed by
moving every content/reference page (Introduction, Foundations, Components, etc. — all ~56 pages)
into a new `src/app/(docs)/` Next.js route group (invisible in the URL, real on disk) with its own
`layout.tsx` carrying `DocsLayout`; the root `layout.tsx` now only carries site-wide providers
(token adapter, search, theme sync). `/examples/*` and the root landing page sit outside the
`(docs)` group and render full-bleed. Two existing library files (`toc.ts`, `searchIndex.ts`) read
content-page paths relative to `src/app` directly — patched both with a `resolveContentPagePath`
fallback (try the direct path, fall back to the `(docs)`-prefixed path) rather than rewriting all
56 pages' own `getPageToc('...')` call sites individually.

### `dial-react` has no AppShell/Sidebar/Navbar/Menu/Dropdown/Breadcrumb/Pagination/Tabs component

Confirmed by directory listing (`packages/react/src/components/`) before building anything — not
guessed. The Dashboard template (the one BUILDABLE-WITH-GAPS template this run) composes its
persistent-shell skeleton entirely from `Box`/`Flex`/`Stack`/`Divider` + `next/link`, which is
real, valid usage — but a mature component library would ship at least an `AppShell` or `Sidebar`
primitive for this extremely common pattern. Logged once here (CATALOG SIGNAL) rather than
repeated per-template, since every shell-shaped template (Dashboard, and the skipped
Settings/Checkout/List-detail) would surface the identical gap.

### `dial-react` has no Select/Combobox component (carried forward from docs-engine-upgrade v1)

Unchanged since v1's entry above — still real, still not attempted here (component-library
addition, outside a docs-only order's scope).

---

## docs-engine-amendment-craft-contract (2026-08-13) — CodePanel + DocsTable, real root cause fixed

**Root cause (file:line evidence, generator layer not spec-authoring):** the live defect (a
multi-line code sample on `dark-mode`'s "How it works" section rendering as six stacked inline-
code pills) was NOT a spec-authoring mistake — `dark-mode/page.mdx`'s source already had correct
triple-backtick fences (confirmed by reading the file directly, lines 34-44 of the pre-fix
version). The real cause: `apps/docs/src/app/globals.css` only ever styled `.docs-demo-code` (the
class `<Demo>`/`<Playground>` apply to their OWN internal `<pre>`) — a plain MDX-authored fence
written directly in prose, outside those two components, had ZERO `pre`/`code` CSS anywhere in
this app. Confirmed via live `getComputedStyle`: the rendered `<pre>` had `background:
rgba(0,0,0,0)` and `padding: 0px`. Separately confirmed Fumadocs' own `fumadocs-ui/style.css` (the
`.prose` Tailwind-typography base this app's `DocsBody` applies) has no `.prose pre` rule either —
grepped the installed package directly, zero matches. So every raw fence's `<code>` inline element
still carried an inline-code visual treatment with nothing to override it into a real block panel.

**Scope of the defect, confirmed before fixing:** 48 of 56 content pages had at least one raw
fence outside `<Demo>`/`<Playground>` (every component page's "## Import" snippet, `installation`,
`dark-mode`) — this was never a one-page problem.

**Fix, at the generator layer, zero per-page edits:**
1. `next.config.mjs` — added `rehypeCode` from `fumadocs-core/mdx-plugins` (Fumadocs' own real
   Shiki-based transform, not a hand-rolled highlighter) to the MDX pipeline's `rehypePlugins`,
   with `themes: { light: 'vitesse-light', dark: 'vitesse-dark' }` + `defaultColor: false` +
   `addLanguageClass: true`. Every fence now gets real per-token syntax highlighting via
   `--shiki-light`/`--shiki-dark` CSS custom properties on each span.
2. `src/components/mdx/CodePanel.tsx` (new) — registered as MDX's own `pre` override in
   `mdx-components.tsx`, so every fence across all 56 pages automatically gets the shared panel:
   language tag (read from the real `language-xxx` class Shiki/rehypeCode attaches), Copy button,
   token-bound surface/border/padding (`.docs-code-panel` in `globals.css`, same pattern as the
   pre-existing `.docs-demo`/`.docs-demo-code`).
3. `globals.css` — added `.docs-code-panel pre code[class*='language-'] span { color:
   var(--shiki-light) }` + a `[data-theme='dark']` override to `var(--shiki-dark)`. **Bug caught
   and fixed mid-build**: the first version of this rule targeted `.shiki span`, which matched
   NOTHING (CodePanel's `children` prop is only the `<code>` element — the original Shiki `<pre
   class="shiki ...">` wrapper carrying that class is discarded, replaced by CodePanel's own plain
   `<pre>`) — every token rendered in one flat inherited color until this was caught via a live
   dark-mode screenshot showing uniformly white text with no color variation, then fixed by
   targeting `code[class*='language-'] span` (what's actually in the DOM) instead.
4. `src/components/mdx/DocsTable.tsx` (new) — registered as MDX's own `table` override, so every
   raw `| a | b |` markdown table (8 pages have one) gets shared header-row treatment (raised
   surface, semibold) and row rules from tokens, plus a heuristic mono-first-column detector for
   tables whose first column names real code identifiers (none of Dial's current 8 tables trigger
   it — none has an all-code first column — so this path is implemented but not yet visually
   exercised on a real page; worth a synthetic test if this pattern is added later).

**Gates:** G-D9 (a/b/c) + G-D10 + G-D11 added to `.claude/skills/docs-engine/references/gates.md`.
G-D9(a) two-counts Gate-Proofed live: an unclosed fence in `installation/page.mdx` was planted —
caught even earlier than G-D9(a) itself, by MDX's own compiler (`Expected a closing tag for
<DocsBody>`, a build-time 500) — reverted, confirmed 200 again. G-D9(c) Gate-Proofed live: removed
the `pre: CodePanel` registration from `mdx-components.tsx` — a live DOM check correctly flagged
both fences on `dark-mode` as missing panel/language-tag/copy-button (reproducing the exact
original defect) — reverted, confirmed green. G-D9(a) re-run clean across all 56 MDX pages after
revert: 0 mismatches (every real fence ↔ exactly one CodePanel-produced `<pre>`).

**G-D10/G-D11 not yet Gate-Proofed this run** — G-D10 (rhythm: computed-gap-vs-token-value
sampling, prose measure) and G-D11 (table pattern: matrix-shape detection) are written into
`gates.md` with a full plant/red/revert protocol specified, but no plant was actually executed for
either this run — G-D11's structural check IS implicitly exercised (DocsTable is registered
globally and confirmed rendering with the `docs-table` class on both `dark-mode` and
`compared-to-alternatives`), but the gate's own negative case (a raw un-wrapped `<table>` bypassing
DocsTable) was never planted to confirm the check itself fires. A future session should run both
Gate Proofs before either gate counts as more than advisory, per this repo's own standing Gate
Proof Rule.

**Library gates confirmed still green, untouched:** `packages/react` typecheck ✓, lint:no-hardcode
✓ (232 files), test ✓ (46 files / 360 tests). No `packages/react`/`packages/tokens` source edited.

### Follow-up (same session): docs site's own interactive chrome was hardcoded, not using its own DS

Found on direct challenge ("มี motion แต่ไม่เอามาใช้... ยังจะเสือก hardcoded อยู่หรอ") — real gap,
not a false alarm. Two separate violations, both fixed:

1. **Missing motion tokens on interactive chrome I built this session.** `CardGrid.tsx`
   (category/link cards) and the template showcase cards on `/examples` + the landing page had
   zero `transition` on hover-worthy clickable cards — every real `dial-react` component
   (`Card.module.css`'s own `data-clickable:hover` rule, confirmed as the exact precedent) pairs a
   hover state change with `transition: var(--ds-transition-fast); transition-property: ...`.
   Fixed: added `.docs-card-grid-item`/`.docs-template-card` classes to `globals.css` using the
   real `--ds-transition-fast` token + `--ds-color-border-interactive` (the same token
   `card-clickable-border-hover` itself resolves to) for the hover color — verified live via
   Playwright (`transition-duration: 0.1s`, real border-color change measured before/after
   `.hover()`).
2. **Plain `next/link` text links with no hover feedback at all**, where `dial-react`'s own `Link`
   component exists specifically for this (real `color` transition on `:hover`, using
   `--ds-transition-fast` + `--ds-link-*-text-hover` tokens — confirmed via
   `Link.module.css`). Fixed: landing page's "Get started" → `Button intent="primary" asChild`,
   "View all →"/"Read the introduction →" and `/examples`'s "← Dial" → `Link asChild` wrapping
   `next/link` (same pattern already used in the `error-404` template). One (initially confusing,
   confirmed NOT a bug) observation: `Link`'s default `subtle` variant's hover color resolves to
   the exact same token as its base color (`--ds-link-subtle-text-hover: var(--ds-color-text-
   default)`, confirmed in the real token build) — subtle links deliberately have no color-only
   hover cue, relying on the underline-on-hover rule instead, matching this system's own
   established non-color-cue accessibility principle. Not a gap; verified by reading the real CSS
   before concluding anything.

**Real constraint re-discovered mid-fix:** both `page.tsx` (landing) and `examples/page.tsx` were
Server Components importing `dial-react`'s `Link`/`Button` directly — hit the exact same
`createContext`/`useReducer` build error this session already hit and fixed a dozen times for
every example template. Fixed the same way: split each into a thin Server Component wrapper
(`page.tsx`, computes/passes real data as props) + a `"use client"` content component
(`LandingPageContent.tsx`, `ExamplesIndexContent.tsx`).

**No hardcoded duration value was force-fit onto a token that doesn't model it.** The 1500ms
copy-feedback `setTimeout` in `Demo.tsx`/`Playground.tsx`/`CodePanel.tsx`/`TemplateSourceView.tsx`
was checked against `motion.json` — no semantic token exists for "how long to show a transient
confirmation message before reverting" (a UX timing decision, categorically different from
`--ds-transition-*`, which animates a CSS property during a state change, not "duration a state
persists"). Forcing this onto `--ds-duration-slower` (500ms, the closest real value) would
misrepresent a real gap as solved — logged here honestly instead: no semantic token exists yet for
this class of duration. Confirmed via `Card.module.css` (the pattern this session's fixes mirror
exactly) that a color-only hover transition has no `prefers-reduced-motion` override in this
system's own real components either — my additions match the real precedent, not a gap.

Library gates reconfirmed green after this follow-up: typecheck ✓, lint:no-hardcode ✓ (232 files).

---

## kiln audit/build engagement (2026-08-10)

Items found during the kiln audit/build engagement that were not decided or fixed, per that
round's explicit freeze instruction: record, don't act, don't report individually. Escalation out
of this section only happens for the three named exceptions (a previously-green gate goes red, a
data-loss/security issue, or something blocking publish) — none occurred.

Each item: what was found, where the evidence lives, and what the next session should do with it.

### Gate proof coverage — 35 of 42 gates still unproven

`evals/gate-proof-tally-2026-08-10/report.md` has the full breakdown. 7 of 42 gates across the
three sets (precision/coherence/restraint) are fully proven by mutation or fixture pair. 4 are
partially proven (real signal, documented gap). **31 remain advisory-only, permanently, until
someone runs the same mutate/fixture discipline against them.** Per this round's explicit
instruction: this is not a gap to close now. Do not chase full coverage in a future session either,
unless a specific unproven gate's judgement turns out to matter for a real decision — prove gates
on demand, not on a checklist.

Notable unproven clusters worth knowing about if a future session touches them:
- G11 (forced-colours), G12 (baseline), G13 (look-at-it), G14 (acceptance criteria) — unproven in
  all three sets, 12 of the 31 gaps by themselves.
- G12 specifically *cannot* be proven yet regardless of effort — `baseline.md`'s ban list is
  unmeasured, and `measure_baseline.py`'s eight-brief protocol has never been run. This is the
  single highest-value remaining task if a future session has budget for exactly one thing (see
  kiln's own `README.md` framing — this was already known before this engagement, unchanged by it).

### Lineage vector overlaps still open

`evals/vector-distribution-rerun-2026-08-10/report.md`:
- `08-seed-catalogue` ↔ `10-field-guide` — max axis diff 1, genuine mechanical near-duplicate,
  unaddressed. Neither lineage's own file was touched by the M-axis fix or anything else this
  engagement did.
- `12-architectural-drawing` ↔ `16-parts-diagram` — same, max axis diff 1, unaddressed.
- The `03-nautical-chart`/`12-architectural-drawing`/`16-parts-diagram` "border-led triad" the
  full blind test found is a **prose-level** finding (shared mechanism language, shared voice,
  shared failure mode), not a vector-level one — no numeric fix would touch this, and none was
  attempted. If this ever needs fixing, it's a rewrite of shared boilerplate language across three
  files, not a vector edit.

### Gate criteria that were applied to one real case, not proven generally

`evals/floor-cost-2026-08-10/report.md`'s two-part cost test (does the medium pull toward the
refused axis; was the refusal checked at real temptation points) was written into
`gates-restraint.md` and demonstrated once, against Dial's S0 refusal. It has not been run against
a second real case or a constructed counter-example (a system that fakes a costly-looking refusal
on an axis the medium never wanted). If the restraint profile ever gets used on a second real
build, that's the first real stress test of whether this cost language actually holds up outside
the one case it was written against.

### Contrast coverage is a spot check, not a sweep

Both `evals/dial-audit-2026-08-10/report.md` and `evals/gate-proof-2026-08-10/report.md` note the
same gap from different angles: kiln has no script that iterates every text/UI-boundary pairing in
a token file against its declared background and checks 4.5:1/3:1 automatically. `contrast-check.mjs`
(borrowed from Dial's own tooling for this audit) does single named pairs, by hand, per invocation.
A real Gate G3/G9-proving pass at scale would need this built first — it doesn't exist in kiln or
in Dial as a batch tool today.

### Forced-colours mode was never actually run this engagement

Named as not-run in the very first audit pass and never revisited. `gates-precision.md`'s G11,
`gates-coherence.md`'s G11, and `gates-restraint.md`'s G11 are all still `not run` against Dial —
Dial's own `packages/conformance/playwright.config.ts` already has a `forced-colors` project
(used elsewhere in Dial's own prior QA), so this is executable without new tooling, just wasn't
done in the time available this pass.

### Coherence set's Phase-0-through-Phase-8 flow has only ever been exercised via the audit path

Every phase file, verb file, and lineage was built and cross-referenced this engagement, and the
scripts were unit-tested with constructed fixtures — but no full end-to-end build (Phase 0 through
Phase 8, a real brief, a real system produced) has been run through kiln yet. `evals/briefs.md`
lists eight test runs; `evals/results.md` is still empty. This was true before this engagement and
is unchanged by it — noted here because it's the natural next real-world stress test once someone
actually wants to build a system with this skill rather than audit one with it.

### Playwright's `reducedMotion: 'reduce'` project-level launch option didn't reliably fire the media query

Found during the Switch fix verification (`evals/dial-fixes-2026-08-10/report.md`). The dedicated
`reduced-motion` Playwright project (used elsewhere in Dial's own conformance suite) did not
reliably make `window.matchMedia('(prefers-reduced-motion: reduce)')` return true in this
environment — `page.emulateMedia({ reducedMotion: 'reduce' })` was used instead as a workaround and
it worked correctly. This is a tooling environment quirk, not a kiln or Dial code issue, but if
Dial's own `reduced-motion` project-based tests are ever found silently not exercising the
preference they claim to, this is the likely root cause and the fix (switch existing tests to
`page.emulateMedia`) is already proven to work. Not touched further because it's outside kiln's own
scope and Dial's tests that use the project mechanism weren't shown to be actually broken by it in
this pass, only suspected.

### Stray artifact from this session, left alone

A directory literally named `${local_app_data}\Chrome\Cache` (unexpanded environment-variable
string, evidently from a headless-browser cache path template not substituted correctly on macOS)
appeared at the `ds-agent-kit` repo root during Playwright test runs this engagement. Confirmed
harmless (empty aside from browser cache junk) and left in place per the standing rule against
deleting things without being sure what they are. If it recurs or grows, worth tracing to whichever
tool generates it — not investigated further this pass since it's cosmetic and outside both kiln's
and Dial's actual source.

## spacing-engine (Order 4)

### Hardcoded raw `gap` values across 11 Storybook story files in `packages/react/src`

Found sweeping every live Storybook story with the new `spacing-check.mjs` (G-S2 scale purity):
`Drawer.stories.tsx`, `PinInput.stories.tsx`, `Alert.stories.tsx`, `Skeleton.stories.tsx`,
`Image.stories.tsx`, `Dialog.stories.tsx`, `Button.stories.tsx`, `Divider.stories.tsx`,
`Avatar.stories.tsx`, `IconButton.stories.tsx`, `Badge.stories.tsx` all use a raw `gap: 12` (or
`gap: 8`) inline style on a demo-scaffolding wrapper `<div>` instead of `var(--ds-space-100)` (8px)
or the nearest real Dial scale step — a real L1 scale-purity violation (spacing-engine
`references/laws.md`), confirmed via real `getComputedStyle` measurement, not inferred from source.
Not fixed in this pass: (1) it's `packages/react` source, which the repo's forward-only rule says
never gets edited without a `/lock-decision` entry first, and (2) it's Storybook demo scaffolding
around 11 different components, not a docs-app CSS-layer fix — the same "fix at the layer, not the
instance" approach this order used everywhere else doesn't apply cleanly here since there's no
single shared wrapper component all 11 stories go through. Worth a dedicated pass: either add a
shared `<StoryStack gap="sm">`-style helper stories can import, or just replace `gap: 12` →
`gap: 'var(--ds-space-100)'` (or whichever step is nearest) file-by-file.

## dial-braun-rederivation (Order 5)

### G-F2 (form-goal presence) not yet satisfied for 41 of 46 shipped components

`form-language`'s G-F2 gate (`.claude/skills/form-language/references/gates.md`) checks that a
component spec has a FORM GOAL section tracing to `system/FORM.md`'s class table. This order added
one to the 5 identity components it actually touched (`packages/spec/{button,card,checkbox,input,
switch}.md`) — Gate-Proofed clean. The other 41 shipped component specs (Radio, Switch's siblings,
Dialog, Table, etc.) have no FORM GOAL section at all, since retrofitting the full catalog was out
of scope for both the `form-language` and `dial-braun-rederivation` orders. Real, honest gap — not
silently worked around. Whoever does the next full-catalog pass should add a FORM GOAL line to
every `packages/spec/*.md` file, sourced from its component's class in `system/FORM.md`.

### No dedicated Radius/Shadow Foundations page — `shadow.raised.*`/`shadow.inset.*` have nowhere to show live values

The docs site's Foundations section currently has Colors/Typography/Spacing/Motion/Icons pages —
no Radius/Shadow page exists, so the two new depth tokens this order added
(`shadow.raised.sm/md`, `shadow.inset.sm/md`, both themes) have no foundation page to render their
live values on, unlike Colors (which already shows every new D-028 hex value automatically, since
that page reads real built CSS at request time). The order's own guardrail ("Foundations pages
must show the new ramps/depth with live values") is satisfied for Colors but not for depth, because
there's no existing page to extend — building a new Radius/Shadow foundation page was out of this
order's stated scope (color ramps + component depth, not a new docs page). Worth a dedicated pass,
following the same "read real built CSS at request time" pattern the Colors page already uses.

### 11 hardcoded Storybook `gap` values (logged above, spacing-engine order) — now also visible on 3 of the re-skinned identity components

Re-confirmed during this order's own Storybook screenshots: Button.stories.tsx, IconButton.stories.tsx, and Badge.stories.tsx (already on the pre-existing list above) render the new raised-shadow Button correctly, but their own demo-wrapper `gap: 12`/`gap: 8` violation is unrelated to and unaffected by this order — flagging here only to confirm it wasn't silently fixed as a side effect of this pass (it wasn't; still open, same fix recommendation as above).
