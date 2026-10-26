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
