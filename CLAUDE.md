# Design System Factory — Orchestrator (kiln DS v1)

**This kit is a factory — it has no style of its own.** Style, platform, and colour are decisions
of the **system** currently in `system/` (switching to a new workload: `/new-system`). It produces
a complete design system end to end: tokens package + React component library + docs site +
Storybook, every build declaring a **lineage** (one named tradition from outside web/UI) and an
**intensity vector** (six axes, enforced arithmetic) so output doesn't collapse toward the
statistical middle. Full spec: `docs/BLUEPRINT.md` (read on demand, never copy the whole file into
context). kiln's own phase/reference files (`.claude/skills/kiln/`) are the source of truth for
lineage, vector, and gate mechanics — this file routes to them, it doesn't restate them.

## Memory Protocol (every session, no exception)

1. Read `system/STATE.md` — phase, what's in progress.
2. Read `system/DECISIONS.md` — what's locked. **Never contradict a locked decision.**
3. End of every real task → update `system/STATE.md` (phase, last work, next work).
4. Every structural decision → through skill `lock-decision` only, same format every time.
5. Extraction reports live in `system/reports/` — reference by path, don't copy content in.
6. One BACKLOG: **root `BACKLOG.md`** (not a skill-scoped copy). Anything found-but-not-decided
   goes there, once, regardless of which agent or phase found it.

## Iron rules (any violation is a bug, immediately)

1. **Three-tier tokens:** primitive → semantic → component. Component tokens never point at
   primitive directly; component code never has a raw value (hex, px) — the lint hook catches it.
2. **Interaction loop:** PROPOSE → RENDER → CONFIRM → LOCK → NEXT. Any decision that's
   *visually* checkable (colour, style, spacing, component variant, vector) renders candidates to
   `apps/lab/` (append to `apps/lab/candidates.js`, tell the user to open `apps/lab/index.html`)
   before CONFIRM, always. `/lock-decision` attaches the winning candidate's screenshot path.
   After every Phase 1/2 lock and every WAVE REPORT, invoke `publisher` (System Sheet duty) to
   refresh the system's PNG summary. Never guess on the user's behalf on anything irreversible.
3. **One question at a time.** Never dump multiple questions together — propose with reasoning +
   2–3 options + a recommended default.
4. **Dependency order:** Layout primitives → Tier 1 atoms → Tier 2 molecules → Tier 3 organisms.
   Never skip.
5. **Definition of Done for a component = Anatomy Contract's 9 points + docs-content point 10 +
   conformance point 11** (skill `ds-conventions`). Incomplete on any point = not done.
6. **The QA gate is sacred:** a component that fails `qa-a11y` never enters docs/Storybook, never
   gets committed as done.
7. **Rigor Tiers scale the rigor, not the standard** (`ds-conventions/SKILL.md`) — T1
   static/T2 interactive/T3 keyboard-focus get different QA depth, never a different bar.
8. **Docs pages are written the moment a component passes QA**, not batched to the end — see
   pipeline Phase 4–5 below. A component "done" with no docs page is not done.
9. **Anchor round before any build.** Before tokens, components, docs or a pilot, pick ONE
   concept-dense component (e.g. a card with several overlapping layers: image, avatar over cover,
   stats, pill tabs, a nested card, actions) and render 3–4 variants of it — same content, all
   inside the direction of the user's refs, differing on axes that matter — in `apps/lab/`. The
   user picks one as the anchor; everything after derives from it. Never pick the visual
   direction on the user's behalf.
10. **Docs are a book, built to `docs-engine`'s content model — never a page written on request.**
    Any docs work (a page, a site, a pilot) loads skill `docs-engine` first and builds to
    `references/content-model.md` in full: every component page at its 13 points with the demo
    floor `variant_count + 3`, generated props/keyboard/CSS tables, badge row from real sources;
    foundations with live specimens; overview/guides with a non-prose structure; plus chapters for
    principles, patterns, accessibility evidence and a full token reference. The agent decides the
    structure and writes the substance — the user should never have to list what goes in. Docs that
    haven't cleared the content-model floors are not done (2026-10-26: a one-page docs and a first
    book draft both shipped below floor because the skill was never loaded).

## Phase order + who does it

Two mechanisms compose into one pipeline: kiln's lineage/vector phases (0–2, system-level, run
once per system) hand off into the component-production loop (3–8, run per wave). Read the phase
file when you reach that phase, not before — reading ahead pulls the work toward the finished
shape instead of the decision in front of you.

| # | Phase | Owner | Output | User checkpoint |
|---|---|---|---|---|
| 0 | Interpret | `interpreter` | relationship card + lineage pick + ≤3 questions answered | vibe vs. exact / which ref is primary |
| 1 | Vector | `foundation` | six-axis intensity vector, `check_vector.py`-clean, scale decisions (spacing/type/color/radius/shadow/**form language** via skill `form-language` → `system/FORM.md`/…) | lock every topic (7–8 rounds) |
| 2 | Foundations | `foundation` → `token-architect` | `packages/tokens/` DTCG 3-tier + build | review token preview |
| 3–5 | Components | skill `production-run` (waves) | component complete to full contract, one wave at a time; **docs page written the moment each component passes QA** | BATCH API REVIEW, one per wave head (ORDERS C4 — no end-of-wave checkpoint except a new-pattern Template Checkpoint) |
| 6 | Docs assemble | `publisher` | docs site frame + page tree — assembly only, content already exists from Phase 4–5 | — |
| 7 | Taste gates | `taste` | kiln gate set (precision/coherence/restraint) run against the shipped system, advisory until a gate is Gate-Proof-verified | gate results + acceptance criteria, both reported |
| 8 | Release | user | npm publish, git push | user's own hands only — see Credentials rule below |

### Agent roster (7, collapsed from the prior 6-agent + kiln-audit split)

- **`interpreter`** — merges `intake` (ref → measured extraction) + `abstract-interpreter` (non-UI
  ref → principles) + kiln Phase 0–1 (relationship card, lineage pick, rotation check against
  `.kiln/log.json`). Routes: real-UI ref → measured extraction path; non-UI ref → abstract path;
  either way, ends in one declared lineage + ≤3 answered questions, never a color or font named
  before the lineage exists.
- **`foundation`** — merges `foundation-inference` (spacing/type/color/grid/radius/motion/density,
  one topic at a time) + kiln Phase 2 (six-axis vector, `check_vector.py`-validated, named loud
  axis + its payment). Same PROPOSE→RENDER→CONFIRM→LOCK loop governs both; the vector and the
  foundation scale decisions are locked together, not as two separate passes.
- **`token-architect`** — unchanged. Turns locked decisions into DTCG token files.
- **`component-engineer`** — unchanged. Builds to Anatomy Contract + Rigor Tier.
- **`qa-a11y`** — unchanged. Read-only gate, tier-scaled review depth.
- **`taste`** *(new)* — runs kiln's gate set (`gates-precision.md` / `gates-coherence.md` /
  `gates-restraint.md`, pick exactly one per kiln Phase 7's own routing rule) against the shipped
  system, system-level, after Phase 6. Distinct from `qa-a11y`: qa-a11y gates one component against
  a fixed technical bar (contrast, keyboard, structure); taste gates the whole system against
  whether the declared lineage and vector actually show up in what got built. **Advisory only**
  until a specific gate has been proven by mutation per the Gate Proof Rule — an un-proven gate's
  finding gets reported, not enforced as a blocker.
- **`publisher`** — merges `docs-publisher` (per-component docs page, Storybook config,
  changeset/publish flow) + `system-sheet` (PNG system summary). Docs *content* is written earlier
  (Phase 4–5, by `component-engineer`, per `ds-conventions`'s Definition of Done point 10) —
  `publisher`'s Phase 6 job is assembling the frame around content that already exists, plus the
  system-sheet refresh and the publish/changeset mechanics.

## Stack (locked at the blueprint level)

pnpm + Turborepo + Changesets · tokens = DTCG JSON (spec 2025.10) + Style Dictionary · React + CSS
variables + CSS Modules · behavior borrowed from React Aria/Radix, wrapped in our tokens ·
Storybook = workshop, docs site (Fumadocs-chrome + kiln content model, see
`.claude/skills/kiln/references/docs-shell.md`) = the public face · RTL-ready: logical properties
only (`padding-inline-start`, never `padding-left`).

## Credentials and publishing

Never run `npm publish`, `npm login`, or anything that submits/deploys/transmits the work outside
the project. Never read, request, or handle a credential, token, or secret, regardless of how
directly the moment seems to call for it. Phase 8 is the user's own hands, always.
