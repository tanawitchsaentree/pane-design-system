# NEXT — handoff 2026-10-27 (terminal closed mid-work)

## สถานะตอนปิด
- commit ล่าสุด: `2d3f2b6` (verify เขียวครบ 2 ธีม: glass 144,433/144,564 · 131 excepted E-001 · conformance 73/73 · tone 36/36 · smoke 19/19)
- **ยังไม่ commit (WIP):** crafted controls — slider/select วาดจาก token, chevron, `color-scheme` ต่อธีมใน tokens build, check ใหม่ G-N1 ใน conformance (gate-proof แล้วด้วย probe แยก)
- verify v9 (รวม crafted controls) **ถูกตัดกลางทาง** ตอนปิด terminal → ต้องรันใหม่: `pnpm run verify` (ใช้เวลานาน ~40–60 นาที เพราะวัด 2 ธีม)
- server preview (`pnpm --filter pane-docs preview`, port 4173) ปิดไปพร้อม terminal

## กติกาเครื่อง (user สั่ง 2026-10-27: ห้ามให้เครื่องกระตุกอีก)
- ระหว่างทำงานใช้ `pnpm run verify:quick` (ไม่มี glass evidence) · `pnpm run verify` เต็มรันได้เฉพาะเมื่อบอก user ก่อนและ user ตกลง
- ขั้นที่ใช้ browser รันที่ `nice -n 19` แล้ว · ห้ามทิ้ง process เบื้องหลังค้างไว้ตอนจบ turn

## ทำต่อตามลำดับ (อัปเดต 2026-10-27 ดึก)
- ✅ ข้อ 2 (docs ส่วน), 3, 4, 5 เสร็จ: ทุก component 4 tab ถึง Carbon, benchmark 32/32, G-IA1 เขียว
- ⏳ รอ user: เลือกแบบ form ใน apps/lab/forms (A well / B written / C held) → แล้วสร้าง Input/Textarea/Checkbox/Radio/Switch + Label/FormField/HelperText/Fieldset/InputGroup/PinInput
- ต่อไป: derivation round ของ Button variant ใหม่ (ghost, danger, danger-ghost, lg, loading, icon, fullWidth) · G-BT1 (หัวข้อจาก 3 ระบบ × 9 หน้า foundation) · derivation round ของ 10 ตัวใน pendingDerivation พร้อมแก้บั๊กใน BACKLOG

1. ~~commit WIP crafted controls~~ เสร็จแล้ว · 2026-10-27 เย็น: 0.2.0 ผ่าน consumer test + verify:quick 74/74 — `pnpm run verify` เต็ม (glass evidence) ยังไม่ได้รันตั้งแต่ 2d3f2b6 ต้องขอ user ก่อน
2. **Button ถึงระดับ Carbon** (reference implementation ของ `component-depth.md`):
   - component: เพิ่ม variant `ghost`, `danger`, `danger-ghost` · size `lg` · `loading` (spinner, aria-busy, disabled, คงความกว้าง) · `icon` + `iconPosition` · `fullWidth` · `data-part` (container/label/icon/spinner) · token ใหม่ใน component.json (+ สีแดงสำหรับตัวอักษรบนกระจก dark ต้องวัดก่อน) · CHANGELOG entry · harness + conformance (loading, danger)
   - docs: 4 tab routes `/components/<slug>/{usage,style,code,accessibility}` (routes.json เพิ่ม `tabs`, router + tooling ทุกตัวที่อ่าน routes.json ต้อง expand), header ร่วม (status, last updated, live demo + theme/variant selector)
   - Usage registry U1–U14 (ตารางใน component-depth.md) — do/don't เป็น component จริงทุกคู่, RTL + overflow live, references ≥2 URL
   - Style tab: `tooling/spec-capture.mjs` — Playwright + CDP `CSS.forcePseudoState` วัดทุก variant × size × state × theme → `specs.json` → reverse-map เป็นชื่อ token, redline diagram
   - gates G-K1–G-K8 ใน conformance + gate-proof (ใส่บั๊กให้แดง แล้วแก้กลับ)
   - เป้า: usage ≥ 0.5 × Carbon Button (5,260 คำ / 36 sections)
3. อีก 12 component ไล่ทีละตัวตาม registry เดียวกัน
4. benchmark Carbon ที่เหลือ 28 ตัว: `node <kiln>/marketplace/plugins/kiln/skills/docs-engine/scripts/benchmark-depth.mjs` (resume ได้, ต้องมี network; รอบแรกโดน throttle)
5. G-IA1: nav แสดง catalog เต็ม (planned = "Planned · wave N" จาก kiln `docs/CATALOG.md`), เพิ่มหมวด Getting started (designing/developing/contributing/migrating), Foundations Content/Accessibility, Patterns ~12 หน้า
6. แล้วค่อยขยาย breadth ทีละ wave ตาม CATALOG (W3 Forms-Core: Input, Checkbox, Radio, Switch… ก่อน)

## kiln (commit แล้ว, local เท่านั้น ห้าม push)
- marketplace `09bb5f5` component-depth.md + benchmark script · `2ffc15a` G-L1/G-M1 · G-N1
- kiln `7963f30` rule 10 + standard #14 · USER-STANDARDS #12–#14
