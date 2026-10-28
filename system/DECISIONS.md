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

### D-014: Grid system + token library เต็มรูป + Badge/Chip/Banner + แพ็กเกจพร้อมลงโปรเจคอื่น
- **วันที่:** 2026-10-26 · **Phase:** 3
- **เลือก:** spacing scale 4px-base (space.0…32, ค่าเดิมคงที่); layout 4/8/12 columns, gutter 16/24/32, margin 16/32/48 ที่ breakpoint md 768 / lg 1024 ผ่าน `$extensions["pane.breakpoint"]` — build สร้าง @media + กฎ span ของ GridItem เอง; dimensions: breakpoint, container sm–2xl, touch 44, z-layer; สถานะ positive #13803C (5.02:1) / warning #F5B000 + ink (9.90:1) / critical #C42B1C (5.66:1) / info = accent; components Container, Grid/GridItem, Stack, Badge, Chip, Banner; pane-tokens ส่ง css/json/js+d.ts/scss, pane-react ส่ง ESM+CJS+d.ts+styles.css; `pnpm run release:pack` ทำ tarball / **เพราะ:** user: "เพิ่ม grid system, spacing, dimension… token library… จะเอาไปให้อีกโปรเจคใช้ ต้องลงง่ายๆ… badge chip banner ให้ครบ" / **ตัวเลือกที่ตัดทิ้ง:** publish ขึ้น npm (เป็นการตัดสินใจของ user ตามกฎ credentials), breakpoint พิมพ์ซ้ำใน CSS ของ component, Style Dictionary (build เองเพื่อบังคับ tier + collision) / **กระทบ:** smoke-import ติดตั้ง tarball จริงในโปรเจคว่างทุก verify; breakpoint ใหม่ = แก้ primitive ที่เดียว; สถานะสีใหม่ต้องคำนวณคู่สีก่อน + วัดบนกระจก

### D-015: ธีม light/dark ที่วัดทั้งคู่ + playground ทุกหน้า foundation + หน้าระดับ reference (status, history, a11y matrix)
- **วันที่:** 2026-10-26 · **Phase:** 2–6
- **เลือก:** dark = `$value` เดิม; light ผ่าน `$extensions["pane.theme"].light` บน 16 token (surface, text, line, focus, glass.brightness 1.12, elevation) ส่งออกเป็น `@scope ([data-theme])` ให้ theme ที่ใกล้ที่สุดชนะ และไม่มี attribute = ตาม `prefers-color-scheme`; `surface.light` แปลว่า "solid ที่ดังที่สุด" (ขาวใน dark, ink ใน light); glass-evidence วัดทุกฉาก × ทั้งสองธีม; foundation ทุกหน้ามี playground; ทุก component page มีตาราง 2×2 (ธีม × ฉากมืด/สว่าง), usage snippet, status (Alpha/Beta/Stable มีเกณฑ์), change history จาก `packages/react/CHANGELOG.md`, Limitations, a11y แบ่ง ได้อะไร/ต้องทำเอง/ทดสอบยังไง; หน้า reference: status matrix, changelog / **เพราะ:** user: "foundations ไม่มี demo ให้เล่น… copy code ยาก… ไม่บอกว่าวางบนพื้นสว่างกับมืดต่างกันยังไง ไม่มี light / dark" + "ไปดู design system 10 เจ้าดัง… ทำให้ได้แบบนั้น" (Carbon a11y status, Primer a11y tab, Atlassian/Primer lifecycle, HIG/GOV.UK change log, Polaris/MUI limitations) / **ตัวเลือกที่ตัดทิ้ง:** class-based theme ที่ไม่ซ้อนได้, theme แค่สลับสีตัวอักษรโดยไม่วัด, ใส่ Stable ทั้งที่ยังไม่มี screen reader pass, sandbox/Figma ตอนนี้ (ต้อง publish หรือมีไฟล์ Figma ก่อน, อยู่ใน BACKLOG) / **กระทบ:** semantic สีใหม่ต้องมีค่าของทั้งสองธีมหรือตั้งใจไม่มี; verify ช้าลงเกือบเท่าตัว; component ใหม่ต้องมี entry ใน CHANGELOG ไม่งั้น G-L1 แดง

### D-016: docs chrome เป็น layout ปกติทึบ, glass อยู่เฉพาะบน demo stage
- **วันที่:** 2026-10-27 · **Phase:** 6
- **เลือก:** shell ของหนังสือเป็นแบบ Carbon/MUI: top bar (theme แบบ segmented + "Demo backdrop"), side nav ทึบ, เนื้อหาไม่มีกล่อง คั่นด้วยเส้นบาง, on-this-page ด้านขวา; พื้นใช้ token ใหม่ `surface.page/raised/sunken` (ทึบ ทั้งสองธีม); รูปฉากและกระจกอยู่เฉพาะใน demo stage (`Stage` ใน kit: ตัวอย่าง, playground, hero, ตาราง backdrop) / **เพราะ:** user: "ไม่ชอบ layout แบบ glass เลย ของเว็บอื่นๆก็เป็น layout ปกติ มันค่อยไปโชว์ใน foundation, component, pattern" + ก่อนหน้า "typo มองยาก โหลดช้า ไม่ smooth" — กระจกเต็มหน้าทำให้ตัวอักษรต้องมี halo, เบลอทั้ง viewport ทุก scroll และรูปเต็มจอต้องโหลดก่อนอ่านได้ / **ตัวเลือกที่ตัดทิ้ง:** shell กระจก (D-012 ถึง D-015 ใช้อยู่), กระจกเฉพาะ nav / **กระทบ:** ตัวเลข contrast ของหน้า docs ต้องวัดใหม่ (ตัวอักษรอยู่บนพื้นทึบแล้ว ส่วน demo ยังวัดบนรูป); kiln บังคับด้วย G-SH1 + standard #15

### D-017: Select และ Slider เป็น component ของ Pane และหน้า docs ใช้ component ของระบบเท่านั้น
- **วันที่:** 2026-10-27 · **Phase:** 3
- **เลือก:** `Select` (Radix Select: listbox popup ทึบจาก token, typeahead, check mark, ธีมตามตำแหน่งที่วาง) และ `Slider` (Radix Slider: label + ค่า, hit area 44px, knob ขาว `surface.knob`) อยู่ใน pane-react 0.2.0; ทุก control ในหน้า docs (playground, top bar, token filter) ใช้สองตัวนี้ ลบ CSS select/slider เฉพาะ docs ทิ้ง / **เพราะ:** user: "dropdown flyout ก็ไม่ทำ ไปเอาของระบบมาเฉย" + "slider นี้คือส่วนนึงของ design system หรือยังไง" — native select เปิดเมนูของ OS ที่แต่งไม่ได้ และ slider เดิมเป็น CSS ของ docs ไม่ใช่ของระบบ / **ตัวเลือกที่ตัดทิ้ง:** แต่ง native select ต่อ (popup แต่งไม่ได้), เขียน listbox เอง (กฎ stack: ยืม behaviour จาก Radix) / **กระทบ:** kiln G-N1 แดงทันทีถ้ามี native select ที่มองเห็นหรือ control ที่ไม่ได้มาจาก `[data-component]`; Select/Slider ต้องมีหน้า component ตามมาตรฐาน Carbon เหมือนตัวอื่น (ยังไม่มี)

### D-018: Banner เป็นบรรทัดบนแผ่นกระจก (derivation C) — ผ่านรอบ derivation แรกของ kiln
- **วันที่:** 2026-10-27 · **Phase:** 3
- **เลือก:** Banner ไม่มีพื้น ไม่มีกล่อง ไม่มีแถบสี ไม่มีวงกลมสี: glyph 18px รูปต่างกันต่อ tone (วงกลม, ถูก, สามเหลี่ยม, แปดเหลี่ยม) สีเฉพาะ glyph (`status.*-mark` สว่างบนกระจกเข้ม เข้มบนกระจกสว่าง), title semibold, detail secondary, action/dismiss ท้ายบรรทัด, เส้นบางคั่นจากเนื้อหา; เข้า/ออกด้วยการเปิด-ปิดความสูงของตัวเอง (onDismiss หลังปิดเสร็จ) / **เพราะ:** user เลือก C จาก apps/lab/banner (A ornament, B stacked sheet, C line) และขอครบทั้งชุด; derivation: P3 depth (แผ่นเดียวคือชั้นเดียว), P1 colour (ฉากเป็นเจ้าของสี), P6 colour (สถานะต้องพูดเป็นคำ), P5 space, P4 space (ระยะเคลื่อนเล็ก layout ไม่กระโดด) / **ตัวเลือกที่ตัดทิ้ง:** แบบเดิม (inline notification ของ Carbon/Material), A ornament, B stacked sheet / **กระทบ:** banner token ชุดเก่า (bar, icon-size, surface, *-accent) ถูกแทน; ออกจาก rationale.pendingDerivation; G-X1 ผ่าน; ข้อความที่ต้องขัดทุกแผ่นพร้อมกันยังไม่มีที่อยู่ (limitations)

### D-019: Field backdrop สำหรับ demo ที่ไม่ต้องมีรูปฉาก
- **วันที่:** 2026-10-27 · **Phase:** 6
- **เลือก:** `field.*` token (base, glow, glow-soft, line, line-major) เปลี่ยนตามธีม: พื้นทึบ + แสงฟ้าจางมุมบนซ้าย + แสงขาวจางมุมล่างขวา + เส้นก่อสร้างบนกริด 4px (เส้นรองทุก 8px, เส้นหลักทุก 32px); `Stage backdrop="field"` สำหรับ diagram และ demo โครงสร้าง; "Field (no photo)" อยู่ใน Demo backdrop ด้วย / **เพราะ:** user: "บางบริบทมันไม่ต้องมี background ภาพ … ทำให้เป็น background gradient ที่รองรับ theme … grid บางๆ แนว tech ล้ำๆ แต่ไม่เด่น"; P1 (สีเดียวที่ field มีได้คือฟ้า accent จางๆ) + P3 (เส้นก่อสร้างบอกกริดที่แผ่นวางอยู่) / **ตัวเลือกที่ตัดทิ้ง:** รูปฉากในทุก demo, พื้นเรียบไม่มีอะไรให้กระจกเบลอ / **กระทบ:** diagram ในหน้า Grid ใช้ field เสมอ; contrast บน field วัดแล้ว 714/714 ทั้งสองธีม

### D-020: ภาษาของ form ทั้งชุด W3 เป็น "บ่อบนแผ่นกระจก" (derivation A)
- **วันที่:** 2026-10-27 · **Phase:** 3
- **เลือก:** field เป็นบ่อที่หรี่ลงในกระจก (`surface.well` + เงาด้านในบาง + ring จาง) ทรง pill เต็ม (textarea ใช้มุมซ้อนเพราะสูงขึ้นได้); checkbox / radio / switch เป็นบ่อเล็ก, เลือกแล้วมีเครื่องหมาย (ถูก, จุด, ขีดบนราง) ไม่ใช่สีอย่างเดียว; สีฟ้าของระบบใช้ที่รางของ switch ตอนเปิดเท่านั้น; บนหน้าทึบ (P7) บ่อกลายเป็น `surface.sunken` + เส้นบาง; error = glyph แปดเหลี่ยม + คำว่า Error ให้ screen reader + เส้นขอบ 2px สี critical-mark; focus = ring กลาง 2px + halo; behaviour ของ Checkbox, RadioGroup, Switch มาจาก Radix, Input/Textarea เป็น native; FormField ผูก label, help, error เข้ากับ control (`aria-describedby`, `aria-invalid`) / **เพราะ:** user เลือก A จาก apps/lab/forms (A well, B written, C held); derivation: P1 depth (อ่านได้เพราะหรี่ ไม่ใช่เพราะสีทึบ), P1 colour (ฟ้าใช้ที่เดียว), P3 shape (control เป็น pill เพราะถูกจับ), P6 shape + space (เลือกแล้วมีเครื่องหมาย, hit area 44px), P2 interaction (focus ring มี halo), P7 shape (หน้าอ่านใช้พื้นธรรมดา), P4 motion (เครื่องหมายเข้ามาแล้วนิ่ง 420–520ms, กด 200ms) / **ตัวเลือกที่ตัดทิ้ง:** 0 นิสัย (Material outlined + floating label, checkbox ฟ้าทึบ, switch เขียว iOS), B เขียนบนแผ่น (เส้นใต้อย่างเดียว ดูไม่ออกว่าเป็นช่อง), C วัตถุที่ถือ (บนกระจกสว่าง radio/field แทบหาย) / **กระทบ:** ทั้ง 11 ตัวของ W3 (Input, Textarea, Checkbox, Radio, Switch, Label, FormField, HelperText, Fieldset, InputGroup, PinInput) ใช้ภาษานี้; token ชุด `input.*`, `check.*`, `switch.*` ใหม่; ถ้าเปลี่ยนใจต้องทำ lab ใหม่และ regenerate why.json ทั้ง 5 ตัวที่มีรูปทรงของตัวเอง; หน้า pattern Forms และ Search ต้องเขียนใหม่ด้วย control จริง

### D-021: แอปเลือกพื้นทึบเองได้ (`<Environment material="solid">`)
- **วันที่:** 2026-10-28 · **Phase:** 5
- **เลือก:** prop `material` บน Environment (`glass` ค่าเริ่มต้น / `solid`) ใช้ค่า fallback ชุดเดียวกับ D-005 และปิด backdrop-filter ทั้งหมดใต้ Environment นั้น / **เพราะ:** แอปที่ฉากหลังวาดใหม่ทุกเฟรม (ฉาก 3D ของ Brick Forge) ต้องเลี่ยงการเบลอซ้ำทุกเฟรม ซึ่งเดิมทำได้เฉพาะเมื่อผู้ใช้เปิด reduced transparency ในระบบ / **ตัวเลือกที่ตัดทิ้ง:** prop บนทุก Card (กระจายเกินไป), blur ลดลงแทนการปิด (ยังมีงาน compositor) / **กระทบ:** tokens.css ได้ block `[data-material='solid']` ใหม่, Environment ได้ prop ใหม่, contrast ใช้ fallback ที่วัดไว้แล้ว

### D-022: รอบ derivation ที่ 2: Button, Switch, ช่องกรอก และ flyout ของ Select (หลัง R-007 ถึง R-010)
- **วันที่:** 2026-10-28 · **Phase:** 5 · **เลือกโดย:** agent (`autonomy.picks: "agent"`, รายละเอียดใน `system/REVIEW.md`)
- **เลือก:** Button = B "แผ่นกระจกสีขนาดเล็ก" (sheet มี gloss ด้านบน เงาที่ฐาน rim แบบเดียวกับ pane, glint ตาม pointer, เงาสีฟ้าใต้ accent); Switch = A "บ่อที่แกะลงในกระจก + ลูกปัดมีแสง"; Input และทั้งครอบครัว = B "ร่องที่ขอบล่างรับแสง" ขอบ ≥3:1 ทุก theme ทุกพื้น; Select = B "rows ซ้อนมุม + lens" (radius ของ row = radius ของ sheet − inset ที่เท่ากันทุกด้าน, สูง 44px, check นำหน้า) / **เพราะ:** user: "toggle แม่งธรรมดามาก", "เห็นความไม่สมมาตรของ hover กับกรอบ flyout มั้ย", "search bar แม่งกลืนไปกับ bg", "ปุ่มสีฟ้า… ไม่มีศิลป์" / **ตัวเลือกที่ตัดทิ้ง:** Button A (ไม่มี rim, ไม่ตอบ pointer) และ C (กระจกสี ผิด P5, ตัวอักษร 2.6:1); Switch B (glow ไม่มีหลักการรองรับ, 2.7:1) และ C; Input A (กรอบรอบกล่อง) และ C (outlined field ทั่วไป); Select A และ C / **กระทบ:** D-020 ยังอยู่ (ภาษาบ่อ) แต่ชัดขึ้น; gate ใหม่ G-NT2 (ขอบ control 3:1 วัดจาก pixel จริงบนกระจก) และ G-NR1 (มุมซ้อน) ผ่าน; lab: `apps/lab/round2/index.html`

### D-023: รอบ derivation ที่ 3: แปดตัวที่สร้างก่อนมี derivation (supersedes ส่วนของ D-009 เรื่องแท็บที่ไม่เลือก)
- **วันที่:** 2026-10-28 · **Phase:** 5 · **เลือกโดย:** agent (`system/REVIEW.md` Round 3) ยกเว้น Card ที่ user เลือกไว้แล้วใน anchor round (D-008)
- **เลือก:** IconButton = A pane กลมเล็ก (วัสดุเดียวกับ Button B); Tabs = A รางที่แกะลงในกระจก แท็บที่เลือกเป็นแผ่นฟ้า accent ที่เลื่อนไปหาแท็บที่เลือก (ยังเป็นสีฟ้าตาม D-009) แท็บที่ไม่เลือกเป็นตัวอักษร ไม่มี ring; Chip = C ปกติเป็น pane เล็ก เลือกแล้วยุบลงในกระจกพร้อมเครื่องหมายถูก; Tag = B สลักลงในกระจก; Badge = A glyph กับคำ ไม่มีพื้น (ภาษาเดียวกับ Banner D-018); Avatar = A รูปหลังเลนส์ ไม่มี ring ขาว; Slider = A รางแกะเติมฟ้าถึงค่า กับลูกปัดแบบ Switch / **เพราะ:** user ต้องการให้ทุก component ผ่าน concept funnel ("ไม่ผ่าน concept funnel หรอวะ") และ release ถูกบล็อกจนกว่า pendingDerivation จะว่าง / **ตัวเลือกที่ตัดทิ้ง:** ดูตารางใน REVIEW; Chip A/B ทำให้ chip ที่เลือกเป็น loud solid หลายอันบน pane เดียว (ผิด P5); ring ของแท็บที่ไม่เลือกใน D-009 อ่านเป็นแถวปุ่ม / **กระทบ:** `pendingDerivation` ว่าง; press area 44px บน Button, IconButton, Chip, Tabs, Select และ Slider; Input `sm` เป็นข้อยกเว้น E-002; lab: `apps/lab/round3/index.html`
