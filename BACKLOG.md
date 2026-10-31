# Backlog

Single backlog for the kiln engine. Dial's backlog history moved with it to the `dial` repo
(tag `dial-final` in this repo marks the split).

Not a priority list — order of discovery.

---

## Engine still carries Dial assumptions (found during the 2026-10-26 split)

- `tooling/generate-barrel.selftest.mjs` copies the real `packages/react/src/index.ts` instead of
  a fixture — fails on a blank engine. Needs its own fixture under `tooling/__fixtures__/`.
- Dial names/paths still hard-coded in: `tooling/{pack-verify,smoke-import,doc-count-check,
  generate-barrel,contrast-check,story-categories,spacing-check}.mjs`, `docs/{BLUEPRINT,CATALOG,
  KIT-CHANGELOG}.md`, `.claude/skills/{ds-conventions,production-run}/SKILL.md`. Should read the
  system's package names from `system/` config instead.
- `apps/docs` + `apps/storybook` shells left with Dial (they mixed engine chrome with Dial
  content). Engine needs them back as templates under `templates/`, content-free.
- ✅ (resolved by 2026-10-30, checked) `.claude/settings.json` hooks don't enforce: PostToolUse lint ends in `|| echo` (always exit 0,
  never blocks), PreToolUse reads `$CLAUDE_TOOL_INPUT`, which hooks don't receive (input comes as
  JSON on stdin), so the DECISIONS.md guard likely never fires. UNVERIFIED — not run yet.

## Pane pilot (2026-10-26, rebuilt from anchor A)

- **Safari/Firefox ไม่ได้วัด** — glass-evidence + conformance รันแค่ Chromium
- **`@supports not (backdrop-filter)` ไม่ได้ทดสอบตรงๆ** — ค่าเดียวกับ reduced-transparency ซึ่งวัดแล้ว. UNVERIFIED.
- **ฉากเป็นรูปจริง 4 รูปแล้ว** แต่ทุกรูปมีจุดสว่าง → dim/mid ยัง UNCALIBRATED (0.36 เท่า bright) ต้องหารูปมืดจริงมาวัด; avatar/cover ยังเป็น placeholder
- **Environment ต้องประกาศเอง** — เว็บอ่าน pixel หลังกระจกไม่ได้; ถ้าแอปตั้งต่ำกว่าจุดสว่างสุดของฉาก ตัวอักษรตก (harness `env-misuse` วัดได้ 2.15–2.64:1). ทางเลือกในอนาคต: sample ภาพพื้นหลังที่แอปรู้จักตอน build แล้วเลือก environment ให้อัตโนมัติ
- **ตัวอักษรบนรูปใน post** ผ่านกับรูปตัวอย่าง (scrim + จัดตำแหน่ง) แต่ระบบไม่การันตีกับรูปจริง — ยังไม่มี component Media/Overlay ที่บังคับ scrim
- ✅ (resolved by 2026-10-30, checked) **Props table เขียนมือ** — conformance จับ prop ที่เขียนแต่ไม่มีจริง แต่ไม่จับ prop จริงที่ไม่ได้เขียน; Tabs/Tag มีแค่ pass-through
- **Stack deviation:** token build เป็น script ของเอง ไม่ใช่ Style Dictionary; docs เป็น Vite ไม่ใช่ Fumadocs
- **Avatar fallback** เป็นขาว/ink ไม่ใช่ portrait gradient แบบใน anchor — ถ้าอยากได้ต้องเพิ่ม token
- **user-level hook `amac-linter`** fail บนทุก .tsx (ไม่มี eslint config) — ไม่ใช่ของ kiln

- **Environment ที่ sample รูปจริง** — ทางปิด E-001: แอปรู้รูปพื้นหลังของตัวเอง → วัดความสว่างใต้ตำแหน่งการ์ดตอน runtime/build แล้วหรี่เฉพาะการ์ดที่ทับจุดสว่าง (การ์ดอื่นใสได้ถึง ~0.6)
- **ย้าย tooling วัดกระจกเข้า kiln engine** — text-contrast / glass-evidence / glass-sweep / docs-meta ตอนนี้อยู่ใน pilot เท่านั้น; ควรเป็นเครื่องมือกลางของ kiln (system-agnostic, อ่าน routes/harness จาก system config)
- **docs-engine scripts/audit.mjs ยังไม่ได้รันกับหนังสือ Pane** — audit script ของ skill เขียนสำหรับ MDX/Fumadocs; content-model floors ตอนนี้บังคับผ่าน conformance ของ pilot แทน

## Pane: gaps from the 10-system research (2026-10-26, not gated yet)

- Live sandbox per example (StackBlitz/CodeSandbox) needs the packages published first, which is the user's call.
- Props playground generated from the props table (Carbon, Spectrum), with a backdrop picker.
- Increased-contrast token mode as a third column next to light and dark (HIG colour spec).
- Content design foundation: voice and tone, inclusive language, date and time, messages (Atlassian).
- Figma library whose variables mirror the tokens in both themes, with a parity check.
- Versioned docs and migration guides before 1.0 (MUI, Carbon).
- Feedback, research and roadmap sections per component (GOV.UK).
- Screen reader passes (VoiceOver, NVDA) recorded by hand; until then nothing can be Stable.
- Site-wide search over headings, tokens and props.

## Found by spec-capture (2026-10-27)

- ✅ (resolved by 2026-10-30, checked) **Raw `opacity: 0.5` for disabled** in `Button.module.css:32`, `Select.module.css:18,43`, `Slider.module.css:8`. (The `opacity.disabled` token now exists, added with the W3 forms, which already use it; the four old places switch over in their rounds.) Also `Slider.module.css` scales the thumb on hover with a raw `scale(1.08)`. Iron rule 1 says component code holds no raw values, and `tooling/no-hardcode-lint.mjs` does not check `opacity`, so it slipped through. Fix: a semantic `opacity.disabled` token with a kiln.why, used in all four, and `opacity` added to the lint. Blocked on the derivation guard (all three are in `rationale.pendingDerivation`), so it lands with each one's derivation round.
- **Tag letter-spacing shows "no token" on the Style tab**: spec-capture cannot match Tag's `letter-spacing` (0.88px) back to `type.tracking-caps` because the em ratio rounds off. Match em tokens with a tolerance instead of string equality.
- ✅ (resolved by 2026-10-30, checked) **Every 32–36px control is below P6's touch floor**: Button `sm`, IconButton (both sizes, 36px and 32px), Chip and Tabs triggers are 32–36px with no 44px hit area, while P6 says "every target is at least 44px in its smaller dimension or has a 44px hit area". Banner's dismiss shows the fix already in the system (a `::after` hit area from `layout.touch`). Tabs also has a hover transition and no hover rule (P4). Found while writing the depth pages (the first-edition IconButton chapter even claimed both its sizes met 44px); the docs now say so under each component's Limitations. Fix lands with each component's derivation round (all are in `pendingDerivation`), and a conformance check for 44px hit areas should land first so it cannot recur.
- ✅ (resolved by 2026-10-30, checked) **Avatar has no forced-colours rule**: in high contrast mode the circle has no edge (P6 says structure survives without glass). Fix lands with Avatar's derivation round.
- ✅ (resolved by 2026-10-30, checked) **Select prop docstrings fail the tone gate** (`/components/select/code`): "Required: a select without a name…" and "Native disabled behaviour: not focusable…" are label colons in `Select.tsx`, which the derivation guard blocks until Select's round. Rewrite them then.

- 2026-10-27 · `--ds-type-mono` is read by `apps/docs/src/depth/depth.css` (redline labels) but no token declares it; the `ui-monospace` fallback is what renders. Found by kiln's new token-contract check. Add a `type.mono` token with a reason, or drop the var.
- 2026-10-27 · kiln's new gates (G-TT1 44px hit areas, G-SM1 anchor scroll-margin, G-NAV1, G-TODO1) have not run on Pane yet. Sync the engine and expect G-TT1 red on IconButton md (36px) and Tabs pills (32px), both already listed above.

## Queued after wave 10 (user, 2026-10-29: "ทำตามแผนไป ไม่แทรก")
- **Docs nav as collapsible sections (MUI-style ref)**: the sidebar will be too long once waves 6–10 land. Top-level groups that fold, one open at a time by default, the current page's group open: Getting started (Overview, Installation, Usage, MCP, llms.txt, Templates, Accessibility, Supported components, Supported platforms, Versions), Foundations, Components (by family, as CATEGORIES), Component API, Customization (tokens, theming, mesh), How-to guides, Integrations, Migration. NEW badge for recent pages. Must keep G-S1–S4 (drawer on narrow screens) and focus behaviour.
- **Component API chapter**: one page per component that is only the generated API (props, types, defaults, CSS custom properties, data attributes, keyboard), linked from each component's Code tab; built from meta.json so it can't drift.
- **MCP + llms.txt for consumers**: a `pane-mcp` server (list components, get props/usage/do-don't, search tokens, mesh presets via the existing `pane-mesh` logic) and a generated `llms.txt` / `llms-full.txt` from the book, with a Getting started page for each. Local stdio only; no publishing (Phase 8 stays with the user).

## Gaps against MUI X (read 2026-10-30, github.com/mui/mui-x + mui.com/x)
- **Built-in strings are English and not configurable** (Calendar "Previous month", charts "Show table", Table "Loading rows", "Nothing to show yet", PasswordInput "Show password", CommandPalette, Carousel, OTPFlow…). MUI X ships locale packs and a localeText prop. Needs a `<PaneProvider locale messages>` with Thai and English packs; the Thai consumer (mtg) needs it first. HIGH.
- **DataGrid**: no filtering (column or quick filter), no multi-sort, no pagination hookup, no column resize, reorder, visibility or pinning beyond the first column, no header groups, no cell editing, no row grouping, aggregation, pivot, tree data, master-detail, no virtualisation inside the grid, no export (CSV, Excel, print) or copy-paste, no server-side data mode, no toolbar. MUI X Community has editing, sort, filter, pagination; Pro adds pinning, reorder, tree data, virtualisation; Premium adds grouping, aggregation, Excel.
- **Pickers**: no DateTimePicker or time range, no typed segment field (MUI's Field components), no shortcuts (Last 7 days), no month/year views, no timezone or other calendar systems, no adapter for date libraries (Pane uses Intl only), TimePicker is a list not a clock.
- **Charts**: no Pie/Donut, Scatter, Gauge (Meter covers a single value), Funnel, Sankey, Candlestick, radial; no composition (bar + line on one axis), zoom and pan, brush, export, cross-chart highlighting, dataset API, grid integration.
- **TreeView**: no multi or checkbox selection, no lazy-loaded children, no drag reorder, no label editing, no virtualisation.
- **Scheduler** (day/week/month events) and **Chat** (AI chat UI): Pane has neither.
- **Practice**: MUI X has unit tests with coverage (Vitest, Codecov); Pane has browser gates and conformance but no unit tests. MUI X versions docs per major with migration guides; Pane does not yet. MUI X ships AGENTS.md and skills; Pane plans pane-mcp + llms.txt.

## Flagged back by a consumer (an evidence/graph app, 2026-10-30)
- ✅ 2026-10-30 shipped (X11). **NodeCard**: a card that is a node on a canvas (ports, selected, dragging, collapsed). Generic for any node-link canvas → X11.
- ✅ 2026-10-30 shipped as NetworkGraph size="mini". **MiniGraph**: a small node-link graph (network) preview. → X11 NetworkGraph, with a table view of nodes and edges like every chart.
- ✅ 2026-10-30 as a Badge recipe (BadgeProvenance example; tones, no new kind). **DatasetBadge** ("synthetic data"): provenance of the data shown (live, sample, synthetic, stale). → a Badge kind plus a "Data provenance" pattern page; must read by word and glyph, not colour.
- ✅ 2026-10-30 D-032 + ConfidenceChip. **Evidence confidence colours conflict with the data palette**: confidence is an ordered magnitude, so it must not use categorical hues (D-031 is identity only). → a sequential ramp (one hue, faint to full, `data.seq-1..5`) and an ordinal chip that pairs the step with a word and Scale-style dots; decision D-032.
- **MoneyFlow**: flows between parties → X4 Sankey (with the table view).
- ✅ 2026-10-30 SequenceDiagram (X11). **Sequence**: an ordered exchange between actors (lanes and messages) → SequenceDiagram / swimlane timeline, a sibling of Timeline. → X11.
- **PerfOverlay**: a developer overlay for frame time and glass cost. Not a product component; offer as a dev-only tool (`pane-react/devtools`) if wanted.

## Token sheet split (PEG, 2026-10-30, measured: CSS 27.6 kB gz with tokens.css, 13.7 of it the sheet)
- Component tokens move into each component's CSS file (arrive only with the component).
- Separate entries: `pane-react/tokens/core.css` (space, size, radius, type, motion, z) and `pane-react/tokens/colour.css` (ramps, semantic colours, themes, environments), so a product with its own colours loads core only. tokens.css stays as both.

## Variant and sub-state completeness (user, 2026-10-30 evening)
"ไปสำรวจหาแต่ละ component มันจะมี variant state ย่อยอีกเยอะ … ดูให้ครบ". Audit of all 118 against MUI/Carbon/Ant/HIG/Radix/Fluent running in four groups (A actions+fields, B selection+nav, C overlays+surfaces+layout, D data+charts+patterns); results in the job's tmp/audit/{A,B,C,D}.md, then P1 gaps built wave by wave with gates (G-SV1 state matrix row per new state).

## Flagged back by a consumer (Lumen mobile chat mock, 2026-10-30 night)
Bugs, into the next wave:
- **Navbar**: on a 390px screen the brand slot never shrinks (flex 0 1 auto, min-width auto), pushing actions off the edge. → brand `min-inline-size: 0` + truncate; G-S1 at 375px on a long brand.
- **SettingsRow + RadioCards/Slider**: the label shows twice (row label and the control's own required label). → controls take `aria-labelledby` / a hideLabel, SettingsRow wires it.
- **Accordion**: title is string-only, so a live title (a timer) is impossible. → title: ReactNode.
- **Mesh** at small sizes (≤64px) is a flat wash: the pool blur is fixed at 40px. → blur scales with the mesh's size (container units).
Gaps, mapped to the variant waves:
- **Sheet**: detents (medium/large), drag to dismiss with velocity, scale the view behind (iOS card). → wave C (audit C P1 detents).
- **Drawer**: follows the finger from an edge swipe; main view shifts/scales behind. → wave C.
- **List/ListItem**: swipe actions (reveal Pin/Archive/Delete, full swipe to delete). → wave D (List).
- **ContextMenu**: preview/lift slot and a header slot (reaction bar). → wave B (Menu family).
- **Menu**: checkbox and radio items (menuitemradio). → wave B P1, already listed.
- **CodeBlock** component and syntax colour tokens that pass 4.5:1 on the well in both themes. → new component (wave D/Type); syntax ramp validated like D-031.
- **Motion**: spring tokens and an interruptible gesture helper (`pane-react/motion`). → new foundation, after the waves.
- **Chat**: bubble, composer (Textarea autoResize is in wave A), status pill that morphs (Dynamic Island). → Chat pattern (MUI X gap list already has Chat), after wave D.

## JD gap waves (user, 2026-10-31 night: "เว็บนี้ตอบได้ทุกข้อยัง ถ้ายังก็จัดเต็มซะ", a Senior Product Designer, Design Systems JD at OpenLoop Health)
Order, after wave A ships:
- **J1 White-label theming**: brand token sets layered on the semantic tier (2–3 sample client brands), a brand switcher in the docs header beside theme and scene, a Theming chapter (what a brand may override, what it may not, contrast re-measured per brand by the evidence run), `pane-theme` CLI that validates a brand file.
- **J2 Figma variables pipeline**: DTCG ⇄ Figma variables JSON both ways (`pane-figma export|import`, modes = themes and brands), a drift check that diffs a Figma export against the tokens and fails on mismatches, a docs page for the round trip.
- **J3 AI skills**: ship a Claude Code skill for building with Pane (`pane-react/skill/SKILL.md`: which component for which job, the iron rules, the states each family must handle), agent instructions page, the MCP gaining `check_usage` (lint a snippet against the rules).
- **J4 AI interaction patterns**: Chat (bubble, composer, streaming text, tool call rows), AgentStatus (thinking, working with steps, waiting on a human, done, failed), HumanHandoff (escalate, take over, hand back), Citation and Confidence on answers. With the Lumen mock findings.
- **J5 Data-dense ops**: FilterBar (chips, saved views, clear all), bulk action bar on selection (Table and DataGrid), row actions, density toggle, complex form patterns (sections, conditional fields, review step), DataGrid X2 resumes.
- **J6 Motion**: spring tokens and an interruptible gesture helper, a motion principles chapter with live specimens (enter, exit, move, feedback, reduced motion).
- **J7 Governance and adoption**: contribution and RFC process, deprecation and versioning policy page, `pane-adoption` CLI that scans a product repo (Pane imports vs raw elements and hard-coded values) and reports a score; an Adoption page.
- **J8 Clinical and regulated**: a healthcare sample flow (intake form, appointment, results table with abnormal flags by glyph and word), WCAG 2.2 AA evidence page per component already exists; add an accessibility conformance report export (VPAT-style).

## M1 Materials, first in the queue after J4 (user, 2026-10-31: "มีแนว skeuomorph กับ glassmorph ต้องทำให้ theme ตรงนี้ชัดเจน … IA ดีๆ ux journey ดีๆ ai mcp รู้เรื่องด้วย api ดีๆ")
- One axis, two materials: **glass** (translucent, needs a scene) and **solid** (the same lit, carved, physical shapes, opaque). The physical shape language is shared; material only decides translucency. One material per screen.
- API: `<Environment material>` (exists, D-021) is the one switch; `data-material` for plain HTML; documented defaults, reduced-transparency falls back to solid by itself.
- IA: Foundations opens with **Materials** (decision journey: is there a scene, is it live, does the brand want glass), a comparison on three backdrops, the generated token diff, per-component notes, mixing rules, accessibility, API. Getting started gets a **Choose your look** journey: material → theme → brand → environment.
- Header: one **Appearance** control holding material, theme, brand and backdrop instead of four separate controls.
- AI: MCP `choose_appearance` (guidance and code), knowledge carries materials and brands, the skill and llms.txt say how to choose; check_usage flags glass with no Environment and mixed materials.
- Evidence and gates under `KILN_MATERIAL=solid`; a gate that fails a screen mixing materials.
- Glass look itself waits on the concept-check pick (R-032).
- [ ] kiln gates from R-035: (a) a playground's starting values must equal the current tokens it models; (b) command palette results must not repeat a label within one query; (c) docs controls with ≤3 options must be segmented.
