# Storybook + agent integration (ทางเลือก — ระบบทำงานได้ปกติถ้าไม่มี)

> **กฎความปลอดภัย: MCP เป็น "แหล่งข้อมูลเพิ่ม" ไม่ใช่ตัวแทนของ gate**
> อำนาจตัดสิน PASS/FAIL ยังอยู่ที่ subagent `qa-a11y` เหมือนเดิมทุกประการ ถ้า MCP ใช้ไม่ได้ ทุกอย่างต้องวิ่งต่อได้ด้วย CLI

## ติดตั้ง (ทำใน Session 0 หลัง scaffold — ข้ามได้)
```bash
npm create storybook@latest        # ต้อง Node 20+, npm 10+ / pnpm 9+
npx storybook add @storybook/addon-mcp
```
**เงื่อนไข:** Storybook v10.3+ และปัจจุบันรองรับ **React ก่อน** (เฟรมเวิร์กอื่นทยอยตามมา)

## ได้อะไร (แมปกับ kit ตรงๆ)
| ความสามารถ | ใช้ตรงไหนของเรา |
|---|---|
| agent เห็น component/props/stories ที่มีอยู่จริง | **Reuse Check** ก่อนสร้างของใหม่ — กัน component ซ้ำ/pattern drift ตอน wave หลังๆ |
| test (interaction + a11y) รันในเบราว์เซอร์จริง แล้วส่งผลกลับเข้า agent | ป้อนเข้า `qa-a11y` เป็นหลักฐาน → engineer วนแก้เองได้เร็วขึ้นมาก |
| context อัพเดตตาม component ที่เปลี่ยน | ลด STATE ที่ต้องจำเอง |
| publish เป็น context กลาง | หลาย session/หลาย repo อ้างของชุดเดียวกัน |

## Degradation Policy (ห้ามพัง)
| สถานการณ์ | พฤติกรรม |
|---|---|
| ไม่มี MCP / เวอร์ชันไม่ถึง / adapter ไม่ใช่ React | ใช้ CLI เดิม: `pnpm test`, axe, Playwright — flow ไม่เปลี่ยน |
| MCP ตอบ แต่ขัดกับผล CLI | **เชื่อ CLI** และรายงานความขัดแย้งให้ user |
| MCP ล่มกลาง wave | บันทึกใน STATE แล้วทำต่อด้วย CLI ห้ามหยุด wave |

## ขอบเขต (อย่าคาดหวังเกิน)
MCP ไม่ตรวจ: no-hardcode lint (เป็น hook ของเรา), Anatomy Contract ครบ 9 ข้อ, logical properties, touch target, forced-colors, conformance ข้าม adapter — ของพวกนี้ยังเป็นงานของ `qa-a11y` + `packages/conformance` เหมือนเดิม
