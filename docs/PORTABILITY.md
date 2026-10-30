# Portability — Portable Core + Adapters (ทางที่ 3)

> **หลักการเดียว: อะไรที่ port ได้ ห้ามผูก framework · อะไรที่ port ไม่ได้ ทำให้บางที่สุด**

## Portable Core (~70-80% ของคุณค่า — ทุก system ต้องมี ไม่ว่าเลือก adapter อะไร)
| ชิ้น | อยู่ที่ | ใช้ได้กับ |
|---|---|---|
| DTCG tokens + build outputs | `packages/tokens` | web, iOS, Android, Flutter, Figma |
| CSS ทั้งหมด (`*.module.css`, theme layers) | `packages/styles` | ทุก framework บนเว็บ + HTML เปล่า |
| Anatomy Contract + a11y spec ต่อ component | `packages/spec/{name}.md` | มนุษย์/agent ทุกภาษา |
| Test suite (Playwright + axe, ยิงใส่ DOM) | `packages/conformance` | ทุก adapter ต้องสอบชุดเดียวกัน |
| Docs เนื้อหา (usage, do/don't) | `apps/docs/content` | ไม่ผูกภาษา |

## Adapter (~20-30% — บางที่สุด)
`packages/react`, `packages/vue`, `packages/svelte`, `packages/wc` — หน้าที่มีแค่: bind state/event, ผูก ARIA ตาม spec, ใส่ className จาก core ห้ามมี design decision ใดๆ

## กฎเหล็กของ adapter (component-engineer ต้องทำตาม)
1. **CSS ทำได้ ห้ามทำใน JS** — hover/focus/active/disabled/responsive/animation อยู่ใน CSS ทั้งหมด (ทุกบรรทัดที่หลุดไป JS = ส่วนที่ port ไม่ได้)
2. ห้าม inline style ที่มีค่าดีไซน์ · ห้าม CSS-in-JS
3. state ที่ CSS แสดงได้ ให้ผ่าน `data-*` attribute (`data-state="open"`) ไม่ใช่ class ที่ generate ใน JS
4. โครง DOM + ARIA ต้องตรง spec เป๊ะทุก adapter (conformance test บังคับ)
5. ชื่อ prop/event ตรงกันข้าม adapter เท่าที่ภาษาอนุญาต

## เพิ่ม adapter ใหม่ = 1 wave
`/production-run port --to vue --wave W2` → reuse tokens/CSS/spec/test 100% เขียนเฉพาะ binding · เกณฑ์ผ่าน = conformance suite เดิมเขียว

## ทางที่พิจารณาแล้วไม่เลือก (บันทึกไว้กัน relitigate)
- **Web Components ฐานเดียว** — portable สุดจริง แต่ SSR/RSC เจ็บ, form participation ยุ่ง, shadow DOM ทำ theming ซับซ้อน → เป็น *adapter หนึ่งตัว* ได้ ไม่เป็นฐาน
- **Copy-paste registry** — upgrade ยาก: ไม่มีสายส่ง fix กลับ, drift 1,080 สำเนา, ไม่มี version ให้ query, QA gate/System Sheet โกหกทันทีเพราะ gate ต้นฉบับแต่ปลายทางกลายพันธุ์ → ใช้เฉพาะ system ที่ผู้ใช้น้อยรายและตั้งใจ fork
