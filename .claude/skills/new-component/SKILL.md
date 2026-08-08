---
name: new-component
description: เริ่มผลิต component ใหม่ 1 ตัวตาม inner loop เต็มรูปแบบ ใช้เมื่อ user สั่ง /new-component {Name} หรือถึงคิว component ถัดไปตาม dependency order
disable-model-invocation: false
---

# New Component Loop

เมื่อถูกเรียกด้วยชื่อ component (เช่น `/new-component Button`):

1. **Pre-check:** อ่าน system/STATE.md + system/DECISIONS.md → ยืนยันว่า dependencies ของตัวนี้เสร็จแล้ว (เช่น FormField ต้องมี Input ก่อน) ถ้ายัง → แจ้งและเสนอทำ dependency ก่อน
2. **Propose API (+RENDER ถ้ามีทางเลือกเชิงภาพ):** variant/รูปทรงที่เลือกด้วยตาได้ ให้เขียน candidates ลง apps/lab/candidates.js ให้ user เปิดเทียบก่อน — ให้ subagent `component-engineer` เสนอ props interface + variants + sizes + states → สรุปให้ user ยืนยัน (คำถามเดียว: "API นี้โอเคไหม มีอะไรเพิ่ม/ตัด?")
3. **Lock:** บันทึก API ที่ยืนยันแล้วผ่าน /lock-decision
4. **Build:** component-engineer เขียน tokens → โค้ด → stories → tests (hook lint ทำงานอัตโนมัติทุกการแก้ไฟล์)
5. **Gate:** ส่งให้ subagent `qa-a11y` ตรวจ → ถ้า FAIL วนกลับข้อ 4 พร้อมรายการแก้ (สูงสุด 3 รอบ เกินนั้นหยุดถาม user)
6. **Ship:** PASS แล้ว → subagent `docs-publisher` ทำ docs page + จัด Storybook + changeset
7. **Close:** อัพเดต system/STATE.md (เพิ่มเข้าลิสต์ผ่าน QA, ระบุตัวถัดไปตามลำดับ) + commit ข้อความ `feat({name}): complete per anatomy contract`
