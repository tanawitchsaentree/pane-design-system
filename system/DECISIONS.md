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

### D-010: กระจกใส = หรี่ฉากหลัง (brightness) แทนการทับสีเทา + ฉากเป็นรูปถ่ายจริง — supersedes ค่าสีของ D-009
- **วันที่:** 2026-10-26 · **Phase:** 2
- **เลือก:** `surface.glass` = white .06 (เกือบใส) + sheen บาง; ความอ่านออกมาจาก `backdrop-filter: blur(40px) saturate(1.8) brightness(env)` — brightness ต่อ environment วัดจากรูปจริงด้วย `tooling/glass-sweep.mjs`: dim 0.5 (Room), mid 0.45 (Forest), bright 0.4 (Night café ที่มีหน้าต่างสว่าง, City); ฉาก docs/harness = รูป Unsplash 4 รูป (`apps/docs/public/scenes/CREDITS.md`) / **เพราะ:** user: "เทามาเลย ไม่เบลอ ไม่ใส" — tint เทา .78–.82 ของ D-009 ล้างสีฉากจนเป็นแผ่นเทา และฉาก gradient ไม่มีรายละเอียดให้ blur; brightness หรี่โดยเก็บสี+รายละเอียดไว้ / **ตัวเลือกที่ตัดทิ้ง:** tint เทาของ D-009, ฉาก gradient สังเคราะห์, ยอมตก AA บนรูปสว่าง / **กระทบ:** ทุก glass ใช้ brightness token; รูปใหม่ต้องรัน glass-sweep ก่อนผูก environment; ชื่อ dim/mid/bright หมายถึง "จุดสว่างสุดของฉาก" ไม่ใช่บรรยากาศ (Night café = bright)

### D-011: ค่า brightness วัดใหม่ทั้งหน้า → 0.36 ทุกรูป, dim/mid ยังไม่ calibrate
- **วันที่:** 2026-10-26 · **Phase:** 2
- **เลือก:** brightness.bright = 0.36; dim/mid ตั้งเท่า bright และติด UNCALIBRATED; ทั้ง 4 ฉากใช้ environment bright / **เพราะ:** glass-sweep รอบสอง (harness + หน้า docs เลื่อนทั้งหน้า) — ฉากติดกับ viewport การ์ดจึงผ่านทุกส่วนของรูปตอนเลื่อน; รอบแรกวัดแค่ harness ได้ 0.4–0.5 แล้วหน้า docs ตก 67/878 บน Room / **ตัวเลือกที่ตัดทิ้ง:** ค่า 0.4–0.5 จากรอบแรก (วัดไม่ครบพื้นที่), เดาค่า dim/mid โดยไม่มีรูปมืดจริง / **กระทบ:** environment ยังเป็นกลไกที่ใช้ได้ แต่จะมีผลจริงเมื่อมีรูปมืดที่วัดแล้ว; เพิ่มรูปใหม่ต้องรัน glass-sweep

### D-012: กระจกบางลง (brightness 0.46, blur 64, halo) + motion นุ่ม + docs เป็นหนังสือตาม docs-engine
- **วันที่:** 2026-10-26 · **Phase:** 2
- **เลือก:** brightness.bright 0.46 + blur 64px + text halo (`elevation.halo`, นับตาม WCAG 1.4.3 text-with-halo) + เกณฑ์ large text 3:1 ต่อ node; ส่วนที่เหลือ 3.8–4.5:1 = E-001. Motion: duration 200/420/640ms, easing.soft cubic-bezier(0.22,1,0.36,1), rise 16px, lift 2px, press 0.97; reduced motion = 0 ที่ระดับ token. Docs = หนังสือ 26 บท ตาม `docs-engine/references/content-model.md` (props/demo floor/bundle จาก `tooling/docs-meta.mjs`) / **เพราะ:** user: "กระจกทึบไป ต้องบางกว่านี้ / motion จังหวะนุ่ม ไม่รวดเร็ว / doc ต้องเหมือนหนังสือแน่นๆ"; glass-sweep วัดแล้ว 0.38 คือค่าใสสุดที่ผ่านครบ — 0.46 แลกกับ exception ที่วัดและจำกัดขอบเขตไว้ / **ตัวเลือกที่ตัดทิ้ง:** 0.36–0.38 (ทึบ), 0.5+ (ตก <3.8:1 บนรูป City), motion เร็วแบบ UI ทั่วไป (150–200ms), docs หน้าเดียว / **กระทบ:** E-001 เปิดอยู่จนกว่าจะมี environment ที่ sample รูปจริง; ทุก component ใหม่ต้องมี demo ≥ floor และ JSDoc ครบ (conformance บังคับ)

### D-013: brightness 0.46 → 0.42 และ secondary text .85 → .92 — วัดทั้งเล่ม (supersedes ค่าใน D-012)
- **วันที่:** 2026-10-26 · **Phase:** 2
- **เลือก:** brightness ทุกระดับ 0.42; `text.secondary` = white .92 / **เพราะ:** วัดหนังสือ 26 หน้าบน 4 รูปแล้ว 0.46 ทิ้ง 65 node บนรูป City ต่ำกว่า floor 3.8 ของ E-001; .92 กู้ตัวรองได้โดยไม่ต้องทำกระจกให้ทึบ; 0.42 คือค่าใสที่สุดที่ไม่มี node ไหนต่ำกว่า 3.8 / **ตัวเลือกที่ตัดทิ้ง:** 0.44 (เหลือ 6 node ที่ 3.56–3.79), ลด floor ของ E-001 (ขยายขอบเขต exception — ห้าม) / **กระทบ:** E-001 อัปเดตเป็น 73/34,482 node; เพิ่มหน้า docs = ต้องวัดใหม่ เพราะ floor ผูกกับพื้นที่ข้อความทั้งเล่ม
