---
name: production-run
description: รันการผลิต component จำนวนมาก (10-100+ ตัว) แบบเป็น wave โดยรวบ checkpoint ของ user ไว้หัว wave เดียว ไม่ถามจุกจิกรายตัว ใช้เมื่อเข้า Phase 3-5 หรือ user สั่งผลิตเป็นชุด/ทั้ง catalog
---
# Production Run — ผลิตเป็น wave ไม่เผา token

**หลักเศรษฐศาสตร์:** token แพงที่สุดคือ (1) ถาม user ทีละตัว 100 รอบ (2) agent เดาผิดแล้วรื้อ (3) ทำทุก component เท่ากันทั้งที่ความเสี่ยงต่างกันคนละขั้ว — แก้ทั้งสามด้วยการ**รวบการตัดสินใจไว้หัว wave, ผลิตแบบขนานเป็น batch, และจัดสรร rigor ตาม tier** (ดู `ds-conventions/SKILL.md`'s Rigor Tiers — ORDERS C1) ระหว่างกลางวิ่งยาวไม่หยุด

## โครง 1 Wave (8-12 components ที่ dependency พร้อม)
```
1. WAVE PLAN (1 ข้อความ)   → รายชื่อ + ลำดับ + สิ่งที่จะ reuse + ประเมินขนาดงาน (S/M/L ต่อตัว) + Rigor Tier ต่อตัว (T1/T2/T3)
2. BATCH API REVIEW (1 เอกสาร) → props/variants/sizes ของทุกตัวใน wave รวมไฟล์เดียว
                                  ↳ USER CHECKPOINT เดียวของ wave นี้ (ORDERS C4 — ลดจาก 2 checkpoint เหลือ 1)
                                  ↳ แก้ตรงไหนบอก แล้ว lock ทั้งชุด (D-xxx เดียว)
                                  (ถ้า user สั่ง auto-approve ข้าม checkpoint นี้ได้ — component-engineer เดาตาม pattern มาตรฐาน + lock เป็น decision เดียวหลังทำเสร็จ)
3. EXECUTE (parallel batch)  → ดูหัวข้อ "Parallel Batch Execution" ด้านล่าง — ไม่ใช่ inner loop รายตัวทีละคน
                              ห้ามถาม user ยกเว้นชน STOP CONDITION หรือ Template Checkpoint (ดูด้านล่าง)
4. WAVE REPORT (1 ข้อความ)  → ตารางสั้น (ดูหัวข้อ "รูปแบบรายงาน" — ORDERS C6) + อัพเดต STATE + commit + tag wave-N
                                  → **ไม่ต้องรอ user อนุมัติก่อนเริ่ม wave ถัดไป** (ORDERS C4 — WAVE REPORT คือรายงาน ไม่ใช่การขออนุญาต) เดินต่อ wave ถัดไปทันทีเว้นแต่ชน STOP CONDITION
```

## Parallel Batch Execution (ORDERS C3 — เลิกทำทีละตัว)
Component ที่**ไม่พึ่งกัน** (ไม่ import กันเอง, ไม่ใช้ token/pattern ที่อีกตัวยังไม่ lock) ให้ยิง subagent พร้อมกันครั้งละ **4-6 ตัว** ไม่ใช่ทำทีละตัวเรียงคิว:
- แต่ละ agent ทำ: reuse check → เขียนโค้ด (รวม contrast self-check) → hook lint → self-check → handoff
- QA ตรวจตาม Rigor Tier ของแต่ละตัว (T1/T2 = diff-review, T3 = รันซ้ำเต็ม — ดู `qa-a11y.md`)
- **รวบรายงานเป็นชุดเดียวท้าย batch** ไม่ใช่รายงานทีละตัวที่เสร็จ (ประหยัด token ของ orchestrator เอง ไม่ใช่แค่ของ user)
- Component ที่พึ่งกันจริง (เช่น Select ต้อง reuse Listbox) ให้รอ batch ที่ Listbox อยู่เสร็จก่อน ไม่ยิงพร้อมกันข้าม dependency

**ข้อยกเว้น: แม่แบบของ pattern ใหม่ (Template Checkpoint, ORDERS C4)**
ถ้าตัวแรกใน batch เป็น**แม่แบบที่อีกหลายตัวใน wave (หรือ wave ถัดไป) จะ reuse pattern/helper ของมัน** (เช่น Listbox เป็นแม่แบบของ Select/Combobox/MultiSelect ทั้งหมด) — สร้าง**แม่แบบตัวเดียวก่อน** ทำให้ผ่าน QA เต็มรูปแบบ แล้ว**หยุดรายงาน รอ user ตรวจก่อน** จึงยิง batch ที่เหลือที่ reuse แม่แบบนั้น — checkpoint พิเศษนี้ใช้ได้**เฉพาะตอนสร้างแม่แบบตัวแรกของ pattern ใหม่เท่านั้น** ไม่ใช่ default behavior ของทุก wave (ตัวอย่างจริง: Listbox ใน W5 — เกิด 2 รอบ API review ก่อนอนุมัติ ป้องกัน error ที่จะคูณไปอีก 6 ตัว)

## Per-Component Budget (ORDERS C5)
ประเมินเวลา/รอบการทำงานต่อตัวตาม tier ก่อนเริ่ม (ใส่ไว้ใน WAVE PLAN):
- **T1:** ~1 รอบ engineer + diff-review — ถ้าเกิน 2 รอบแก้ = STOP CONDITION
- **T2:** ~1-2 รอบ engineer + diff-review — ถ้าเกิน 3 รอบแก้ = STOP CONDITION
- **T3:** ~2-3 รอบ engineer + QA เต็ม (รวม Gate Proof) — ถ้าเกิน 2 เท่าของที่ประเมินไว้ = STOP CONDITION

**เกินประมาณ ~2 เท่า = หยุดถามทันที ห้ามดันต่อเงียบๆ** — ไม่ใช่แค่ "งานใหญ่กว่าที่คิด" แบบกว้างๆ (ข้อเดิม) แต่วัดจริงเทียบกับ budget ที่ตั้งไว้ล่วงหน้าต่อ tier

## Reuse Check (ก่อนสร้างทุกตัว — กัน component ซ้ำ/pattern drift)
เจอ component/pattern ใกล้เคียงที่มีอยู่แล้ว → เสนอ user 3 ทาง: **ใช้ตัวเดิม** / **เพิ่ม variant ให้ตัวเดิม** / **สร้างใหม่จริงเพราะ...** (ห้ามสร้างใหม่เงียบๆ) — ถ้ามี Storybook + addon-mcp ใช้ query MCP ได้ (ดู `docs/STORYBOOK-MCP.md`) ไม่มีก็ grep source ปกติ ไม่ block งาน

## STOP CONDITIONS (เจอแล้วหยุดถาม ห้ามดันต่อ)
- component เดิมตก QA ครบ 3 รอบ
- ต้องเพิ่ม dependency ใหม่ / เปลี่ยน API ที่ lock ไปแล้ว / กระทบ token ชั้น semantic
- งานจริงต่อตัวเกิน budget ที่ประเมินไว้ (ดู Per-Component Budget) เกิน ~2 เท่า
- QA เจอ finding จริงระหว่าง diff-review ของ T1/T2 → escalate เป็น T3-style review (ไม่ใช่ stop เดินทั้ง wave แค่ยกระดับการตรวจตัวนั้น)
- ผ่านมา ~5 components หรือ session ใกล้เต็ม → เขียน CHECKPOINT ลง system/STATE.md ก่อนเสมอ (กันไฟดับ)

## Resume Protocol
ทุก session ใหม่: อ่าน system/STATE.md บรรทัด Wave ปัจจุบัน → ทำต่อจาก component ถัดไปทันที ไม่ต้องถามซ้ำ ไม่ต้องเล่าซ้ำ

## กติกา docs ระหว่าง run
docs-publisher เขียน docs ทันทีที่ตัวไหนผ่าน QA (ไม่กองไว้ท้าย run) — ถ้าไฟดับกลางทาง ของที่เสร็จแล้วต้องมี docs ครบเสมอ (บั๊กจริงที่เจอ: RadioCards/Rating หลุดไปแล้วรอบหนึ่ง แก้ทันทีที่เจอ — ห้ามหลุดซ้ำ)

## รูปแบบรายงาน (ORDERS C6 — สั้นลง ไม่เล่ากระบวนการ)
WAVE REPORT และ batch report ท้าย EXECUTE ใช้ตารางนี้เป็นหลัก ไม่ใช่ prose ยาว:

| Component | Tier | Gate | ปัญหาที่เจอ |
|---|---|---|---|
| ชื่อ | T1/T2/T3 | PASS/FAIL + ตัวเลขจริง (lint/tsc/test/playwright) | สั้นๆ ว่ามี finding อะไรบ้าง ถ้าไม่มีเขียน "—" |

ตามด้วยสรุปไม่เกิน 3-4 บรรทัด (จำนวนที่ผ่าน QA รวม, สิ่งที่ต้องรอ user ตัดสินใจถ้ามี) — **ไม่ต้องเล่าว่าทำอะไรตามลำดับยังไง** ("อ่านโค้ดก่อน แล้วเขียน แล้วรัน...") เก็บรายละเอียดกระบวนการไว้ใน STATE.md log ถ้าจำเป็นต้องบันทึกไว้อ้างอิงทีหลัง ไม่ใส่ในรายงานที่ user อ่าน
