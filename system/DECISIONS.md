# DECISIONS — long-term memory ของ system นี้
> เขียนผ่าน /lock-decision เท่านั้น · แก้ของเก่า = supersede + ประเมิน impact
## Format
### D-{nnn}: {หัวข้อ}
- **วันที่:** · **Phase:** 
- **เลือก:** / **เพราะ:** / **ตัวเลือกที่ตัดทิ้ง:** / **กระทบ:**
---

### D-001: Platform = web, light theme ก่อน
- **วันที่:** 2026-10-26 · **Phase:** 0
- **เลือก:** web (React + CSS Modules), light theme เท่านั้นใน pilot / **เพราะ:** pilot พิสูจน์ engine + glass evidence; dark ทำให้งานวัดผลเป็นสองเท่า / **ตัวเลือกที่ตัดทิ้ง:** light+dark พร้อมกัน / **กระทบ:** เพิ่ม dark = semantic tier ใหม่ทั้งชุด + รัน glass-evidence ซ้ำทุก backdrop
- PILOT DEFAULT — agent เลือก ยังไม่ผ่าน CONFIRM ของ user

### D-002: Lineage = Dessau curtain wall (Gropius, Bauhaus Dessau 1926)
- **วันที่:** 2026-10-26 · **Phase:** 0
- **เลือก:** กระจกเป็นแค่ "ไส้" โครงเหล็ก (mullion) คือสิ่งที่ทำให้ผนังอ่านออก — แปลเป็น: ความโปร่งแบกอารมณ์ได้ แต่ขอบเขตและข้อมูลทุกชิ้นต้องยืนบนโครงทึบ / **เพราะ:** glassmorphism ทั่วไปพังตรงที่ขอบและตัวอักษรขึ้นกับพื้นหลังที่เราคุมไม่ได้; lineage นี้ให้กฎโครงสร้างที่แก้ตรงจุดนั้น / **ตัวเลือกที่ตัดทิ้ง:** frosted lab glassware (ไม่มีกฎเรื่องขอบ), iOS-style vibrancy (เป็น UI ไม่ใช่ lineage นอก UI) / **กระทบ:** ทุก surface กระจกต้องมี double mullion (D-004); เปลี่ยน lineage = ออกแบบ border/focus ใหม่ทั้งหมด
- PILOT DEFAULT — agent เลือก ยังไม่ผ่าน CONFIRM ของ user

### D-003: Glass ต้องผ่านด้วยการวัด pixel จริง ไม่ใช่คำนวณจาก token
- **วันที่:** 2026-10-26 · **Phase:** 1
- **เลือก:** `tooling/glass-evidence.mjs` render ทุก glass surface บน 4 backdrop แย่สุด (ขาว, ดำ, ลายทางขาวดำ 8px, gradient อิ่มสี) แล้ววัดสีหลัง blur จริงใต้ตัวอักษรทุกตัว; text ≥4.5:1 ที่ pixel แย่ที่สุด (ไม่ใช่ค่าเฉลี่ย) / **เพราะ:** contrast ของกระจกขึ้นกับสิ่งที่อยู่ข้างหลัง สูตรจาก token อย่างเดียวคือการเดา / **ตัวเลือกที่ตัดทิ้ง:** ผสม alpha กับพื้นสมมติ (ไม่รวมผลของ blur/saturate), ค่าเฉลี่ย (ซ่อนจุดแย่) / **กระทบ:** เพิ่ม glass surface ใหม่ = ต้องเพิ่มใน evidence run; docs แสดงตัวเลขจากไฟล์ผลวัดเท่านั้น
- PILOT DEFAULT — agent เลือก ยังไม่ผ่าน CONFIRM ของ user

### D-004: Double mullion = ขอบสองเส้น ทึบ มืดนอก สว่างใน
- **วันที่:** 2026-10-26 · **Phase:** 1
- **เลือก:** ทุก glass surface และ focus ring มีเส้นทึบ 2 เส้น (steel ด้านนอก, ขาวด้านใน) — ทุกจุดบนขอบ อย่างน้อยหนึ่งเส้นต้อง ≥3:1 กับ backdrop ข้างๆ (วัดจริง) / **เพราะ:** เส้นมืดเส้นเดียวหายบนพื้นมืด เส้นสว่างหายบนพื้นสว่าง; คู่กันรอดทุก backdrop / **ตัวเลือกที่ตัดทิ้ง:** border alpha (ขึ้นกับพื้นหลัง), shadow (D-002 ไม่มีเงา) / **กระทบ:** focus ring ทุกตัวใช้คู่สีเดียวกัน
- PILOT DEFAULT — agent เลือก ยังไม่ผ่าน CONFIRM ของ user

### D-005: Fallback ทึบเมื่อกระจกใช้ไม่ได้หรือผู้ใช้ไม่ต้องการ
- **วันที่:** 2026-10-26 · **Phase:** 2
- **เลือก:** `prefers-reduced-transparency: reduce`, `@supports not (backdrop-filter)`, `forced-colors: active` → surface ทึบ paper; ทั้งสามโหมดต้องผ่าน evidence run ด้วย / **เพราะ:** กระจกเป็นอารมณ์ ไม่ใช่ข้อมูล — ถอดออกแล้วต้องใช้ได้ครบ / **ตัวเลือกที่ตัดทิ้ง:** เพิ่ม alpha อย่างเดียว / **กระทบ:** ทุก glass token ต้องมีคู่ fallback
- PILOT DEFAULT — agent เลือก ยังไม่ผ่าน CONFIRM ของ user

### D-006: Pilot scope = 5 components + docs หน้าเดียว ไม่มี Storybook
- **วันที่:** 2026-10-26 · **Phase:** 2
- **เลือก:** Button, Panel, TextField, Badge, Switch + `apps/docs` (Vite, หน้าเดียว) / **เพราะ:** user สั่ง "pilot พร้อม document page ไม่ต้อง storybook" / **ตัวเลือกที่ตัดทิ้ง:** catalog W1 เต็ม, Storybook / **กระทบ:** ขยายเกิน pilot = กลับไปทำ W1 ตาม catalog ตามลำดับ dependency

### D-007: ข้อความ error บนกระจกใช้ red.800 ไม่ใช่สีแดงของ action
- **วันที่:** 2026-10-26 · **Phase:** 2
- **เลือก:** semantic `text.danger` = `red.800 #7F1D15`; `field.error-fg` ชี้ไปที่นี่ / **เพราะ:** glass-evidence รอบแรกวัดได้ `red.600` บน panel ทับพื้นดำ = 3.31:1, ทับ bauhaus = 4.03:1 (ตก 4.5) — คำนวณย้อน: บนพื้นแย่สุด (กระจก 0.72 ทับดำ, L≈0.48) แดงต้องมี L ≤ 0.068; red.700 = 0.071 ยังไม่พอ / **ตัวเลือกที่ตัดทิ้ง:** ใช้ ink + ข้อความนำหน้า (เสียความหมายของสี), เพิ่ม alpha ของ panel (กระทบทุก surface) / **กระทบ:** สีแดงใหม่ใดๆ ที่วางบนกระจกต้องผ่าน evidence run; action.primary ยังใช้ได้เฉพาะเป็น fill ทึบ

### D-008: Anchor = A · Spatial (visionOS-style grey glass) — supersedes D-002, D-004
- **วันที่:** 2026-10-26 · **Phase:** 0
- **เลือก:** การ์ด A จาก anchor round (`apps/lab/anchor/`, refs `system/refs/ref-01-spatial-twitter.png`, `ref-02-visual-flow-card.png`): กระจกเทากลาง rgba(118,118,128,.32) blur 44 saturate 160%, ตัวอักษรขาว + รองขาวโปร่ง, radius 40, ไม่มีขอบแข็ง (specular rim gradient), แท็บแคปซูล selected = ฟ้า, CTA ขาวทึบ / **เพราะ:** user เลือกเองจาก 4 แบบที่เนื้อหาเดียวกัน; Pane เดิม (Bauhaus, double mullion) ผิดทิศทางที่ user ต้องการ / **ตัวเลือกที่ตัดทิ้ง:** B Milk frost, C Smoked, D Layered depth; D-002 Dessau lineage และ D-004 double mullion (supersede) / **กระทบ:** tokens/components/docs ของ Pane ต้องสร้างใหม่จาก A; D-003 (วัด pixel จริง) และ D-005 (fallback ทึบ) ยังใช้ต่อ; A ตามที่ render ยังไม่ผ่าน 4.5:1 (12–21/22 ข้อความบนพื้นต่างๆ) — ต้องจูนให้ผ่านโดยไม่เสียหน้าตา ก่อนเข้า Phase 2

### D-009: Anchor A ใช้ glass ปรับตาม environment (A1) — agent ตัดสิน
- **วันที่:** 2026-10-26 · **Phase:** 1
- **เลือก:** หน้าตา A (D-008) + กระจกเข้มตาม environment ที่แอปประกาศ: dim rgba(88,88,96,.5), mid rgba(64,64,72,.78), bright rgba(44,44,52,.82) (ค่าเริ่มต้น = bright, ปลอดภัยสุด); แท็บไม่เลือก = ไม่มีพื้น มีวงขอบ; แท็บเลือก/accent = #0071e3; ตัวรอง white .85 / **เพราะ:** anchor-sweep วัดแล้ว A ตามที่ render ผ่านไม่ได้ด้วย alpha อย่างเดียว (rgb 118 ทึบ 100% ยังได้แค่ ~4.6:1); A1 ผ่าน 22/22 ทุก backdrop และใกล้ A ที่สุดในฉากมืด — user สั่งให้ไม่ถามซ้ำ / **ตัวเลือกที่ตัดทิ้ง:** A0 ตามเดิม (ตก AA 8–21/22), A2 เข้มค่าเดียว (เสียความโปร่งในฉากมืด) / **กระทบ:** ทุก glass surface อ่านค่าผ่าน environment token; ค่า mid/bright ต้องเผื่อจุดสว่างสุดของฉาก ไม่ใช่ค่าเฉลี่ย; กลับไป A0 = เปลี่ยน token สามตัว + บันทึก exception
