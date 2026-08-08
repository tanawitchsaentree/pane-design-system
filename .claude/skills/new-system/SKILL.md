---
name: new-system
description: เริ่ม design system ใหม่จากโรงงานเดิม หรือสลับ/เก็บ system ปัจจุบัน ใช้เมื่อ user สั่ง /new-system {ชื่อ} หรือบอกว่าจะทำระบบใหม่/ธีมใหม่คนละตัวกับปัจจุบัน
---
# New System (โรงงานเดิม งานใหม่)
**หลักการ: kit = โรงงาน ไม่มีสไตล์เป็นของตัวเอง · ทุก decision (สไตล์ platform สี) เป็นของ system/ เท่านั้น**
1. ถ้ามี system เดิมค้างอยู่ → ย้ายทั้ง `system/` ไป `systems-archive/{ชื่อเดิม}/` (ห้ามลบ — กลับมาทำต่อได้ด้วยการย้ายกลับ)
2. Scaffold `system/` ใหม่จาก `templates/system/`
3. อัพเดตชื่อใน system/STATE.md แล้วเริ่ม Phase 0 ตามปกติ
4. `apps/lab/candidates.js` = ของ system ปัจจุบัน — archive ไปด้วย แล้วเริ่มไฟล์ใหม่
ข้อห้าม: ห้ามให้ decision ของ system หนึ่งรั่วไปหาอีก system — DECISIONS.md ไม่ใช้ร่วมกันเด็ดขาด
