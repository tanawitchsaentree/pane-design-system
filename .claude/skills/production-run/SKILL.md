---
name: production-run
description: รันการผลิต component จำนวนมาก (10-100+ ตัว) แบบเป็น wave โดยรวบ checkpoint ของ user ไว้หัว-ท้าย wave ไม่ถามจุกจิกรายตัว ใช้เมื่อเข้า Phase 3-5 หรือ user สั่งผลิตเป็นชุด/ทั้ง catalog
---
# Production Run — ผลิตเป็น wave ไม่เผา token

**หลักเศรษฐศาสตร์:** token แพงที่สุดคือ (1) ถาม user ทีละตัว 100 รอบ (2) agent เดาผิดแล้วรื้อ — แก้ทั้งคู่ด้วยการ**รวบการตัดสินใจไว้หัว wave และรวบรายงานไว้ท้าย wave** ระหว่างกลางวิ่งยาวไม่หยุด

## โครง 1 Wave (8-12 components ที่ dependency พร้อม)
```
1. WAVE PLAN (1 ข้อความ)   → รายชื่อ + ลำดับ + สิ่งที่จะ reuse + ประเมินขนาดงาน (S/M/L ต่อตัว)
2. BATCH API REVIEW (1 เอกสาร) → props/variants/sizes ของทุกตัวใน wave รวมไฟล์เดียว
                                  ↳ USER CHECKPOINT เดียว: แก้ตรงไหนบอก แล้ว lock ทั้งชุด (D-xxx เดียว)
3. EXECUTE                  → inner loop รายตัว: engineer→hook lint→qa gate→docs
                              ห้ามถาม user ยกเว้นชน STOP CONDITION
4. WAVE REPORT (1 ข้อความ)  → ผ่าน/ตก/ข้อสังเกต + อัพเดต STATE + commit + tag wave-N
                                  ↳ USER CHECKPOINT: อนุมัติ wave ถัดไป
```

## STOP CONDITIONS (เจอแล้วหยุดถาม ห้ามดันต่อ)
- component เดิมตก QA ครบ 3 รอบ
- ต้องเพิ่ม dependency ใหม่ / เปลี่ยน API ที่ lock ไปแล้ว / กระทบ token ชั้น semantic
- งานจริงใหญ่กว่าประเมินเกิน ~2 เท่า
- ผ่านมา ~5 components หรือ session ใกล้เต็ม → เขียน CHECKPOINT ลง system/STATE.md ก่อนเสมอ (กันไฟดับ)

## Resume Protocol
ทุก session ใหม่: อ่าน system/STATE.md บรรทัด Wave ปัจจุบัน → ทำต่อจาก component ถัดไปทันที ไม่ต้องถามซ้ำ ไม่ต้องเล่าซ้ำ

## กติกา docs ระหว่าง run
docs-publisher เขียน docs ทันทีที่ตัวไหนผ่าน QA (ไม่กองไว้ท้าย run) — ถ้าไฟดับกลางทาง ของที่เสร็จแล้วต้องมี docs ครบเสมอ
