# docs-engine-upgrade — PLAN

Audit of Dial's current docs against the order's content model. All counts computed at audit
time via `react-docgen-typescript` (same parser `<PropsTable>` already uses at build time) —
not hand-typed. Scripts run from `apps/docs` (resolves `react-docgen-typescript`); raw JSON
kept at `/tmp/audit2_result.json` (dimension/state extraction) and `/tmp/audit_result.json`
(demo-block counts) for this run, not committed (regenerable, not a truth source).

## Phase 0 facts

- Stack: Next.js 14.2.35 + `fumadocs-ui`/`fumadocs-core` 14.7.7, `fumadocs-mdx` 11.0.0 (`apps/docs/package.json`).
- 46 components in `packages/react/src/components/`; 46 have exactly 1 `.stories.tsx` + 1 `.test.tsx` each. 46 `packages/spec/*.md` files (1:1).
- Truth-source rank confirmed: ① TS source/types (46/46 have it) ② stories (46/46, 1 each — thin, not a variant catalog) ③ conformance specs: only 15/46 components covered (`packages/conformance/specs/*.spec.ts`, verified via each spec's real `story('{category}-{component}--{variant}')` navigation target, not an incidental name mention: Button, Checkbox, Dialog, Drawer, IconButton, InputGroup, Listbox, PinInput, Popover, Radio, RadioCards, Rating, Switch, Toast, Tooltip — corrected from this PLAN's earlier "14" count, which a whole-word text grep had wrongly included "Input" for CSS-selector-only mentions and missed "Toast") ④ token build (`packages/tokens/build/{css,json}/*`) ⑤ `system/DECISIONS.md` (202 lines).
- Chrome/token adapter exists and is real: `apps/docs/src/lib/fumadocsTokenAdapter.tsx` (79 lines, zero hardcoded hex/px — grepped clean). `DocsLayout nav={{ title: 'Dial' }}` (`layout.tsx:34`) — title only, no links/GitHub/version/search-visible row → confirms order's "no top navbar" failure case.
- Sidebar nav data-driven from `packages/react/src/barrel.manifest.mjs` cross-checked against Storybook `storySort` (`apps/docs/src/lib/nav.ts`) — not hand-typed, no two-counts risk found here.

## Computed scores (46 component pages)

**Demo floor (G-D1): 6/46 pass.** Floor = (enum-prop count + state-prop count, from real TS
prop types) + 3. Today: 114 demo blocks total across 46 pages; floor requires 209 → **95 more
demos needed**, concentrated in components with real multi-dimension APIs currently stuck at
2-3 demos: `Flex`/`Stack` (5 dims, 8 floor, 2-3 demos), `RadioCards`/`IconButton`/`Image` (4 dims,
7 floor, 2 demos), `Button` (4 dims: variant/intent/size/loading, floor 7, has 4).
Passing today: `AspectRatio`, `Card`, `Dialog`, `Drawer`, `Switch`, `Table` (all 0-dimension → floor 3, already met).

**G-D2 dedupe:** 0 byte-identical paragraph pairs found in spot-checked pages (Button clean). Full sweep deferred to build step (script, not manual).

**G-D3 render integrity:** 0 raw literal-backtick-in-JSX-text matches across all `.mdx` — clean today.

**G-D4 nav integrity:** sidebar generated from the same manifest as the package barrel — no hand-typed second list to drift. Not yet checked: does every generated nav entry actually 404-free resolve (needs a build+crawl, done in Phase 3).

**G-D6 non-prose floor (overview/guide pages): 0/5 have a card grid, comparison table, or stepper.** `introduction` (27 lines), `installation` (66 lines), `theming` (51), `dark-mode` (54), `compared-to-alternatives` (47) are prose-with-code-fences only — confirmed FAIL, matches order's stated failure case exactly. Foundation pages are NOT in this bucket and already pass: Colors/Typography/Spacing/Motion/Icons each render live specimens (`<FoundationSwatch>`/`<TypeSample>`/`<SpaceBar>`/`<DurationRow>`/`<IconSizeSwatch>`, all reading `packages/tokens/build/json/*` at render time, not retyped).

**G-D7 chrome tokens:** clean today (0 hardcoded hex/px in adapter or globals.css).

**Checklist coverage across the 46 component pages (counts, not estimates):**
- Point 7 (Do/Dont ≥2 pairs): 46/46 have `<DoDont>`.
- Point 8 (generated props table): 46/46 use `<PropsTable>` (react-docgen-typescript-backed).
- Point 9 (keyboard table): only 17/46 use `<KeyboardTable>` — the other 29 either have no keyboard behavior worth a table or are silently missing one; not yet classified per-component (Phase 3 work).
- Point 10 (accessibility prose): 46/46 have an `## Accessibility` section.
- Point 11 (CSS custom properties table): 46/46 have `<TokenList>` — already generated from token build output, not hand-typed (confirmed via `TokenList.tsx` source: calls `resolveTokens()`).
- Point 12 (Related, 3-4 siblings): 46/46 have `## Related`.
- Point 13 (footer prev/next): only 12/46 — most pages have a Source line but no prev/next.
- Point 2 (badge row — bundle size / a11y status / since-version): **0/46.** Does not exist at all today. `since-version` is available (`packages/react/package.json` is `0.1.0` — single version, so this badge is trivially "0.1.0" everywhere until a real release history exists). Bundle size needs a real size-limit-style build step (does not exist yet — SPEC DEBT, Phase 2 builds it). a11y status can be derived honestly today: 15/46 components have conformance coverage → badge reads "Verified" for those, "Unverified — no test" for the other 31 (Honesty Rule, not a placeholder; corrected from an earlier "14/32" miscount — see the truth-source-rank note above).

## SPEC DEBT candidates (from research protocol step 4 — nothing invented, gaps named)

1. **Bundle-size badge has no generator.** Neither `packages/react` nor `apps/docs` has a
   size-limit/bundlesize tool installed. Needed before checklist point 2 can show a real number
   per component. Phase 2 adds a minimal per-export size script (esbuild --minify + gzip, no new
   runtime dependency).
2. **29/46 components' keyboard behavior is unclassified** (has real keyboard behavior worth a
   table vs. genuinely nothing beyond native semantics). Phase 3 classifies each against its own
   spec/test file, not guessed — components with no test asserting a specific key get "UNVERIFIED
   — no test" per the research protocol's own instruction, never an invented row.
3. **32/46 components have no conformance spec** — their a11y badge will read "Unverified" honestly
   rather than claim a pass that was never tested. Writing 32 new conformance specs is out of this
   order's scope (that's component-engineer/qa-a11y territory, not a docs-engine job) — the badge
   reports the gap truthfully instead of hiding it.
4. **Icons foundation page's source-of-truth gap** (already logged in `BACKLOG.md` prior to this
   order — Dial has no formal icon inventory) carries forward unchanged; docs-engine will not
   invent one.

## Demo-ladder outline (derived, not hand-designed — sample of the largest gaps)

- **Button** (4 dims: variant/intent/size/loading; floor 7, has 4): add variant×intent combined
  matrix demo, size ladder demo, disabled-state demo (currently only `loading` demoed, `disabled`
  prop exists on native button but has no dedicated demo), asChild-as-link composition demo.
- **Flex/Stack** (5 dims: direction/gap/align/justify/wrap; floor 8, has 2-3 each): these are
  layout primitives — ladder = one demo per prop dimension (not per combination, which would be
  combinatorial) + one real composition demo (e.g. Stack inside Card). This is the shape the
  content model's "composition patterns" bucket exists for.
- **IconButton/RadioCards/Image** (4 dims each, floor 7, 2 demos each): same treatment — one
  demo per real enum dimension pulled straight from `type.value` (never invented), plus the
  state props already declared (`loading`/`disabled`/`invalid`/`required` where present).
- Full per-component gap table (46 rows, computed) held in `/tmp/ladder_data.json` this run;
  Phase 2's `docs audit` verb regenerates this on demand rather than it being a static artifact.

## Chrome work list

1. Replace `nav={{ title: 'Dial' }}` with a real top navbar config: product name + version
   (`packages/react/package.json` version, read at build time) + search (already exists via
   `DialSearchDialog`) + GitHub/changelog link (BACKLOG already notes no public remote yet —
   link omitted honestly, not faked) + theme toggle (already exists, but
   `BACKLOG.md`'s existing note that Fumadocs' own toggle has no `aria-label` should be fixed
   here since docs-engine now owns the navbar work).
2. Build 5 overview/guide pages' non-prose structures: Introduction → category card grid (from
   `COMPONENT_CATEGORIES` in `nav.ts`, not retyped); Installation → per-package cards + copy
   commands; Theming/Dark mode → real before/after or token-flow diagram structure;
   Compared-to-alternatives → real comparison table (already has a comparison *intent*, per
   `BACKLOG.md`'s note that the comparison set itself was defaulted — table structure is this
   order's job, the comparison-set content decision is not, stays logged).

## What this plan does NOT do

Does not redesign IA, does not add new components, does not touch `packages/react`/`packages/tokens`
source (forward-only rule stands), does not resolve the 4 SPEC DEBT items above (only names them
for Phase 2/3 to work against with honest UNVERIFIED labeling, never invented content).

---

# docs-engine-v2 (examples + editorial) — PLAN addendum

Inventory scan against `packages/react/src/index.ts`'s real 46 exports (grepped directly, not
assumed) — confirms which of the order's 10 canonical templates are buildable and names exactly
what's missing for the rest. No component code was touched to produce this table.

## Real gaps confirmed (grepped, not guessed)

`packages/react/src/components/` has **no** `AppShell`/`Sidebar`/`Navbar`/`Menu`/`Dropdown`/
`Breadcrumb`/`Pagination`/`Tabs` component — confirmed absent by directory listing, not inferred.
Every template needing dashboard-shell chrome (persistent sidebar nav, top app bar, breadcrumb
trail) must compose one from primitives (`Box`/`Flex`/`Stack`/`Divider`/`Link asChild`) — this is
real composition, not a workaround, but it means "AppShell" is a CATALOG SIGNAL every shell-shaped
template will independently surface, logged once here rather than 4 times per template.

Real capabilities confirmed present that make several templates buildable despite the shell gap:
`Link`'s `asChild` (Radix `Slot`) → real Next.js `<Link>` routing inside nav items · `Card`'s real
5-part compound (`Root`/`Header`/`Body`/`Footer`/`Media`) · `Table`'s real `density`
(`compact`/`comfortable`, already shipped — the order's own predicted gap does NOT materialize)
· `Stat`'s real trend direction with non-color glyph cues · `Dialog`/`Drawer`/`Toast`/`Popover`
all Radix-backed with real trigger/content APIs · `RadioCards`/`Fieldset`/`FormField` for
structured forms · `Listbox` for real single/multi-select lists.

## Template catalog decision

| Template | Status | Required components (real, checked) | Missing |
|---|---|---|---|
| Dashboard | **BUILDABLE-WITH-GAPS** | Stat, Card, Table, Badge, Button, IconButton, Divider, Flex/Stack/Box (shell) | AppShell/Sidebar/Navbar (compose from primitives — logged once, see above) |
| Settings | **BUILDABLE-WITH-GAPS** | FormField, Input, Switch, Select-like control, Fieldset, Button, Card, Divider | Same shell gap as Dashboard; no native Select (already logged in BACKLOG from v1 — Listbox isn't a drop-in) |
| Sign-in / auth | **BUILDABLE** | FormField, Input, Checkbox, Button, Link, Card | none — smallest real composition, no shell needed |
| Pricing | **BUILDABLE** | RadioCards, Card, Badge, Button, Text, Heading, Divider | none |
| Checkout / form-heavy | **BUILDABLE-WITH-GAPS** | FormField, Input, InputGroup, RadioCards, Fieldset, Button, Table (order summary), Alert | No stepper/wizard component — compose via Text + manual step state, log as CATALOG SIGNAL |
| List-detail | **BUILDABLE-WITH-GAPS** | Listbox, Card, Table, Badge, Divider, Text | Same shell gap (persistent list pane + detail pane needs Flex-composed shell, not a dedicated split-view component) |
| Blog / article | **BUILDABLE** | Heading, Text, Divider, Badge, Avatar, Link | none |
| Landing / marketing | **out of scope here** | — | — |
| Empty states | **BUILDABLE** | Icon, Heading, Text, Button, Stack/Center | none |
| Error pages (404/500) | **BUILDABLE** | Heading, Text, Button, Link, Center | none |

**Decision: build 6 templates this run** — Sign-in, Pricing, Blog/Article, Empty-states, Error
(404), and Dashboard (the one WITH-GAPS template worth proving the shell-composition pattern on,
since Settings/Checkout/List-detail would just repeat the identical AppShell gap without adding
new signal). This is within the order's own "expect ~4-6" estimate. Landing/marketing is not a
`/examples/*` template — it's the docs site's own landing page, covered by the editorial capability
instead (rebuilding `apps/docs/src/app/page.tsx`, confirmed to be a bare unstyled placeholder today
— real finding, not assumed).

## Skeleton assignment (distinct macrostructure per template contract point 6)

- **Sign-in** — centered-card skeleton (single focused card, no chrome)
- **Pricing** — three-column comparison skeleton (RadioCards as plan selector, symmetric grid)
- **Blog/Article** — single-column measured-prose skeleton (60-80ch, no sidebar)
- **Empty-states** — centered-icon-and-message skeleton (same family as Sign-in's centering but
  zero form controls — distinct enough per the contract's own "no two templates share the same
  page skeleton" test: one has a Card+form, the other has an Icon+CTA only)
- **404** — centered-icon-and-message skeleton variant with a distinguishing element (error code
  as oversized `Text`, not shared verbatim with Empty-states — logged if this ends up too close
  during build)
- **Dashboard** — shell skeleton (persistent left nav + top bar + main content grid) — the one
  template exercising the composed-shell pattern

## Landing page outline

Hero pulls its "what this system IS" line directly from `system/DECISIONS.md` D-001's own
`**เพราะ:**`/positioning language (translated to the docs site's English register, not invented) —
"a Braun-derived design system: calm, restrained, accent-scarce," already the exact line
`/introduction` uses today. Stats row: component count (46, `ls packages/react/src/components`),
demo count (209, from `audit.mjs`), a11y-verified count (15/46, from `a11yVerified.ts`'s real
`story()`-call extraction, computed at build time, not hand-typed) —
all three computed at generation time, none hand-typed. Category card grid reuses `CardGrid` +
`COMPONENT_CATEGORIES` (built in v1). Template showcase strip links to the 6 new `/examples/*`
routes with generated thumbnails. Install command block reuses the real `npm install dial-react
dial-tokens` command already on `/installation`. No GitHub-star badge, no fake metric — `docs.
repoUrl` config key (new) gates any external link; absent today (confirmed: no public remote) so
that link renders as nothing, not a dead href.

