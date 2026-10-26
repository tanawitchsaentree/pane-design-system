# Self-report — what I am, what I did, why, for another agent to read

> **Audience:** another design-system-factory agent picking up this repo (or a similar one) cold.
> This is a first-person account of one work session, written by the agent that did it, so you can
> see the reasoning trail, not just the diff. Everything stated as fact was verified by running it
> during the session; anything I could not verify is marked UNVERIFIED. This is a companion to
> `docs/HANDOFF-FOR-AGENTS.md` (a full repo scan) — read that one for the architecture and the full
> bug list; read this one for how one review session actually happened, decision by decision.

---

## 1. What I am, in this context

I'm Claude Code, working inside `ds-agent-kit` — a "design-system factory" repo whose job is to
build a complete design system (tokens + React components + docs + npm packages) through an
agent-orchestrated pipeline: intake → foundation decisions → tokens → components (in waves) →
publish. The system currently being built inside this factory is called **Dial**
(Braun-hardware-derived, web-first), shipping as two packages: `dial-tokens` and `dial-react`.

I did not start this system. By the time I picked up this thread, prior sessions had already:
- Locked 24 design decisions (`system/DECISIONS.md`, D-001–D-024)
- Built 46 components across Waves 1–4 plus a partial Wave 5 and 4 components pulled forward from
  Wave 7 (Card, Alert, Table, Stat — added out of catalog order because a real demo app hit the gap)
- Established a governance layer: Rigor Tiers (T1/T2/T3), the Gate Proof Rule, an exceptions
  registry, diff-review QA for low-risk components

My job in this session was **not** to build more components. It was to act as a skeptical
pre-publish reviewer on work a previous batch of parallel agents had already produced, at the
user's explicit request, before they would personally run `npm publish`.

---

## 2. The goal, stated exactly as given

The user gave three numbered items and one closing instruction, verbatim intent:

1. **Resolve, with evidence, whether Card's border-vs-page contrast issue is a legitimate
   decorative exception or a real accessibility failure** — and whichever way it went, make the
   exceptions registry's count accurate. Explicitly rejected accepting a vague "precedent" citation
   without checking whether the precedent actually applied.
2. **Fix the shared-barrel-file collision risk structurally**, not by asking agents to be more
   careful. Four parallel agents had all appended to the same `packages/react/src/index.ts` in the
   same batch; nothing prevented a real collision, luck did.
3. **Before increasing parallel batch size from 4 to 6–8, find out where the ~39 min/component
   average actually went** (code / stories / spec doc / gate runs / tsc fixes), and template
   whatever turned out to be templatable — otherwise a bigger batch just scales the waste.
4. After all three: the user would publish 0.1.0 themselves (never me — standing constraint, stated
   explicitly and honored throughout), then work would resume on `Select`.

The meta-goal underneath all three: **the user was testing whether "looks done" and "is done" are
the same thing in this repo**, and pushing me to close that gap before real money (a public npm
publish) was on the line.

---

## 3. What I actually did, item by item, including the reasoning

### Item 1 — Card's hairline border

**Starting claim in the code** (written by a prior batch agent): Card's root border used
`border.hairline` (a quiet, sub-3:1 divider token), and the token file's own `$description` argued
this was fine because it matched "the same low ratio Divider/Popover/Dialog's internal hairline
already use" — i.e., an appeal to precedent.

**What I did, in order:**
1. Took the user's diagnostic question literally: *can Card separate itself from the page using its
   own background fill alone, independent of the border?* This reframes "is the border contrast
   acceptable" into "is the border load-bearing at all" — a sharper question.
2. Computed the actual contrast of Card's fill (`surface.raised`) against the page background
   (`surface.canvas`) from the real built CSS hex values, not estimated: **≈1.06:1 in both themes**.
   That's imperceptible — nowhere near enough to read as a distinct region.
3. Didn't stop at math. Took a real Storybook screenshot of the rendered card and visually confirmed
   the fill is not seen at all; only the border reads. Math and eyes agreed.
4. Checked the two components the original description cited as precedent — Divider and Fieldset —
   by reading their actual CSS. Both have **zero background-color property at all**. That's a
   categorically different situation: for them the border is definitionally their only visual
   mechanism, so a sub-3:1 hairline is fine (WCAG 1.4.11 governs boundaries/UI components, not every
   line on a page). Card has a fill; the fill is just too weak to do the job. Citing a
   no-fill component as precedent for a has-fill-but-too-weak component was a category error, not a
   supporting case.
5. Checked whether the existing exception (`EXCEPTIONS.md`'s E-001) could cover it. E-001's own
   written scope explicitly excludes "border/divider/focus ring/input edge." It could not be cited,
   and I did not stretch it — the registry's own boundary is exactly what disqualified the claim.
6. Conclusion: **this is a genuine WCAG 1.4.11 failure**, not an acceptable decorative case. Fixed
   it by pointing `root.border` at `color.border.interactive` — an *existing* system token already
   used for real interactive boundaries (Button, Input, Checkbox, Radio) — rather than inventing a
   new token. Verified the fix clears 3:1 in both themes (3.72:1 light, 3.72:1 dark) using the same
   resolved-hex method as step 2.
7. Left the header/footer *internal* dividers on `border.hairline` deliberately — those separate
   content within an already-established card, not the card from the page, so 1.4.11's boundary
   requirement doesn't apply to them the same way. This distinction (outer boundary vs. internal
   divider) is the actual generalizable rule, not "Card is special."
8. Rewrote every place that had asserted the old (wrong) reasoning: the token file's
   `$description`, the CSS module's doc comment, and `packages/spec/card.md`'s two stale claims
   (one said the border-vs-hover color changes, which is no longer true once root and hover both
   resolve to the same token).
9. Separately, re-audited Alert's *own* citation of E-001 under the same scrutiny rather than
   assuming it survived because it was already written down. Confirmed it's a genuinely different
   case: Alert's accent bar is a decorative element measured against its own tinted background, not
   the panel's boundary (which is a separate token, `content.border`), and it has a real non-color
   cue (a distinct icon per variant) backing it up. It correctly stays under E-001. Updated
   `EXCEPTIONS.md` itself, which had never been updated when Alert started citing it, to list both
   Toast and Alert as the two real invocation sites of the same token-level shortfall, replacing the
   vague word "inherits" with an explicit second entry.
10. Confirmed the exception count didn't need to change (still 1, E-001) and said so explicitly in
    `STATE.md` rather than leaving that unstated — the user's instruction was unconditional: *whichever
    way this goes, the count must be verified accurate*, not just "probably fine."

**Why this sequence and not a shortcut:** the user had already once accepted a "flag it as a
finding for QA to decide, ship anyway" framing from a prior pass, and explicitly said that framing
was no longer acceptable — they wanted a forced binary answer backed by a measurement, not a
judgment call dressed as one. I treated "citing another component as precedent" as a claim requiring
verification (read that component's actual CSS), not a fact to inherit.

### Item 2 — Barrel-file collision, fixed structurally

**The risk:** `packages/react/src/index.ts` was a single hand-maintained file. A batch of 4 parallel
agents had each appended their own component's exports to it in the same run. No collision happened
— but nothing except each agent's individual carefulness prevented one. The user explicitly rejected
"just be more careful" as a fix.

**What I built:**
- `packages/react/src/barrel.manifest.mjs` — a plain data file (not code agents touch) listing which
  component directories belong in the barrel and in what order, grouped with the same wave-context
  comments the old hand-written file had.
- `tooling/generate-barrel.mjs` — reads that manifest, and for each listed component emits
  `export * from './components/{Name}'`, delegating to the component's own `index.ts` (which was
  already the real source of truth for that component's exports — every component already had one,
  I checked, no exceptions). The generator's own header explains why it exists, so a future reader
  doesn't have to reconstruct the reasoning from git history.
- Added `--check` mode (fails if regenerating would produce a different file than what's checked
  in) and wired it into `prepublishOnly`.

**Why `export * from` instead of inlining each component's named exports into the generated file:**
inlining would require the generator to parse and rewrite every component's own export statement
text (fragile, another thing to get subtly wrong across single-line vs. multi-line type export
blocks). Delegating via `export *` keeps each component's own `index.ts` as the single place that
declares what it exports; the generator's only job is inclusion and ordering.

**How I verified it, deliberately in increasing strength, because "it typechecks" is not the same
claim as "it works":**
1. `tsc --noEmit` on the whole react package — clean.
2. A full `vite build`, then grepped the *emitted* `dist/index.d.ts` and confirmed the transitive
   `export *` chain actually reached component-level `.d.ts` files that had the names I expected.
3. A **runtime** smoke test: imported a deliberately mixed set of names (a plain component, a
   compound-namespace component, two hooks, and a provider function) directly from the built
   `dist/index.mjs` in a scratch Node script, and asserted none were `undefined`. This is the
   strongest check available short of an actual consumer app, because type-level correctness and
   runtime resolution are different failure surfaces (I state this rule again in §5 below because it
   came up a second time later in the session, independently).
4. Ran the existing `pack-verify.mjs` tool (packs a real tarball, installs it in a scratch project,
   resolves every declared `exports` path) — passed 4/4 entry points.
5. Ran the full existing test suite (360 tests) to confirm nothing regressed.

**Process change, not just a tool:** updated `production-run/SKILL.md` (the orchestration
instructions for future batches) to state explicitly that no agent may hand-edit the root barrel
again — only the manifest, and only the generator produces the file.

### Item 3 — Time breakdown before scaling batch size

**Honest finding first, because it matters more than the fix:** I did not have access to
per-phase timing data for the batch in question. The four agents that built Card/Alert/Table/Stat
ran in a prior session; only their total wall-clock time per component survived into what I could
query (roughly 55/37/36/28 minutes respectively, averaging ~39 min). I could not query a
tool-call-by-tool-call transcript to split that into "code vs. stories vs. spec vs. gate-fixing."

**What I chose to do instead of guessing:** rather than fabricate a percentage breakdown I could not
back with evidence — which would have been exactly the kind of unverified claim this repo's own
"Honesty Rule" exists to prevent — I inspected the actual artifacts the batch produced, looking for
concrete signs of redundant or error-prone manual work. This is a weaker signal than real timing
data, and I said so explicitly in the record rather than presenting it as equivalent.

**Two real, confirmed problems found this way:**
1. **Story sidebar category drift.** Card's story was filed under `'Layout/Card'` (wrong — it's a
   Data Display component); Stat's was filed under `'DataDisplay/Stat'` (no space) while Alert and
   Table used `'Data Display/...'` (with a space) — putting Stat in a different sidebar group than
   its actual siblings. Both are exactly the kind of mistake that happens when four agents each
   write a stories-file header from memory with no shared list to copy the category name from.
   Fixed both.
2. **Contrast math hand-derived from scratch, repeatedly.** Grepped for the relative-luminance
   formula being spelled out prose-style inside component tokens' `$description` fields and found it
   duplicated across 7 files (alert/card/dialog/popover/rating/toast/tooltip.json) — the same
   arithmetic, re-typed each time, with real risk of a small error surviving unnoticed (I later found
   at least one during the Alert cross-check, off by ~0.02 from hand math vs. what the built CSS
   actually resolved to). Wrote `tooling/contrast-check.mjs`: given a foreground/background CSS
   variable pair, it resolves `var()` alias chains down to a literal hex in the real built stylesheet
   and computes the WCAG ratio, so no one hand-derives it again. Verified it reproduces every
   hand-computed number from the Card investigation exactly. Wired it into `component-engineer.md`'s
   contrast self-check instruction, replacing "compute it yourself" with "run this script."

**What I explicitly did *not* template, and why:** I noticed two more candidates — spec.md's section
skeleton differs slightly between the four files (some have a "Rigor Tier"/self-check section,
others don't), and test-file import boilerplate is nearly identical across three of the four. Both
looked templatable on inspection. I did not act on them, because "looks similar" is an observation,
not evidence that it's a time sink — and the user's own framing was "template what's proven to be
worth templating," not "template everything that looks repetitive." I recorded this distinction in
`STATE.md` rather than quietly doing more work that wasn't asked for.

**What I added so the *next* review doesn't hit the same evidence gap:** added an instruction to
`production-run/SKILL.md` requiring each agent in a batch to self-report an estimated time-per-phase
breakdown in its handoff message going forward — not instrumented tooling, just a discipline change
so the next batch actually produces the data this one lacked.

---

## 4. What I did NOT do, on purpose

- **Did not run `npm login` or `npm publish`, or touch any token/credential.** This was an explicit
  standing constraint from the user across the whole engagement, restated multiple times, and I
  treated it as non-negotiable regardless of how ready the gates looked.
- **Did not invent a new design token for the Card fix.** Reused an existing one
  (`border.interactive`) that already had system-wide precedent and had already passed QA elsewhere.
  Introducing a new token would have been a heavier, less-reviewed change for a problem an existing
  token already solved correctly.
- **Did not register a new exception for Card.** It would have been the easy path — write an E-002,
  move on — but the actual finding was that the underlying registry rule (E-001 explicitly excludes
  borders) already answered the question correctly. Registering an exception the registry's own
  rules forbid would have been worse than the original bug.
- **Did not template the two "looks similar" candidates in item 3** without evidence they were worth
  templating (see above) — resisted the urge to over-deliver on a task that asked for
  evidence-based decisions, not maximum tooling output.
- **Did not silently fix things outside the three items' scope** without flagging them as separate.
  Where I found something adjacent (e.g. the story-category bugs), I fixed it because it was cheap,
  concrete, and directly load-bearing for item 3's own claim ("templates would have prevented this"),
  but I recorded it as its own finding rather than folding it silently into item 1 or 2's narrative.

---

## 5. Verification discipline I applied, and why it's the generalizable part

Three separate times in this session, I caught myself about to accept a weaker form of proof than
was actually available, and stopped:

1. **Type-check passing is not the same claim as runtime correctness.** For the barrel fix,
   `tsc --noEmit` going green was necessary but not sufficient — I went one step further and
   smoke-imported the *built* JavaScript output at runtime, because a `.d.ts` can describe an export
   that a bundler silently dropped, and only running the actual output catches that class of bug.
2. **A number computed by hand is a claim, not a fact, until it's reproduced by an independent
   method.** For Card, I didn't just trust the arithmetic in the prior agent's `$description` field
   — I recomputed the same contrast ratios independently from the built CSS and additionally took a
   real screenshot, so two independent methods (math, eyes) had to agree before I acted on the
   conclusion.
3. **"No evidence of a problem" and "evidence there's no problem" are different claims.** For item
   3's time breakdown, I explicitly refused to present an estimated percentage split as if it were
   measured data. I said outright that the honest answer was "I don't have the data," then did the
   next-best verifiable thing (inspect real artifacts) instead of quietly filling the gap with a
   plausible-sounding guess.

If you're picking this repo up next: the single habit worth copying from this session is that
**every claim in the final report traces to something I actually ran** — a computed contrast ratio
from real resolved hex, a screenshot, a runtime import, a passing test count, a diff I read
character by character. Where I couldn't do that (item 3's phase timing), I said so instead of
filling the gap, and changed the process so the next person doesn't hit the same wall.

---

## 6. Final state handed off

All three items closed; full gate green at handoff:
- `pnpm lint` — 0 errors across 232 files
- `tsc --noEmit` — clean, both `packages/react` and `apps/storybook`
- `vitest run` — 360/360
- `vite build` (react package) — succeeds, then verified via runtime smoke-import
- `barrel:check` — passes (generated file matches manifest)
- `pack-verify` — 4/4 entry points resolve from a real tarball install

Files changed: `packages/tokens/src/component/card.json`, `packages/react/src/components/Card/{Card.module.css,Card.stories.tsx}`,
`packages/react/src/components/Stat/Stat.stories.tsx`, `packages/spec/card.md`, `system/EXCEPTIONS.md`,
`system/STATE.md`, `.claude/agents/component-engineer.md`, `.claude/skills/production-run/SKILL.md`,
`packages/react/package.json` (added `barrel:check` script). New files:
`packages/react/src/barrel.manifest.mjs`, `tooling/generate-barrel.mjs`, `tooling/contrast-check.mjs`
(all still present and in active use as of this writing — later work in this same repo, visible in
`docs/HANDOFF-FOR-AGENTS.md`, built further tooling — `story-title-check.mjs`, `doc-count-check.mjs`,
`smoke-import.mjs` — on top of what's described here, and renamed the packages from the `@dial`
scope to unscoped `dial-tokens`/`dial-react` because the scope turned out to be taken).

Waiting, at handoff: the user running `npm publish` themselves per `docs/RELEASE.md`, then resuming
component work on `Select`.
