---
name: abstract-interpreter
description: ตีความ ref ที่ไม่ใช่ UI (hardware, โปสเตอร์, ภาพถ่าย, งานศิลปะ, moodboard) ให้กลายเป็น design principles และ decision ที่ lock ได้ ใช้เมื่อ intake ระบุว่า ref เป็น non-UI หรือเมื่อ user โยนภาพเชิง abstract มา
---

# Abstract Interpreter

ref แบบ non-UI วัดค่าตรงๆ ไม่ได้ — หน้าที่ skill นี้คือแปล 3 ชั้น: **เห็นอะไร (กายภาพ) → หลักการที่ซ่อนอยู่ → decision ของ DS** แล้วคุยกับ user ทีละประเด็นจน lock

## Loop ต่อ ref
1. อ่าน `system/reports/extraction-*.md` ของ ref นั้น (intake ทำไว้แล้ว)
2. เขียน Interpretation Table: แถวละ 1 ประเด็น คอลัมน์ = เห็นอะไร / หลักการ / แปลเป็น DS decision — เอาเฉพาะประเด็นที่มีผลจริง 4-7 แถวพอ
3. ระบุ **ความขัดแย้ง** ระหว่างโลกกายภาพกับโลกจอ (เช่น วัตถุ 3 มิติ → จอแบน) เสนอ 2-3 ทางพร้อม trade-off
4. ถาม user **ทีละคำถาม** — คำตอบแต่ละข้อจบด้วย /lock-decision
5. ผลรวมส่งต่อ foundation-inference เป็นวัตถุดิบ (principles + constraints ไม่ใช่ตัวเลขดิบ)

## DS-Knowledge Checklist (ไล่ให้ครบทุก ref)
- **Color role:** สีไหนคือวัสดุ (canvas) สีไหนคือ affordance (interactive) สีไหนคือข้อมูล — ใน hardware ที่ดี สีจัดมักอยู่ที่ "ของที่นิ้วแตะได้" เท่านั้น
- **Dimension → space:** ความหนา/ระยะห่างของวัตถุจริง แปลเป็น density (แน่น/โปร่ง) และ base unit — วัตถุโล่งๆ ของน้อยชิ้น = spacious, base 8
- **Materiality → style:** ผิววัสดุแปลเป็นสไตล์ไหน (ดู docs/style-recipes/vocabulary ด้านล่าง) และสไตล์นั้นมี recipe รองรับหรือยัง
- **Hierarchy:** ref ใช้อะไรสร้างลำดับ — ขนาด? ตำแหน่ง? สี? (Braun ใช้ตำแหน่ง ไม่ใช้ขนาด → type scale แบน)
- **Texture:** ลวดลายมีหน้าที่หรือเป็นการตกแต่ง — อนุญาตเฉพาะที่มีหน้าที่
- **สิ่งที่ ref ตอบไม่ได้:** ลิสต์ให้ชัด (เช่น hardware ไม่มี error state) → ต้อง generate + ให้ user เคาะ

## Style Vocabulary (แยกให้ขาด ห้ามใช้ปน)
- **Skeuomorphism** — เลียนวัตถุจริงหลายวัสดุ (หนัง กระดาษ โลหะ)
- **Neumorphism / Soft UI** — นูน/บุ๋มจากผิวเดียว เงาคู่นุ่มสองทิศ ← มี recipe: `docs/style-recipes/neumorphism.md`
- **Claymorphism** — พองแบบดินน้ำมัน มุมมนใหญ่ พาสเทล
- **Glassmorphism** — กระจกฝ้า backdrop blur
- **Flat / Swiss** — ไม่มีมิติ พึ่ง typography+grid ล้วน
ถ้า user เลือกสไตล์ที่ยังไม่มี recipe → เขียน recipe ใหม่ลง docs/style-recipes/ ก่อนไป Phase 1 (โครงเดียวกับ neumorphism.md: นิยาม / จุดเสี่ยง QA / กฎเอาตัวรอด / token ที่ต้องมี)

## Format output ตายตัว
Interpretation Table → ความขัดแย้ง+ทางเลือก → คำถามเดียว
ห้ามจบด้วยรายงานค่าสี 40 ค่าที่ตีความอะไรไม่ได้

## Conflict Protocol (ref ใหม่ ชน decision เดิม)
ก่อนตีความ ref ใหม่ ให้อ่าน system/DECISIONS.md ทั้งหมด แล้ว:
1. ระบุว่า ref ขัดกับ D-xxx ไหนบ้าง ชี้ให้ชัดว่าขัดตรงไหน
2. เสนอ 3 ทางเสมอ: **Supersede** (เปลี่ยนของเดิม — แจ้ง impact จากช่อง "กระทบ") / **Merge** (อยู่ร่วมเป็นชั้น/โซน) / **Archive** (ref ใหม่แพ้ ย้ายไป system/refs/archive/ พร้อมโน้ต)
3. ถ้าเป็นเรื่องที่เห็นด้วยตาได้ → render ทางเลือกลง apps/lab/ ให้ user เทียบก่อนเคาะ
4. ผลการเคาะ → /lock-decision + จัดการไฟล์ ref ตามผล (archive ไม่ลบ)
