# Decision-trail audit — form-language order, Part 1 (read-only)

Run 2026-08-13, per the `form-language` order's Part 1. No code changed. Full protocol and
reusable template: `.claude/skills/form-language/references/decision-trail-audit.md` — this file
is the dated, project-specific run of that template against Dial.

## The order's claim

"D-003 locked 'Neumorph ล้วน' (functional raised/inset recipe, user-picked in the Lab); D-008 'no
decorative shadows' was progressively read as 'no shadows on controls,' silently flattening every
component. No gate caught it because the Anatomy Contract governs behavior/API/states and says
NOTHING about form."

## What the record actually shows

| Step | Record | Verdict |
|---|---|---|
| D-003 = neumorphism, user-picked in Lab | **No such decision exists.** Dial's real D-003 (`system/DECISIONS.md:23`) is "Spacing base unit = 8px" — nothing about depth/shadow. The `docs/KIT-CHANGELOG.md` v10 line mentioning "D-003 neumorph ล้วน" describes an earlier demo/test cycle of the KIT's own tooling (before Dial existed), explicitly wiped in v13's cleanup: *"รีเซ็ต `system/` กลับเป็น blank template (ล้าง D-001/D-002/D-003 neumorphism/mobile-first demo, ล้าง apps/lab/candidates.js...)"*. Dial's actual D-001–D-010 were authored fresh, after that reset, on a different reference. | **FACTUALLY-UNFOUNDED** |
| D-008 "no decorative shadow" slid into "no shadow on controls" | D-008's own locked text (`system/DECISIONS.md:60`) names `card/button/input` directly, at lock time: *"ห้ามมี drop-shadow ตกแต่งบน card/button/input ปกติ"*. Its "ตัวเลือกที่ตัดทิ้ง" line explicitly considered and rejected the neumorphic dual-shadow alternative by name, with a ready recipe already on file (`docs/style-recipes/neumorphism.md`): *"neumorphism dual-shadow (มี recipe อยู่แล้วแต่ขัดกับกฎ 'ไม่มี drop-shadow ตกแต่ง'...ตรงๆ)"*. The rule always meant exactly what it says — there was no later reinterpretation to catch. | **USER-CONFIRMED, no drift** |
| Was the flattening ever confirmed via lab render? | `apps/lab/candidates.js` is the empty template (14 lines, comment only, `window.LAB_CANDIDATES = {}`). D-001/D-008 were locked through the written PROPOSE→CONFIRM text loop at Phase 0/1, not an eyes-on multi-candidate render. | **Real gap on file — no lab render for form has ever happened for Dial, but this is an absent STEP, not evidence that an existing decision was reinterpreted** |
| "No gate caught it because Anatomy Contract says nothing about form" | Confirmed directly: `docs/BLUEPRINT.md`'s §6 Anatomy Contract (9 points) covers anatomy/variants/sizes/states/tokens/a11y/API/stories/docs — zero mention of silhouette, depth, or corner logic. Independently, an external audit already re-verified D-008 as a deliberate, cost-checked refusal (see below), not an accidental flat default. | **CONFIRMED — this is the real defect, but its actual shape differs from the order's causal story** |

## Independent corroboration (external, prior, unrelated engagement)

Two external `kiln` skill audits — run 2026-08-10, for an unrelated purpose (scoring Dial's
intensity vector), read-only, before this order existed — independently checked the same D-008 rule
and reached the same conclusion from a different angle:

- `.claude/skills/kiln/evals/dial-audit-2026-08-10/report.md`: found shadow tokens in exactly 3 of
  26 component files (`dialog.json`, `popover.json`, `toast.json`) — precisely D-008's own named
  floating-layer exception, holding with zero unstated exceptions elsewhere. Corrected Dial's
  surface-axis score from S1 ("mostly flat") to **S0** ("a genuinely held, zero-exception refusal"),
  specifically because a literal grep across every real token file showed no exceptions beyond the
  ones the rule itself names.
- `.claude/skills/kiln/evals/floor-cost-2026-08-10/report.md`: checked whether that S0 was a "free
  zero" (the system was never going to reach for shadow anyway) versus a costly refusal (the medium
  pulled toward it and the system said no anyway). Found six real temptation points — Button, Card,
  Image, Table, Listbox, Skeleton — each independently documenting the same refusal in its own
  token file's `$description`, citing D-008 by number, at exactly the point mainstream convention
  (drop-shadow-as-depth-cue, especially on cards) pulls hardest. Verdict: **"a costly refusal, not a
  free zero."**

Two independent audits, run for a different reason, at a different time, before this order was
written, both landed on "deliberate and checked," not "drifted." That corroboration is the
strongest available evidence against the order's specific drift narrative.

## Verdict

**The order's causal story does not hold.** D-003 as described never existed for Dial; D-008 never
drifted in meaning. What is real, and confirmed independently three separate ways (this audit, and
two prior unrelated `kiln` audits), is narrower and different: **form/silhouette was never asked as
its own decision axis at any point in Phase 0/1** — D-001 captured palette, shadow-ban, and type-
flatness from the Braun reference, but nothing in the pipeline ever separately asked "what shape is
a key" apart from "does it have a shadow." That is a coverage gap in the interpretation protocol,
not governance decay from a decision that used to say something different. `system/FORM.md` and the
`form-language` skill fix the actual gap; Part 3's multi-candidate lab round is genuinely Dial's
first eyes-on form decision, since none exists on file — that part of the order's premise (no prior
lab render) is accurate even though the "why" attached to it isn't.

## Files read for this audit

`system/DECISIONS.md` (full, D-001 through D-027), `system/STATE.md`, `docs/KIT-CHANGELOG.md`,
`docs/BLUEPRINT.md` §6, `docs/style-recipes/braun-flat.md`, `docs/style-recipes/neumorphism.md`,
`apps/lab/candidates.js`, `packages/react/src/components/Button/Button.module.css`,
`packages/tokens/src/primitive/radius.json`, `.claude/skills/kiln/references/baseline.md`,
`.claude/skills/kiln/evals/dial-audit-2026-08-10/report.md`,
`.claude/skills/kiln/evals/floor-cost-2026-08-10/report.md`,
`.claude/skills/kiln/evals/restraint-profile-2026-08-10/report.md`. No file was modified.
