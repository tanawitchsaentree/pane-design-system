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

## Pane pilot (2026-10-26)

- **Safari/Firefox ไม่ได้วัด** — glass-evidence + conformance รันแค่ Chromium. WebKit/Firefox มี browser
  binary ในเครื่องแล้ว แต่ backdrop-filter ของ WebKit และ CDP media emulation (reduced-transparency)
  ใช้คนละทาง ต้องทำ mode ของแต่ละ engine แยก
- **`@supports not (backdrop-filter)` ไม่ได้ทดสอบตรงๆ** — บล็อกนี้มีค่าเดียวกับ reduced-transparency
  (ซึ่งวัดแล้ว) แต่ยังไม่มี browser ที่บังคับให้ @supports เป็น false ใน run. UNVERIFIED.
- **Backdrop เป็นของสังเคราะห์** — ยังไม่มีรูปถ่ายจริง (หน้าคน, ข้อความในรูป) ใน harness
- **Dark theme** ไม่มี (D-001)
- **Props table เขียนมือใน `apps/docs/src/content.tsx`** — conformance จับได้ว่า prop ที่เขียนไว้มีจริง
  แต่ยังจับไม่ได้ว่า prop จริงตัวไหนไม่ได้เขียนไว้ (ทางเดียว). ควร generate จาก TS (react-docgen-typescript)
- **Placeholder ใน TextField demo** ("Ada Lovelace") สี text.secondary ดูคล้าย value — ควรจางกว่าหรือเลิกใช้ใน demo
- **Stack deviation:** token build เป็น script ของเอง (`packages/tokens/build.mjs`) ไม่ใช่ Style Dictionary
  ตามที่ CLAUDE.md ล็อกไว้ — เลือกเพราะต้องบังคับ tier rule ตอน build; ต้องตัดสินว่าจะย้ายไป SD หรือแก้ blueprint
- **Docs ไม่ได้ใช้ Fumadocs** ตาม blueprint — Vite หน้าเดียวตาม D-006
- **user-level hook `~/.claude/hooks/amac-linter/lint.sh`** fail บนทุก .tsx (ไม่มี eslint config ใน repo นี้) — ไม่มี stderr, ไม่ใช่ของ kiln
