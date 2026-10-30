# Kit Changelog
- **v2.1 (form-language — the fifth phase-question no earlier version asked)** — new permanent
  skill `.claude/skills/form-language/` closes a real coverage gap the Anatomy Contract's original
  9 points never asked: what a control's silhouette/depth/corner logic should be, independent of
  color/type/spacing/shadow-policy (which the pipeline already covers). Added: `system/FORM.md`
  artifact (Phase 1.5/kiln-Phase-2.5, between Foundations and Tokens, wired into `foundation.md`
  as item 6.5), gates G-F1 (recipe markers)/G-F2 (form-goal presence)/G-F3 (identity-component
  lock — makes the eyes-on multi-candidate Lab round unskippable), Anatomy Contract's new point 10
  ("matches FORM GOAL," `ds-conventions`/`qa-a11y`/`BLUEPRINT.md` §6 all updated in lockstep),
  `new-component`'s Propose-API step gains a mandatory FORM GOAL section + identity-component lab
  requirement, EVASION extended with form-specific attractor rows (flat pill button, bordered-rect
  input, white-card-soft-shadow, iOS-clone switch — none of which font/palette/motion/background
  checks ever caught). Triggered by a `form-language` order whose own stated root cause (a claimed
  D-003 "neumorph ล้วน" decision, and D-008 allegedly drifting in meaning) did **not hold up** on
  read-only audit — see `system/reports/form-language-audit-2026-08-13.md`: no such D-003 exists
  for Dial (the changelog's own v10/v13 entries show it was demo/test data for the kit's tooling,
  wiped before Dial's real D-001-D-010 were authored), and D-008 was independently re-confirmed
  as a deliberate, cost-checked refusal by two unrelated prior `kiln` audits
  (`evals/dial-audit-2026-08-10`, `evals/floor-cost-2026-08-10`). The real gap was narrower: form
  was simply never asked as its own decision axis, not "drifted" from one. The skill and gates
  ship regardless, since the underlying fix is correct even though the alleged cause wasn't.
- **v2.0 (kiln DS v1 — unified frame)** — merged kiln (external audit skill, added v-prior via a
  separate engagement) into the kit's own orchestration, ending the two-parallel-system state:
  (1) **CLAUDE.md rewritten from scratch** — single orchestrator doc naming kiln's lineage/vector
  phases (0-2) as the system-level front half of the existing component pipeline (3-8), not two
  separate flows the user had to reconcile themselves. (2) **Agent roster collapsed 6→7, duplicates
  marked SUPERSEDED not deleted**: `interpreter` (was `intake` + `abstract-interpreter` skill +
  kiln Phase 0-1), `foundation` (was `foundation-inference` + kiln Phase 2's vector), `taste` (new
  — runs kiln's gate sets system-wide, advisory until Gate Proof-verified, distinct from
  `qa-a11y`'s fixed per-component technical bar), `publisher` (was `docs-publisher` + `system-sheet`
  skill). `token-architect`/`component-engineer`/`qa-a11y` unchanged. Old files moved to
  `.claude/agents/superseded/` and `.claude/skills/superseded/` with their original reasoning kept
  verbatim under a SUPERSEDED banner — not deleted, since the reasoning inside them is real and
  might matter if the merged versions are ever revised. (3) **One pipeline, Phase 0-8**: Interpret
  → Vector → Foundations → Tokens → Vertical slice (component + its docs page together, one thing
  the user can actually look at) → Waves (Rigor-Tier-scaled, parallel, docs page written the moment
  each component passes QA — not batched to Phase 6) → Docs assemble (frame only, content already
  exists) → Taste gates + System Sheet → Release (user's own hands). (4) **One BACKLOG.md** at
  root — the kiln-audit engagement's own `.claude/skills/kiln/BACKLOG.md` merged in under its own
  section header, provenance kept, file split removed. (5) **Docs site replatformed onto Fumadocs**
  (`apps/docs`) — chrome (sidebar/TOC/search/dark-mode) is the framework's job; kiln's own
  `docs-shell.md` stripped to page-types-beyond-default + the token contract; the actual page
  template lives in one file, `docs/DOCS-IA.md`, merging kiln's eight-section template into the
  13-point structure already used for all 46 Dial component pages. Two upstream `fumadocs-core`
  bugs found and worked around (static search export/client) — see root `BACKLOG.md`. (6) **Dial
  itself untouched** — this whole reorg is orchestration/docs-site work; `packages/react` and
  `packages/tokens` were not edited (the 7 modified `.module.css` files under `packages/react` in
  git status are pre-existing D-026 work from a separate, earlier session, confirmed against
  `system/DECISIONS.md`). Full gate re-verified green after the move: lint 0/232, tsc 0 error,
  vitest 360/360, pack-verify 7/7 — no regression from the reorg. System closes as **"Dial complete
  on Kiln DS v1"** per `system/STATE.md`'s own closing entry.
- **v1** — 6 subagents, 3 skills, memory (CLAUDE/STATE/DECISIONS), hooks, no-hardcode lint
- **v2** — abstract-interpreter + intake routing + style-recipes/neumorphism (5 กฎ) + D-001
- **v10** — Layout Lab (apps/lab: 3 ฉาก × 3 frames × N candidates, baseline regression), loop = PROPOSE→RENDER→CONFIRM→LOCK, คำถามข้อ 0 platform, D-002 mobile-first + qa checks, D-003 neumorph ล้วน, refs/archive convention, conflict protocol ใน interpreter, BLUEPRINT tier reorder
- **v11 (Factory edition)** — แยก engine/system: decisions ทั้งหมดย้ายเข้า `system/` (neumorph = แค่ workload แรก สลับได้ด้วย /new-system ไม่มีอะไร lock ที่ระดับ kit) · production-run: waves + BATCH API REVIEW + stop conditions + resume protocol (100+ components โดย user ตัดสินใจ ~10 ครั้ง) · CATALOG 108 ตัว 10 waves พร้อม engine map ระดับ MUI-X · SCALING.md ปิดข้อจำกัดด้วยกลไก + Hardening Harness
- **v12** — System Sheet: โปสเตอร์ PNG สรุประบบ (apps/sheet template+render.mjs, skill system-sheet) refresh อัตโนมัติหลังทุก lock/wave · เก็บทุกใบใน system/sheets/ = timeline วิวัฒนาการ
- **v13 (cleanup)** — ทำความสะอาด repo: ลบ blueprint file ซ้ำที่ root และ kit v1 เก่าที่ถูกแทนที่แล้ว, รวมโฟลเดอร์ที่ซ้ำซ้อนกันเหลือชุดเดียว · รีเซ็ต `system/` กลับเป็น blank template (ล้าง D-001/D-002/D-003 neumorphism/mobile-first demo, ล้าง apps/lab/candidates.js, ลบ system/refs/archive ที่ไม่มี ref จริง) · แก้ path ค้าง (`DECISIONS.md`/`STATE.md`/`reports/`/`refs/` ที่ไม่มี `system/` prefix) ในหลาย agents/skills ให้ตรงกับ Factory edition (v11) · BLUEPRINT.md เขียนใหม่รวม gap-audit (size/space namespace, token categories ครบ, system dimensions, API standards, governance) เป็นเนื้อเดียว ไม่มี addendum แปะท้ายอีก · แพตช์ subagent ที่ตกหล่นจาก gap-audit (foundation-inference เพิ่ม sizing step, token-architect เพิ่ม token category checklist, qa-a11y เพิ่ม forced-colors baseline check, docs-publisher เพิ่ม content guidelines + deprecation policy)
- **v14 (agent-native workshop, merged selectively)** — ดึงจาก kit drop v14 ภายนอกเฉพาะส่วนที่ไม่กระทบโครง Dial ที่สร้างไปแล้ว (React-only, ยัง Wave 1-2 อยู่): (1) **Reuse Check** ก่อนสร้างทุก component ใน `production-run` + `component-engineer` — grep/MCP หาของใกล้เคียงก่อนสร้างใหม่ กัน pattern drift ตอน wave หลังๆ (2) **Storybook MCP note** ใน `qa-a11y` — ใช้เป็นหลักฐานเพิ่มถ้ามี addon-mcp ติดตั้ง อำนาจ PASS/FAIL ยังอยู่ที่ checklist เดิม ไม่บล็อกงานถ้าไม่มี (3) **Contrast self-check บังคับ** ใน `component-engineer` ก่อนส่ง qa-a11y — ป้องกันรอบ QA-fail-fix-reverify ที่กินเวลาที่สุดใน Wave 2 (4) เพิ่ม docs อ้างอิง `PORTABILITY.md` / `DISTRIBUTION.md` / `QUICKSTART.md` / `STORYBOOK-MCP.md` เป็น reference สำหรับ system ใหม่ในอนาคตที่อาจต้องการ multi-adapter — **ไม่ retrofit Dial** เพราะ commit React ไปแล้วเต็มตัว รื้อตอนนี้ไม่คุ้มเวลา

## v3.0 — 2026-10-26 — engine split: kiln has no system of its own
- Dial moved out to its own repo (cloned from tag `dial-final`, full history). kiln keeps the
  engine only: agents, skills, tooling, templates, apps/lab + apps/sheet, docs.
- `system/` reset from `templates/system/`, which gained `EXCEPTIONS.md`, `sheets/` and
  `kiln.config.json` (per-system names gates read: story categories, smoke-import exports/render
  probes/legacy names).
- Hooks rewritten to actually enforce (`tooling/hooks/`, gate-proofed by `hooks.selftest.mjs`):
  lint blocks with exit 2 on the edited file; `DECISIONS.md` is append-only with full fields and
  sequential D-numbers.
- `docs/CATALOG.md` back to the full 108-component engine default; per-system trimming goes
  through `/lock-decision`.
- `gate:selftest` 7/7 on a blank engine.
