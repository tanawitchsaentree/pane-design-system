# Handoff — what this repo is, how it works, and what it learned the hard way

> **Audience:** another agent (or another agent's author) building a design-system factory. This is not
> marketing. Every number here was verified by running the thing at the time of writing, and the
> section that matters most is the last one — **the bugs**. The architecture is easy to copy; the
> failure modes are what cost real time to find.
>
> **Written:** 2026-08-10, at commit `8c225e2`, by the agent that did the work. Anything I could not
> verify by running it is marked UNVERIFIED, per this repo's own Honesty Rule.

---

## 1. What it is in one paragraph

A **factory**, not a design system. The repo builds design systems from a design reference (a
screenshot, a Pinterest board, a photo of Braun hardware) by interviewing the user one decision at a
time, locking each answer into an append-only ledger, and then generating tokens → components →
docs → npm packages from those locked decisions. The current system inside it is called **Dial**
(Braun-derived, web-first). The factory has no style of its own — swap `system/` and it builds
something else. Two publishable packages come out: `dial-tokens` and `dial-react`.

**Current state:** 46 components, 48 named exports, 0.1.0, all gates green, sitting one `npm publish`
away from release. Publishing is deliberately a human action (see §7).

---

## 2. Layout

```
CLAUDE.md                    orchestrator rules — read first, every session
system/                      the CURRENT system's memory (swap this, get a new system)
  STATE.md                   working memory: phase, what's done, what's next
  DECISIONS.md               D-001..D-024, append-only, never edited in place
  EXCEPTIONS.md              E-001.. registry of accepted rule violations, narrowly scoped
  refs/ reports/ sheets/     input refs, extraction reports, generated PNG posters
.claude/
  agents/         (6)        intake, foundation-inference, token-architect,
                             component-engineer, qa-a11y, docs-publisher
  skills/         (7)        new-system, new-component, production-run, lock-decision,
                             system-sheet, abstract-interpreter, ds-conventions
  settings.json              hooks: no-hardcode lint on every Edit/Write, DECISIONS.md guard
packages/
  tokens/                    DTCG JSON → Style Dictionary → css/scss/json/ts/tailwind (dial-tokens)
  react/                     46 components, CSS Modules + CSS vars (dial-react)
  spec/           (46 .md)   per-component docs, written at build time, not at publish time
  conformance/    (12 spec)  Playwright: real-browser keyboard/focus/forced-colors
apps/
  storybook/                 the workshop (50 stories, autodocs, 3-theme toolbar)
  lab/                       throwaway HTML for "compare these 3 candidates with your eyes"
  sheet/                     renders the System Sheet PNG
tooling/        (12 .mjs)    the gates — 6 tools, 5 of them with a paired selftest
docs/           (11 .md)     BLUEPRINT (563 lines, the full spec), CATALOG, ROADMAP, RELEASE, …
turbo.json                   task graph (see bug #5 — this was missing entirely)
```

Sizes: react src 14,274 lines · tokens src 1,134 · conformance 1,488 · spec docs 1,722 ·
governance prose (CLAUDE + system + docs + skills + agents) 1,664.

---

## 3. How the pipeline actually runs

| Phase | Who | Output | User checkpoint |
|---|---|---|---|
| 0 Intake | `intake` agent | `system/reports/extraction-*.md` — raw measurements, no interpretation | which ref is primary |
| 1 Foundations | `foundation-inference` | one proposal at a time (spacing → type → color → …) | **locks every topic, 7-8 rounds** |
| 2 Tokens | `token-architect` | `packages/tokens/` 3-layer DTCG + build | review the token preview |
| 3-5 Components | `production-run` skill | waves of 8-12 components | **one** API review per wave |
| 6 Publish | `docs-publisher` | docs, Storybook, npm | package name/scope |

Four rules make this work, and they are the transferable part:

**a) Decisions are append-only, and every one records its blast radius.** `DECISIONS.md` entries have
a mandatory **กระทบ (impact)** field: *if this decision changes later, what has to be regenerated?*
Changing a decision means adding an entry that supersedes the old one, never editing it. That field
is what makes "the user changed their mind about spacing" survivable.

**b) Anything the eye can judge gets rendered before it gets locked.** Colors, radii, component
shapes go into `apps/lab/` as side-by-side candidates and the user picks. The agent never decides a
visual question by reasoning about it in prose.

**c) Rigor is tiered, because uniform rigor is a token bonfire.** `Spacer` (no behavior at all) and
`Listbox` (React Aria + roving tabindex + typeahead) do not deserve the same pipeline.

| Tier | Examples | Gets | Skips |
|---|---|---|---|
| **T1** static | Spacer, Divider, Badge, Skeleton | lint, tsc, story, spec doc, contrast check | conformance spec, Gate Proof, QA re-run |
| **T2** interactive | Button, Input, Card, Alert | + unit tests (interaction + axe), QA reviews the **diff** | Gate Proof, conformance (unless hover-only cue) |
| **T3** keyboard/focus | Listbox, Dialog, Drawer | everything + Playwright conformance + Gate Proof mutations | nothing |

The T2/T3 test is mechanical: focus management, keyboard nav beyond native Tab, portal/overlay, or
ARIA live region → **T3**. When unsure, go up a tier, not down. And a T1/T2 component where QA finds
anything real **escalates to a full re-run** — cheap review is for components that don't break, not a
license to wave through a finding.

**d) Separation of powers.** `qa-a11y` is read-only by design. It cannot fix what it finds; it hands
back a list. The agent that writes code does not get to grade its own work.

---

## 4. The token architecture

Strict 3 layers, enforced by a lint hook on every file write:

```
primitive/   raw values (color.neutral.400 = #a3a3a3)         12 files
semantic/    light.json, dark.json, contrast-more.json,        8 files
             space, size, typography, motion, layout
             → aliases primitive only
component/   button.json, card.json, …                        26 files
             → aliases semantic ONLY, never primitive
```

Component code may contain **no raw values at all** — every color, space, size, radius comes through
`var(--ds-*)`. Naming is `{category}.{concept}.{property}.{variant}.{state}` → `--ds-button-bg-primary-default`.

Build: `style-dictionary.config.mjs` composes three themes (light `:root`, dark `[data-theme="dark"]`,
`light-contrast-more`) and emits **CSS, SCSS, flat+nested JSON, TS types, and a Tailwind preset** — 14
export subpaths, 482 CSS vars in light.css.

Two more mandates worth stealing: **logical properties only** (`padding-inline-start`, never
`padding-left`) so RTL is free rather than a retrofit; and **behavior is borrowed, never written** —
React Aria or Radix for focus traps, typeahead, roving tabindex, wrapped in our tokens. Ten years of
other people's edge-case bug fixes beats anything hand-rolled.

---

## 5. The gates

Seven tools in `tooling/`. Six have a paired `.selftest.mjs`; `pnpm run gate:selftest` runs all of
them — **92/92 at time of writing**.

| Tool | Job | Selftest | Tool mutations proved |
|---|---|---|---|
| `no-hardcode-lint.mjs` | no raw hex/px in component code | 12/12 | (v4, holes found twice) |
| `contrast-check.mjs` | resolve `var()` → hex from built CSS, compute WCAG ratio | 14/14 | 7 |
| `generate-barrel.mjs` | root `index.ts` generated from a manifest | 10/10 | 4 |
| `pack-verify.mjs` | pack a tarball, install it, resolve every declared path | 14/14 | 5 |
| `story-title-check.mjs` | story titles come from a closed category set | 26/26 | 11 |
| `doc-count-check.mjs` | every count written in prose vs. the thing it counts | 16/16 | 8 |
| `smoke-import.mjs` | install BOTH tarballs together, import + render as a consumer | 28/28 | 5 |

**The Gate Proof Rule is the single most valuable idea in this repo.** A gate that has never been
watched failing is not a gate — it is a comment that exits 0. So: mutate the code so the rule *should*
fire → confirm red → revert → confirm green → keep it as a permanent automated regression. Every
selftest header carries its mutation table and the tool's sha256 after revert.

Two refinements that came from being wrong:

- **Two-sided proof.** A suite of only red-expecting cases is passed by a tool that is *always* red.
  So mutation M1 always disables the gate entirely, and the number of cases still green is the count
  that assert green. story-title-check: M1 → 5/26. That 5 is load-bearing information. Read the
  number rather than predicting it: doc-count-check's M1 came back 9/16 against a predicted 8/16,
  and the extra case turned out to be a branch that returns *early* and so never reaches the mutated
  return — correct behavior, and it needed its own mutation (M2) to prove it.
- **One branch, one proof.** If each mutation kills exactly one case, no case is doing double duty. If
  one mutation kills three, the block needs finer mutations — which is why story-title-check has M10
  and M11 targeting individual branches inside the block M6 disables wholesale.
- **Gate-prove the wiring, not only the tool.** A tool that works and a chain that runs it are two
  different claims (see bug #13). Adding `doc:check` to `prepublishOnly` meant drifting a real
  CATALOG title and confirming the chain went red *at that step and stopped before the 360 tests* —
  then reverting byte-identical and confirming the whole chain exits 0.

**Compound Invariant Clause:** when a mutation *doesn't* go red, "eh, redundancy covers it" is not a
conclusion. Open the browser and determine which it is: genuine redundancy (then record the layer map)
or a weak assertion (then strengthen it). This came from `expectTabOut`, where two separate single
mutations both stayed green — one turned out to be real redundancy, the other a genuinely weak test.

---

## 6. What got built, and what it cost

**Done:** Waves 1-4 complete (10 layout, 12 atoms, 11 forms, 6 overlays), W5 Selection 3/9
(Listbox, Rating, RadioCards), W7 Data Display 4/11 pulled forward because the demo app needed it.
**42 of 103 catalogued components passed QA**; 46 directories exist and ship 48 named exports (Toast
contributes `ToastProvider` + `ToastAction`; `useToast`/`useSnackbar` are hooks).

Also real: 360 unit tests, 12 Playwright conformance specs, 50 Storybook stories with 206 individual
story descriptions, 46 spec docs, a demo app that consumes the workspace package, six System Sheet
PNGs forming a visual timeline, 24 locked decisions, and exactly **1 open exception** (E-001, an
accent bar at 2.99:1 against a 3:1 bar, scoped to decorative accents only and explicitly barred from
being cited for any border, divider, focus ring, or input edge).

**Verified numbers at handoff:** `gate:selftest` 76/76 · vitest 360/360 · lint clean across 232 files ·
pack-verify 7 + 16 entry points · smoke-import 28/28 from real tarballs · both `prepublishOnly` exit 0 ·
root `turbo run build`, `build-storybook`, demo-app build, storybook `tsc` all exit 0.

UNVERIFIED: the 12 Playwright specs were not re-run during this handoff scan (they need browser
binaries); STATE.md records them green as of the W5 work.

---

## 7. The bugs — read this section twice

Every one of these passed review, looked fine, and was found only by running the thing for real.
They are grouped by failure class because the class is what generalizes.

### Class A: the silent skip — a tool that inspects nothing reads exactly like a tool that passes

This class hit **five times**, which is why it deserves its own name.

1. **`no-hardcode-lint` run from the wrong cwd** scanned 0 files and printed "✓ clean" — for weeks.
2. **`pack-verify` printed "all 0 declared entry point(s) resolve"** and exited 0. Zero is not a pass.
3. **Storybook's `tsconfig.json` had `"include": [".storybook"]`** — a bare directory name matches
   nothing. `tsc` typechecked zero files and exited 0 the whole time. It needed `".storybook/**/*"`.
4. **`pack-verify` checked one export condition per subpath.** An `exports` entry with `import`,
   `require`, and `types` got one of the three verified; the other two could point anywhere.
5. **`story-title-check` found no story files** and would have passed, before a guard was added.

**The fix that generalizes:** every gate must fail when it finds nothing to check. "I inspected 0
things successfully" is the most dangerous output a tool can produce, because it is indistinguishable
from success in every log, dashboard, and CI badge.

### Class B: hand-typed numbers drift, silently, always

This is the most-repeated bug in the repo's history — **six confirmed instances**, each one found and
patched individually, which is exactly why it kept coming back.

6. **A README stuck at `108` components** after decisions D-017 and D-022 cut the catalog to 103.
7. **`docs/CATALOG.md`'s title still said 108** while its own body said 103 and its per-wave numbers
   summed to 103 — found during this very scan, three sessions after instance 6 was "fixed".
8. **`docs/BLUEPRINT.md` §5 described CATALOG.md as "108 ตัว"** — found by grepping for the class
   after instance 7, not by reading the file.
9. **`docs/DISTRIBUTION.md`'s sales bullet said "108 components"** — found by the *new gate*, below,
   on its first run. Two documents had been repeating a superseded number for weeks.
10. **`CHANGELOG.md` claimed "48 components"** while the list beneath it enumerated 46. Both numbers
    were defensible (46 components, 48 exports) — the noun was wrong.
11. **`43/103` components passed** appeared throughout STATE.md; the real sum was 42 (a component that
    had been stopped mid-build was counted). The error had propagated into the roadmap's tier
    totals (52→51, 81→80).
12. **The relative-luminance formula was re-derived by hand in 7 token files' `$description`** — and
    some of the arithmetic was wrong. Replaced by `contrast-check.mjs`, which resolves `var()` chains
    to real hex from the built CSS and computes the ratio.

**The fix that generalizes — and this repo only actually applied it on the sixth instance:** don't
correct the number, delete the ability to type it wrong. `tooling/doc-count-check.mjs` now derives the
catalog total by summing CATALOG.md's own per-wave markers and the shipped-component total from the
barrel manifest, then compares both against every place a count appears in prose. It also sweeps for
the superseded number (108) being used as a live count anywhere, so a *newly written* document cannot
reintroduce it — while allowing an honest historical mention that says so on the same line
(`ปรับจาก 108 เดิม`, `was 108`). `docs/KIT-CHANGELOG.md` and `system/DECISIONS.md` are exempt: both
are append-only records where 108 was true when written, and rewriting history to match the present
is the exact thing those files exist to prevent.

It caught instance 9 on its first run, and it is wired into `prepublishOnly` (wiring gate-proved, not
just added). 16 selftest cases, 8 tool mutations. Every instance above would have been caught at
write time by this 170-line script; five separate careful humans-and-agents reading the docs were not.

### Class C: config that was never executed

13. **`prepublishOnly` called `barrel:check` and `story:check`, neither of which existed.** Three
    separate documents stated both were "wired into prepublishOnly". They were listed in the chain,
    yes — but never defined as scripts. `npm publish` would have died on
    `ERR_PNPM_NO_SCRIPT Missing script: barrel:check` before running a single one of the seven later
    gates. Every gate passed when run individually, which is exactly why nobody noticed for weeks.
    Found by running `pnpm run prepublishOnly` end to end instead of running the gates one by one.
14. **`turbo.json` did not exist**, while root `package.json` defined `"build": "turbo run build"` and
    `BLUEPRINT.md` listed the file in the repo tree. The documented root build had never worked once
    (`Could not find turbo.json`). Nobody noticed because real work used
    `pnpm --filter dial-react build`. Found during this scan; created, and now green with correct
    `dependsOn: ["^build"]` ordering so tokens build before react.

**The fix that generalizes:** a chain is only proven by executing the whole chain. Documentation
saying "X is wired up" is a claim about config, and config claims need a run, not a review. And when
you add a link, gate-prove the *wiring*, not just the tool: break the barrel → the chain must go red
*and stop before the tests*; break a story title → red at `story:check`.

### Class D: the config looks right and the build disagrees

15. **`@dial/tokens`'s `exports` map pointed at filenames the build never produced.** Every path was
    plausible. Nothing resolved. This is the bug that motivated `pack-verify`, then `smoke-import`.
16. **`preview.ts` cannot import a shared constant.** Storybook's csf-tools *statically parses* that
    file rather than executing it, so `storySort: { order: STORY_SORT_ORDER }` is a hard
    `build-storybook` failure — while `tsc -p tsconfig.json --noEmit` exits 0. My own bug: I added the
    import, ran `tsc`, saw green, and never ran the Storybook build. The list must be an inline
    literal, so the duplication is forced by the tool — and `story-title-check` now compares the
    inlined literal against the shared list, which is a *stronger* guard than the grep-for-an-import
    it replaced.
17. **The `@dial` npm scope has an owner**, recorded in two documents as "free". The endpoints
    originally cited (`/-/user/<name>`, `/-/org/<name>`) return 404 for *every* name, including
    `@sindresorhus` — so those 404s were never evidence of anything. The endpoints that discriminate:
    `registry.npmjs.org/-/org/<scope>/user` (200 + members = taken, 404 "Scope not found" = free) and
    `registry.npmjs.org/<pkg>` for unscoped names. **Always run a known-taken and a known-free control
    alongside the real query** — without controls, a 404 means "free" and "you used the wrong URL"
    equally well. This forced a 30-file, 95-occurrence rename to unscoped names.

### Class E: my own probes were wrong, and I nearly reported them as product bugs

18. **`smoke-import` flagged "missing export `Toast`"** — there is no bare `Toast` export by design
    (`ToastProvider`/`ToastAction`/`useToast`), and `Card` is a compound namespace whose renderable
    element is `Card.Root`. My assertions were wrong, not the package.
19. **`smoke-import` flagged 7 undefined `--ds-*` variables.** All 7 are set inline at runtime by
    components and carry CSS fallbacks. The real invariant is narrower: a var used with *no* fallback
    that nobody defines renders as an invalid value with no error anywhere. Proved numerically (287
    no-fallback vars, all defined, 0 blocking) and narrowed the check.

**The fix that generalizes:** when a brand-new check goes red on mature code, suspect the check first.
Then encode the resolution in a comment, so the next person doesn't "fix" the working design.

### One more, from the tooling around the work

20. **`grep -n` counts lines; `grep -o` counts occurrences** — the source of a 79-vs-103 disagreement
    about rename scope. macOS grep also silently ignored `--exclude=pnpm-lock.yaml` in one invocation,
    and zsh ate `--include=*.ts` globs in another. Verify your measuring instrument before trusting
    its measurement.
21. **`git checkout <file>` during mutation testing clobbered an in-progress rename**, restoring
    `"name": "@dial/react"` and a deleted `publishConfig`. Mutation testing must snapshot with `cp`,
    not reach for version control that doesn't know about your uncommitted work.

---

## 8. What I would tell you to copy, in priority order

1. **The Gate Proof Rule, with two-sided proof and one-branch-one-proof.** Everything else in this
   repo's quality story rests on it.
2. **Make every gate fail on an empty inspection set.** Class A, five times over.
3. **Append-only decisions with a mandatory impact field.** This is what makes changing your mind
   affordable rather than catastrophic.
4. **Tiered rigor with a mechanical tier test**, plus the escalation rule that any real finding in a
   cheap tier promotes that component to full review.
5. **Read-only QA.** Split the power to find from the power to fix.
6. **Generate every number that appears in prose, and gate the ones you can't.** Class B beat careful
   human discipline six times in a row; it lost to a 170-line script the first time one was written.
   Note the asymmetry — the five earlier "fixes" were all correct edits, and none of them helped.
7. **Verify at the layer the consumer uses.** Config review < unit test < pack a tarball < install
   both tarballs together and render the component. `smoke-import` is the highest-value gate here
   because it is the only one that tests what a user actually experiences.
8. **Borrow behavior, own presentation.** React Aria/Radix for focus and keyboard; tokens for looks.

## 9. Known open items

- **Not published.** Both packages are at 0.1.0 with green gates, waiting on a human `npm publish`.
  npm's similarity rule could still reject the names at publish time; if it does, the error text names
  the collision and the replacement should be chosen deliberately, not guessed.
- **W5 Selection is 3/9.** Select was started and stopped cleanly (no orphan files); Combobox,
  MultiSelect, TagInput, Menu/Dropdown, ContextMenu are untouched.
- **Changesets is named in the blueprint stack but never set up.** Versioning is manual `npm version`.
- **No CI.** No `.github/workflows` — every gate is local, and `prepublishOnly` is the only automatic
  enforcement point. (Which is precisely how bug #13 survived: nothing ever ran the full chain.)
- **No git remote.** Local-only by the user's choice.
- **109 Style Dictionary "Collision detected" warnings on every token build are benign** and were
  diagnosed during this scan: 85 are each component file's root-level `$description` doc string
  overwriting the previous one (documentation prose, not a token), and 24 are
  `contrast-more.json`'s deliberate `color.border.*` overrides, which win correctly — verified
  `light-contrast-more.css` emits neutral-400/600 where `light.css` emits neutral-200/500. Output is
  clean: 482 vars, no `--ds-undefined`, all 26 component namespaces present. Worth silencing someday
  so a *real* collision is visible; not worth "fixing" blind.
