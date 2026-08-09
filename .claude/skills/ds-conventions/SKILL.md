---
name: ds-conventions
description: มาตรฐานกลางของ design system นี้ — Anatomy Contract 9 ข้อ, naming, โครงไฟล์ component, กฎ token ใช้ทุกครั้งที่สร้างหรือรีวิว component/token หรือเมื่อสงสัยว่ามาตรฐานคืออะไร
---

# DS Conventions

## Anatomy Contract — Definition of Done ของทุก component (ครบ 9 ข้อเท่านั้นถึงนับว่าเสร็จ)
1. Anatomy: ชิ้นส่วนภายในมีชื่อครบ
2. Variants ประกาศครบ (เช่น Button: solid/outline/ghost/link × primary/neutral/danger)
3. Sizes ตาม t-shirt mapping ที่ lock ใน system/DECISIONS.md
4. States: default, hover, active, focus-visible, disabled + loading/error/read-only/indeterminate/selected ตามที่เกี่ยว
5. Tokens consumed: ลิสต์ component tokens ทั้งหมด — ไม่มีค่าดิบ
6. A11y spec: role/ARIA, keyboard map, focus behavior, SR notes
7. API: TS interface + defaults + forwardRef + asChild (ถ้า interactive) + controlled/uncontrolled (ถ้า input)
8. Stories: ทุก variant × size + states + playground
9. Docs page: demo, code, API table, Do/Don't, a11y, related

## โครงไฟล์ต่อ component
```
packages/react/src/components/{Name}/
├── {Name}.tsx
├── {Name}.module.css      # CSS vars เท่านั้น, logical properties เท่านั้น
├── {Name}.stories.tsx
├── {Name}.test.tsx        # interaction + axe
└── index.ts
```
Token ของมัน: `packages/tokens/src/component/{name}.json`

## Naming
- Tokens: `{category}.{concept}.{property}.{variant}.{state}` · space.* ≠ size.* (คนละ namespace)
- CSS vars: `--ds-{token-path-kebab}` เช่น `--ds-button-bg-primary-default`
- Components: PascalCase · props: camelCase · variant values: lowercase

## ลำดับ dependency (ห้ามข้าม)
Layout primitives (Box, Stack, Grid, Container) → Tier 1 atoms → Tier 2 molecules → Tier 3 organisms

## Honesty Rule (บังคับทั้งระบบ)
ห้ามเคลมสิ่งที่ test ปัจจุบันทำให้มันแดงไม่ได้ · คำว่า verified ใช้ได้เฉพาะเมื่อมี test ที่จะ fail ถ้าพฤติกรรมหายไป · ที่เหลือเขียน `UNVERIFIED: {อะไร} (ต้องใช้ {เครื่องมือ})`

## Gate Proof Rule (Honesty Rule เวอร์ชันใช้กับเครื่องมือ — บังคับทั้งระบบ)
> ที่มา: no-hardcode-lint มีรูสองรอบ (W1 sizing/physical-inset หลุด, w5-preflight logical-property
> regex ไม่เห็น `-inline-start`/`-block-end` เลย) — เจอด้วยการรีวิว+โชคทั้งคู่ ไม่ใช่ระบบตรวจตัวเอง
> ปัญหาจริงไม่ใช่ regex พัง แต่คือ **ไม่มีอะไรพิสูจน์ว่า gate จับได้จริงก่อนเอาไปใช้**

**ทุกกฎ lint และทุก conformance helper ต้องมาพร้อมหลักฐานว่ามันแดงได้จริง ก่อนถือว่าใช้งานได้:**
1. **Mutate** — แก้โค้ด/CSS ให้ผิดตรงกับสิ่งที่กฎนี้ควรจับ (ตั้งใจทำผิดจริง ไม่ใช่เดา)
2. **Confirm red** — รันกฎ/test แล้วต้องแดงจริง ถ้าไม่แดง = กฎนี้ยังพิสูจน์ไม่ได้ว่ามีอยู่จริง ห้ามถือว่าใช้งานได้จนกว่าจะแก้
3. **Revert** — เอาโค้ดที่ mutate กลับคืนของเดิม ยืนยันเขียวอีกครั้ง
4. **เก็บเป็นหลักฐานถาวรถ้าทำได้** — ถ้า mutate-confirm-revert ทำเป็น automated test ได้ (เช่น conformance spec ที่ mutate ผ่าน fixture แล้วเช็ค) ให้เก็บไว้เป็น regression test จริง ไม่ใช่แค่รันมือครั้งเดียวแล้วทิ้ง — ถ้าทำเป็น automated ไม่ได้ (เช่น lint rule ที่ทดสอบกับไฟล์ทดสอบชั่วคราว) ให้บันทึกขั้นตอน mutate ที่ใช้ไว้ใน comment ของกฎนั้นเพื่อให้รอบหน้า reproduce ได้

**กฎที่ไม่เคยเห็นตัวเองแดง = ยังไม่พิสูจน์ว่ามีอยู่จริง** — ห้ามส่งมอบ lint rule/conformance helper ใหม่โดยไม่ผ่านขั้นตอนนี้ ไม่ว่าจะดูสมเหตุสมผลแค่ไหนตอนเขียน (v3's logical-property regex ก็ "ดูสมเหตุสมผล" ตอนเขียนเหมือนกัน)

## Definition of Done เพิ่ม (ข้อ 10-11 ต่อจาก Anatomy Contract 9 ข้อ)
10. **Docs content เขียนตอนสร้าง ไม่ใช่ตอน Phase 6** — `packages/spec/{name}.md` ต้องมี: usage 3-5 บรรทัด, Do/Don't อย่างละ 2-3, a11y notes (keyboard map + SR behavior), props table, related components · Phase 6 มีหน้าที่แค่ประกอบเป็นเว็บ
11. **Browser-only behavior มี conformance spec** — keyboard nav / focus trap / positioning / non-color cue / hit area ต้องมีไฟล์ใน `packages/conformance/specs/` และรันเขียว

## Exception Policy
ค่าที่ตกเกณฑ์แต่จะยอมรับ ต้องขึ้นทะเบียน `system/EXCEPTIONS.md` (E-xxx) พร้อมขอบเขตที่แคบที่สุด · System Sheet ต้องแสดง "AA · {n} exception" ห้ามประกาศ AA ลอยๆ
