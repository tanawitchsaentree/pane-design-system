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
- `.claude/settings.json` hooks don't enforce: PostToolUse lint ends in `|| echo` (always exit 0,
  never blocks), PreToolUse reads `$CLAUDE_TOOL_INPUT`, which hooks don't receive (input comes as
  JSON on stdin), so the DECISIONS.md guard likely never fires. UNVERIFIED — not run yet.

## Pane pilot (2026-10-26, rebuilt from anchor A)

- **Safari/Firefox ไม่ได้วัด** — glass-evidence + conformance รันแค่ Chromium
- **`@supports not (backdrop-filter)` ไม่ได้ทดสอบตรงๆ** — ค่าเดียวกับ reduced-transparency ซึ่งวัดแล้ว. UNVERIFIED.
- **ฉากเป็นรูปจริง 4 รูปแล้ว** แต่ทุกรูปมีจุดสว่าง → dim/mid ยัง UNCALIBRATED (0.36 เท่า bright) ต้องหารูปมืดจริงมาวัด; avatar/cover ยังเป็น placeholder
- **Environment ต้องประกาศเอง** — เว็บอ่าน pixel หลังกระจกไม่ได้; ถ้าแอปตั้งต่ำกว่าจุดสว่างสุดของฉาก ตัวอักษรตก (harness `env-misuse` วัดได้ 2.15–2.64:1). ทางเลือกในอนาคต: sample ภาพพื้นหลังที่แอปรู้จักตอน build แล้วเลือก environment ให้อัตโนมัติ
- **ตัวอักษรบนรูปใน post** ผ่านกับรูปตัวอย่าง (scrim + จัดตำแหน่ง) แต่ระบบไม่การันตีกับรูปจริง — ยังไม่มี component Media/Overlay ที่บังคับ scrim
- **Props table เขียนมือ** — conformance จับ prop ที่เขียนแต่ไม่มีจริง แต่ไม่จับ prop จริงที่ไม่ได้เขียน; Tabs/Tag มีแค่ pass-through
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

- **Raw `opacity: 0.5` for disabled** in `Button.module.css:32`, `Select.module.css:18,43`, `Slider.module.css:8`. (The `opacity.disabled` token now exists, added with the W3 forms, which already use it; the four old places switch over in their rounds.) Also `Slider.module.css` scales the thumb on hover with a raw `scale(1.08)`. Iron rule 1 says component code holds no raw values, and `tooling/no-hardcode-lint.mjs` does not check `opacity`, so it slipped through. Fix: a semantic `opacity.disabled` token with a kiln.why, used in all four, and `opacity` added to the lint. Blocked on the derivation guard (all three are in `rationale.pendingDerivation`), so it lands with each one's derivation round.
- **Tag letter-spacing shows "no token" on the Style tab**: spec-capture cannot match Tag's `letter-spacing` (0.88px) back to `type.tracking-caps` because the em ratio rounds off. Match em tokens with a tolerance instead of string equality.
- **Every 32–36px control is below P6's touch floor**: Button `sm`, IconButton (both sizes, 36px and 32px), Chip and Tabs triggers are 32–36px with no 44px hit area, while P6 says "every target is at least 44px in its smaller dimension or has a 44px hit area". Banner's dismiss shows the fix already in the system (a `::after` hit area from `layout.touch`). Tabs also has a hover transition and no hover rule (P4). Found while writing the depth pages (the first-edition IconButton chapter even claimed both its sizes met 44px); the docs now say so under each component's Limitations. Fix lands with each component's derivation round (all are in `pendingDerivation`), and a conformance check for 44px hit areas should land first so it cannot recur.
- **Avatar has no forced-colours rule**: in high contrast mode the circle has no edge (P6 says structure survives without glass). Fix lands with Avatar's derivation round.
- **Select prop docstrings fail the tone gate** (`/components/select/code`): "Required: a select without a name…" and "Native disabled behaviour: not focusable…" are label colons in `Select.tsx`, which the derivation guard blocks until Select's round. Rewrite them then.

- 2026-10-27 · `--ds-type-mono` is read by `apps/docs/src/depth/depth.css` (redline labels) but no token declares it; the `ui-monospace` fallback is what renders. Found by kiln's new token-contract check. Add a `type.mono` token with a reason, or drop the var.
- 2026-10-27 · kiln's new gates (G-TT1 44px hit areas, G-SM1 anchor scroll-margin, G-NAV1, G-TODO1) have not run on Pane yet. Sync the engine and expect G-TT1 red on IconButton md (36px) and Tabs pills (32px), both already listed above.
