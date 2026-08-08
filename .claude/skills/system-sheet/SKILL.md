---
name: system-sheet
description: สร้าง/รีเฟรชโปสเตอร์สรุป design system เป็น PNG (System Sheet) ใช้อัตโนมัติหลัง lock แต่ละรอบใน Phase 1, หลังจบทุก wave, หรือเมื่อ user สั่ง /system-sheet
---
# System Sheet — พรีวิว PNG ของทั้งระบบ

**หน้าที่:** หลังการถาม-ตอบ/lock ทุกรอบ user ต้องได้เห็นภาพรวมเป็นโปสเตอร์ ไม่ใช่อ่าน JSON

## เมื่อไหร่ (อัตโนมัติ ไม่ต้องรอสั่ง)
- จบทุกรอบ lock ของ Phase 1 (สี, type, spacing, …) → refresh
- จบทุก WAVE REPORT → refresh (เพิ่ม component preview ของ wave นั้น)
- user สั่ง /system-sheet เมื่อไหร่ก็ได้

## เนื้อหาบนแผ่น (อ่านจาก system/DECISIONS.md + tokens จริงเท่านั้น — ห้ามใส่ค่าที่ยังไม่ lock)
Header (ชื่อ system, D-ที่ lock, platform, วันที่) · 01 Color (primitive ramps + semantic + กฎ accent) ·
02 Type scale (ratio, ตัวอย่างจริง) · 03 Spacing (base + แท่ง scale) · 04 Shape & Elevation (radius, เงา demo) ·
05 Components preview (ตัวที่ผ่าน QA แล้วเท่านั้น) · 06 Tokens ตัวอย่าง 3 ชั้น · Footer (generated-by + จำนวนคิว)

## วิธี render
1. เติมข้อมูลลง `apps/sheet/template.html` (สไตล์ของแผ่น = editorial กลางๆ อ่านง่าย — **ไม่ใช่**สไตล์ของ system ยกเว้น swatch/preview ที่ต้องโชว์ของจริง)
2. `node apps/sheet/render.mjs` → ได้ `system/sheets/sheet-{YYYY-MM-DD}.png` (เก็บทุกใบ = timeline วิวัฒนาการของระบบ)
3. แจ้ง path ให้ user + อัพเดต system/STATE.md
ครั้งแรกถ้ายังไม่มี playwright: `pnpm add -D playwright && npx playwright install chromium`
