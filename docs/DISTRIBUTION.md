# Distribution — แพ็ค kit นี้ออกขาย/แจก

## รูปแบบที่ปล่อยได้
1. **Claude Code plugin** (แนะนำ) — bundle `.claude/agents` + `.claude/skills` + hooks ติดตั้งครั้งเดียวใช้ได้ทุก repo · ผู้ใช้เพิ่ม marketplace แล้วติดตั้ง
2. **Repo template** — kit เต็ม (รวม apps/lab, apps/sheet, tooling) ให้ clone
3. **Tiered** — Core ฟรี (agents+skills พื้นฐาน) / Pro (Layout Lab + System Sheet + production-run + CATALOG 108 + conformance harness)

## เช็คก่อนขาย
- **สิทธิ์:** โค้ดใน kit เป็นของคุณ · ของที่ *อ้างถึง* (Radix/React Aria/TanStack/Style Dictionary) เป็น MIT/Apache — ผู้ใช้ติดตั้งเอง ห้าม vendor เข้ามาแล้วขายต่อเป็นของตัวเอง · ห้ามใช้ชื่อ/แบรนด์ Material, MUI, Braun ในตัวสินค้า (ref ส่วนตัวไม่ใช่ของแจก)
- **แยก engine ออกจาก system ให้สะอาด** ก่อนแพ็ค: `system/` และ `systems-archive/` = งานของคุณ ไม่ใช่ของสินค้า → ตัดออก เหลือแค่ `templates/system/`
- ใส่ LICENSE + `docs/KIT-CHANGELOG.md` + เวอร์ชันใน README ทุกครั้งที่ปล่อย

## สิ่งที่ทำให้ขายได้จริง (differentiator — เขียนลงหน้าขาย)
1. ไม่ใช่ generator ยิงครั้งเดียว — เป็นโรงงานที่มี **memory + governance** (DECISIONS/STATE, supersede, archive)
2. **ตัดสินใจด้วยตา** — Layout Lab เทียบ candidate บนฉากเดียวกันก่อน lock
3. **ใบรับรองเป็นภาพ** — System Sheet PNG refresh อัตโนมัติทุก lock
4. **สเกลได้จริง** — 108 components / 10 waves โดย user ตัดสินใจ ~10 ครั้ง (ไม่เผา token)
5. **Portable Core** — tokens/CSS/spec/test ใช้ได้ทุก framework, adapter บาง
6. **บังคับคุณภาพด้วยกลไก** — hook lint + QA gate แยกอำนาจ + conformance suite

## คำสัญญาที่ห้ามให้เกินจริง
- ไม่ใช่ "กดปุ่มเดียวได้ MUI" — เป็นเครื่องมือที่ย่นงานเดือนเหลือวัน โดยมีคนตัดสินใจอยู่ในลูป
- ความเก๋าจากผู้ใช้จริงนับหมื่นยังต้องแลกด้วยเวลา — สิ่งที่เราให้คือโครงสร้าง+a11y+docs ระดับมืออาชีพตั้งแต่วันแรก
