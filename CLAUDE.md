# Design System Factory — Orchestrator Rules

**Kit นี้คือโรงงาน — ไม่มีสไตล์เป็นของตัวเอง** สไตล์/platform/สีเป็น decision ของ system ปัจจุบันใน `system/` เท่านั้น (สลับงานใหม่: /new-system) โรงงานนี้สร้าง design system ครบวงจร: tokens package + React component library + docs site + Storybook
Blueprint ฉบับเต็ม: `docs/BLUEPRINT.md` (อ่านเมื่อต้องการรายละเอียด อย่า copy ทั้งไฟล์เข้า context)

## Memory Protocol (ทำก่อนเริ่มงานทุก session — ไม่มีข้อยกเว้น)

1. อ่าน `system/STATE.md` → รู้ว่าอยู่ phase ไหน ค้างอะไร
2. อ่าน `system/DECISIONS.md` → รู้ว่าอะไร lock ไปแล้ว **ห้ามขัดกับสิ่งที่ lock แล้วเด็ดขาด**
3. จบ task ใหญ่ทุกครั้ง → อัพเดต `system/STATE.md` (phase, งานล่าสุด, งานถัดไป)
4. ทุกการตัดสินใจเชิงโครงสร้าง → บันทึกผ่าน skill `lock-decision` เท่านั้น (format เดียวกันเสมอ)
5. Extraction reports เก็บที่ `system/reports/` — อ้างอิงด้วย path ไม่ต้อง copy เนื้อหาซ้ำ

## กฎเหล็ก (ผิดข้อไหนคือ bug ทันที)

1. **Token 3 ชั้น:** primitive → semantic → component. Component tokens ห้ามชี้ primitive ตรง component code ห้ามมีค่าดิบ (hex, px) — hook lint จะจับ
2. **Interaction loop:** PROPOSE → RENDER → CONFIRM → LOCK → NEXT — การตัดสินใจที่*เห็นด้วยตาได้* (สี, style, spacing, component variant) ต้อง render candidates ลง `apps/lab/` (เขียนเพิ่มใน `apps/lab/candidates.js` แล้วให้ user เปิด `apps/lab/index.html`) ก่อน CONFIRM เสมอ และ /lock-decision ต้องแนบ path screenshot ของ candidate ที่ชนะ · หลัง LOCK ทุกรอบใน Phase 1 และหลังทุก WAVE REPORT ให้รัน skill system-sheet เพื่อ refresh พรีวิว PNG ของทั้งระบบให้ user เสมอ ห้ามเดาแทน user ในเรื่องที่ irreversible
3. **ถามทีละเรื่อง:** ห้าม dump คำถามหลายข้อพร้อมกัน เสนอพร้อมเหตุผล + 2-3 ทางเลือก + default ที่แนะนำ
4. **Dependency order:** Layout primitives → Tier 1 atoms → Tier 2 molecules → Tier 3 organisms ห้ามข้าม
5. **Definition of Done ของ component = Anatomy Contract 9 ข้อ** (ดู skill `ds-conventions`) ไม่ครบ = ไม่เสร็จ
6. **QA gate ศักดิ์สิทธิ์:** component ที่ไม่ผ่าน qa-a11y ห้ามเข้า docs/Storybook ห้าม commit ว่า done

## Phase Order + ใครทำ

| Phase | Subagent | Output | User checkpoint |
|-------|----------|--------|-----------------|
| 0 Intake | `intake` | `system/reports/extraction-*.md` | vibe หรือเป๊ะ / ref ไหนเป็นหลัก |
| 1 Foundations | `foundation-inference` | ข้อเสนอ scales ทีละเรื่อง | lock ทุกเรื่อง (7-8 รอบ) |
| 2 Tokens | `token-architect` | `packages/tokens/` DTCG 3 ชั้น + build | review token preview |
| 3-5 Components | skill `production-run` (waves) | component ครบ contract ทีละ wave | BATCH API REVIEW หัว wave เดียว (ORDERS C4 — เลิก checkpoint ท้าย wave, ยกเว้นแม่แบบ pattern ใหม่ที่มี Template Checkpoint ของตัวเอง) |
| 6 Publish | `docs-publisher` | docs site, Storybook, npm | ชื่อ package/scope |

## การใช้ Subagents

- งานอ่านภาพ ref, งานวิเคราะห์ยาวๆ, งานเขียน component → delegate ให้ subagent เสมอ (กัน context หลักบวม)
- `qa-a11y` เป็น read-only + รัน test เท่านั้น — ห้ามให้มันแก้โค้ดเอง มันมีหน้าที่ตีกลับพร้อมรายการที่ต้องแก้
- ผลจาก subagent ให้สรุปสั้นเข้า main แล้วชี้ path ไฟล์เต็ม

## Stack (lock แล้วระดับ blueprint)

pnpm + Turborepo + Changesets · tokens = DTCG JSON (spec 2025.10) + Style Dictionary · React + CSS variables + CSS Modules · behavior ยืมจาก React Aria/Radix ห่อด้วย tokens ของเรา · Storybook = workshop, docs site = หน้าบ้าน · RTL-ready: ใช้ logical properties เท่านั้น (`padding-inline-start` ไม่ใช่ `padding-left`)
