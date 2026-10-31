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

### D-024: แสงเดียวจากด้านบน ไม่มีสีฟ้า (supersedes สีฟ้าใน D-008/D-009 และใน P1/P5)
- **วันที่:** 2026-10-29 · **Phase:** 5 · **เลือกโดย:** agent ตาม reference ที่ user ส่งมา (`apps/lab/round4/`, REVIEW Round 4)
- **เลือก:** A "one light from above": ทุก surface, control และ track มี rim สว่างที่สุดตามขอบบน sheen ครึ่งบน และเงาสั้นด้านล่าง ส่วน recess กลับด้านกัน; ปุ่มหลักคือสีทึบขาว (ink ในธีม light) และ accent คือสีทึบเดียวกันที่เรืองแสงของตัวเอง; ของที่ถูกเลือกเป็นแผ่นกระจกที่สว่างกว่า; switch ที่เปิดเป็นรางที่สว่างจากข้างใน; slider เติมด้วยสีทึบ; ระบบไม่มี hue ของตัวเอง สีใช้เฉพาะบอกสถานะหรือใน diagram / **เพราะ:** user: "accent สีฟ้า?? คือเหี้ยอะไรวะ", "toggle เหี้ยไรของมึง", "มึงดูเขาวางขอบเงาเหมือนมีแสงตกด้านบน ทุก element ย่อยๆสวยมากๆ … มันคือความ craft ระดับ atom" / **ตัวเลือกที่ตัดทิ้ง:** B ของที่เลือกเป็นหลุม (อ่านเป็นปิดมากกว่าเลือก), C ขอบรุ้ง (เป็น hue ที่ระบบไม่มีแล้ว) / **กระทบ:** P1, P3 depth, P5 colour เขียนใหม่ใน CONCEPT; `action.accent` ชี้ไปที่ loud solid; Tabs, Switch, Slider, Chip, Button, IconButton, Card ใช้ rim ทิศบน; Brick Forge อัปเดตเป็น 0.5.0

### D-025: กระจกควันหนาพร้อมเส้นแสงที่ขอบบน และระดับความลึก 4 ชั้น (round 5)
- **วันที่:** 2026-10-29 · **Phase:** 5 · **เลือกโดย:** agent ตาม reference ที่ user ส่ง ("แบบนี้ดูเป็น glass กว่าเยอะ", "ดูเอาซะ แล้วเตรียมแก้เลย") lab `apps/lab/round5/`
- **เลือก:** pane เป็นแผ่นกระจกควันหนา (body 78%) มีขอบบางรอบชิ้น เงาที่ฐาน และเส้นแสงสั้นตรงกลางขอบบน; ปุ่มหลักเป็นสีขาวอุ่นมี bloom; ปุ่มรองเป็นแผ่นกระจก; ตัวที่เลือกเป็นกระจกเทา; IconButton มี `loud` (ลูกปัดขาว); thumb ของ Slider เป็นแคปซูล; ระดับ 1–4 (pane, ของซ้อนใน pane, overlay, popover) ห่างกันอย่างน้อย 1.15:1 วัดจาก pixel และ scrim หรี่ฉากเหลือ ≤60% (gate G-EL1); Card ที่ซ้อนอยู่ใน Card เป็นระดับ 2 เองและใช้มุม inner / **เพราะ:** user: "พอใช้จริงดูเรื่อง modal หรือพวก กระจกซ้อนกันด้วย ให้มีระดับที่มองเห็นได้ง่ายไม่ใช่ ใส จางแม่งหมด … หาสูตรคำนวน ตรวจด้วยตา" / **กระทบ:** P1 depth เขียนใหม่ (smoked body แทน "never from an opaque tint"); Card ได้ prop `level`

### D-026: Slider มี variant `fill` (แถบที่จับได้ทั้งแท่ง)
- **วันที่:** 2026-10-29 · **Phase:** 5 · **เลือกโดย:** agent ตาม reference ที่ user ส่ง ("ถ้าโอเคเอาไปเลย")
- **เลือก:** `<Slider variant="fill">` แถบสูง 56px ทรง pill ทั้งแท่งเป็นพื้นที่กด ชื่อกับค่าอยู่ข้างในที่ระยะ inset ของ field ส่วนว่างเป็นหลุมลึกแบบ track ของ Tabs ส่วนที่เติมเป็นกระจกเลือก (chosen glass) มีแสงที่ขอบบน และมีเส้นบาง 4px สี loud solid อยู่ในปลายส่วนที่เติม 12px เพื่อบอกจุดที่ค่าหยุด
- **ทำไมเป็น variant ไม่ใช่ component ใหม่:** พฤติกรรม, role, props, keyboard เหมือน Slider ทุกอย่าง (Radix ตัวเดียวกัน) ต่างแค่ anatomy กับที่ใช้ แยกเป็น component จะทำให้มี API ซ้ำสองชุด
- **ที่ใช้:** quick settings ที่ซ้อนกันใน panel เช่น ความสว่าง เสียง ตั้งเวลา บ้านอัจฉริยะ ตัวเล่นสื่อแบบ control center; `channel` ยังเป็นค่าเริ่มต้นสำหรับฟอร์มและ player
- **ไม่เลือก:** B ค่าอย่างเดียวไม่มีเส้นบอกตำแหน่ง (ขอบของส่วนที่เติมนุ่มเกินจะอ่านค่า), C มีขีดแบ่งขั้น (เหมาะกับค่าเป็นขั้นเท่านั้น) — ไม่ได้ render เป็น lab แยก เพราะ user ส่ง reference มาเองและสั่งให้ทำ
- **ตรวจ:** G-TT1 (marker มี press area 44px), G-IN1, G-RH1, G-K2/K3 (มี deep dive ของทั้งสอง variant), evidence ข้อความ 0 fail บนหน้า slider ทุก scene, คีย์บอร์ด/คลิก/ลาก ทดสอบด้วย playwright

### D-027: แสงเรือง (glow) ใน dark mode มีนิยาม ไม่ใช่ทุกสีขาว
- **วันที่:** 2026-10-29 · **Phase:** 5 · **เลือกโดย:** agent ตาม reference ที่ user ส่ง ("ส่วนที่เป็นสีขาวจะเรืองแสง ... แต่ไม่ใช่ทุกขาว ต้องหาทางนิยาม")
- **เลือก:** สามระดับ: `glow.strong` = action ที่ถูกโปรโมต (Button accent, IconButton loud), `glow.soft` = สิ่งที่เปิดอยู่หรือเป็นปริมาณ (Switch on, ช่องที่เติมของ Slider), `glow.mark` = จุดที่บอก "ตอนนี้" (marker ของ fill slider, วันปัจจุบัน) ไม่เรือง = ข้อความ ไอคอน ขอบ กระจกที่ถูกเลือก ของที่จับ (bead, knob) avatar สีสถานะ และ disabled; ใน light ไม่มีอะไรเรือง
- **ค่า:** วัดจาก pixel แบบเปิด glow เทียบปิด glow ที่วงแหวน 2–6px นอกขอบ: strong ≥1.25:1 (วัดได้ 1.49–1.54), soft ≥1.15 (1.23–1.34), mark ≥1.15 (1.21) และที่ 32px ต้องกลับเป็นพื้นเดิม (≤1.03:1); แสงอยู่ตรงกลาง ไม่มี offset
- **เปลี่ยนจากเดิม:** bloom เดิมมีเงาดำและ offset ลงล่างจนวัดได้แค่ 1.18–1.20 จึงเพิ่มแสงตรงกลาง; Switch on-glow เดิม 1.12 ปรับให้เท่า glow.soft; ช่องของ Slider เดิมไม่เรืองและ track ตัดแสงทิ้ง (overflow hidden) ตอนนี้เรือง soft
- **ตรวจ:** G-GL1 (kiln) ตรวจว่ามีแค่ส่วนที่ประกาศ `data-glow` เท่านั้นที่เรืองใน dark, ข้อความไม่เรือง, light ไม่มีอะไรเรือง, และวัดค่าตามข้างบน

### D-028: พื้น studio ใน dark เข้มขึ้นเป็น #050506
- **วันที่:** 2026-10-29 · **เลือกโดย:** agent (user: "ตัดสินไม่ได้")
- **ปัญหา:** pane ระดับ 1 บน studio เดิม (#111214) ต่างจากพื้นแค่ 1.09:1 ต่ำกว่าเกณฑ์ 1.15 ของ G-EL1
- **ทางเลือก:** ทำ pane ให้สว่างขึ้น (กระทบวัสดุที่ user อนุมัติใน round 5 ทุกฉาก) หรือทำพื้น studio ให้เข้มขึ้น (กระทบแค่ฉากโชว์ของ docs) — เลือกพื้น เพราะ studio เป็นแค่ฉากนำเสนอ ส่วน pane คือระบบ
- **วัด:** #0A0A0C ได้ 1.13, #050506 ผ่าน; demo ระดับความลึกกลับมาอยู่บน studio เหมือน demo อื่น; G-GL1 ยังผ่าน (strong 1.49–1.55, soft 1.22–1.33, mark 1.21)

### D-029: mesh gradient (Aurora) เป็น scene และ media เท่านั้น
- **วันที่:** 2026-10-29 · **เลือกโดย:** agent ตาม reference ("ไม่ใช่ linear หรือ radial ถ้าทำได้ทำ แล้วหาหมวดหมู่")
- **หมวด:** mesh gradient (freeform gradient; SwiftUI MeshGradient, Figma mesh fill) + ambient shadow (เงาสีเดียวกับวัตถุ)
- **ทำอย่างไร:** radial 4 วง (mesh.a–d) บนพื้น mesh.base วาดบน layer ที่ใหญ่กว่ากล่อง แล้ว blur ด้วย mesh-blur 40px ให้ขอบแต่ละวงละลายเข้าหากัน
- **ใช้ได้:** scene หลังกระจก (Demo backdrop: Aurora), media (cover, icon, illustration), ambient shadow ใต้วัตถุ mesh — **ใช้ไม่ได้:** fill ของ control (Button, Switch, tab) และข้อความ ตาม P1 (ระบบไม่มี hue ของตัวเอง)
- **ตรวจ:** Aurora อยู่ในรายการ scene ของ evidence แล้ว; ข้อความบนหน้า slider usage และ color ผ่าน 10,680/10,680 ทุก scene

### D-030: Mesh เป็น component ที่ ship ได้ มี preset และ CLI
- **วันที่:** 2026-10-29 · **เลือกโดย:** agent (user: "upgrade ซะ มีตัวที่ติดตั้งไปแล้ว")
- **ตัดสิน:** `<Mesh preset>` มี preset aurora, ember, tide, dusk; product ที่ติดตั้งแล้วทำสีของตัวเองได้ด้วย CLI `pane-mesh` ซึ่งสร้างชุด token mesh ใหม่จากสีที่ให้ไป ส่วนกฎการใช้ยังเป็นไปตาม D-029 คือใช้ได้แค่ scene และ media
- **ออกเป็น:** 0.6.0 (release/UPGRADE-0.6.0.md บอกขั้นตอนอัปเกรดให้ตัวที่ติดตั้งไปแล้ว)

### D-031: สีข้อมูลของ chart เป็น content ไม่ใช่ interface
- **วันที่:** 2026-10-29 · **เลือกโดย:** agent (wave 9 Charts; ตามกฎ "ถามตอนต้นแล้วตัดสินเอง" user review ตอนจบ milestone)
- **ปัญหา:** P1 บอกว่าระบบไม่มี hue ของตัวเอง แต่ chart ที่มีหลาย series ต้องใช้ hue บอก identity ถ้าใช้แค่ขาว/เทาจะแยกเกิน 2 series ไม่ได้
- **ตัดสิน:** hue ของ chart เป็นของ content แบบเดียวกับ scene, mesh และ swatch ของ ColorPicker ใช้ได้เฉพาะ mark (bar, line, dot, cell) ส่วนข้อความ legend, label, tick และ tooltip ใช้ text tone เสมอ และ control รอบ chart ยังไม่มี hue
- **ค่า:** categorical 8 ช่องตามลำดับของ dataviz reference palette, dark/light แยก step (`color.data.*` → `data.series-1..8` → `viz.series-*`); sequential ใช้ hue ช่อง 1 จางไปเข้ม
- **วัด:** validate_palette ผ่านทุก hard gate บน surface ของ Pane (light #f2f2f4, dark #1c1d21): CVD ΔE ต่ำสุด 9.1 / 8.4, normal ΔE 19.6 / 19.3; light มี 4 ช่องต่ำกว่า 3:1 จึงต้องมี legend, direct label และ table view ทุก chart (ChartFrame บังคับ)

### D-032: ระดับที่เรียงลำดับ (เช่นความมั่นใจ) ใช้ sequential ramp สีเดียว
- **วันที่:** 2026-10-30 · **เลือกโดย:** agent (X11, ConfidenceChip; มาจาก feedback ของ PEG เรื่องสี evidence confidence)
- **ปัญหา:** ความมั่นใจเป็นขนาด (มากน้อย) ไม่ใช่ identity ถ้าใช้แดง/เหลือง/เขียวจะอ่านเป็นผ่าน/ไม่ผ่าน และคนตาบอดสีแดงเขียวแยกไม่ได้
- **ตัดสิน:** ใช้ hue ช่อง 1 (น้ำเงิน) ไล่ 5 step จางไปเข้ม เป็น `color.data.seq-{dark,light}-1..5` → `data.seq-1..5` ใช้เฉพาะ mark; จำนวนจุดและคำบอกระดับเสมอ สีแค่ซ้ำสิ่งที่ shape บอกแล้ว ห้ามใช้ status colour กับ magnitude
- **ค่า:** dark `#184F95 #256ABF #3987E5 #6DA7EC #9EC5F4` (มากขึ้น = สว่างขึ้น), light `#86B6EF #5598E7 #2A78D6 #1C5CAB #104281` (มากขึ้น = เข้มขึ้น)
- **ผลต่อ:** ConfidenceChip วันนี้; Heatmap และ legend แบบ sequential ใช้ ramp เดียวกันได้

### D-033: White-label brands เปลี่ยนได้เฉพาะรายการ token สั้น ๆ ที่กำหนด
- **วันที่:** 2026-10-31 · **เลือกโดย:** agent (J1 จาก JD, user สั่ง "จัดเต็ม"; ให้ user review ตอนจบ milestone)
- **ปัญหา:** product หนึ่งต้องรองรับหลายแบรนด์ลูกค้า แต่ Pane ไม่มี hue ของตัวเอง (P1) และความอ่านออกของกระจกขึ้นกับ material ที่วัดแล้ว
- **ตัดสิน:** แบรนด์คือไฟล์ JSON หนึ่งไฟล์ เปลี่ยนได้เฉพาะ loud action (fill + ตัวอักษรบน fill), accent, focus ring, chosen glass, type family และ corner 3 ขั้น ไม่แตะ glass material, text tone, status colour, spacing, motion และ data palette build จะหยุดถ้ามี token นอกรายการ หรือถ้าตัวอักษรบน loud action ต่ำกว่า 4.5:1 หรือ focus ring บนหน้าต่ำกว่า 3:1 ไม่ว่าจะธีม dark หรือ light แต่ละแบรนด์ได้ sheet ของตัวเอง (`pane-react/tokens/brands/<id>.css`) scope ด้วย `[data-brand]` และประกาศ component token ที่อ้างถึงซ้ำในบล็อก เหมือนบล็อกของธีมและ environment
- **ตัวอย่าง:** Harbor (ฟ้า, มุมแคบลงหนึ่งขั้น), Sage (เขียว), Plum (ม่วง และ chosen glass ย้อมสีแบรนด์)
- **ผลต่อ:** header มีตัวเลือก Brand, มีบท White-label brands, CLI `pane-theme`, evidence วัดแยกแต่ละแบรนด์ได้ด้วย KILN_BRAND

### D-034: Material เป็นตัวเลือกหลักของระบบ มีสองแบบ glass และ solid หนึ่งหน้าจอหนึ่ง material
- **วันที่:** 2026-10-31 · **เลือกโดย:** agent ตามที่ user สั่ง ("มีแนว skeuomorph กับ glassmorph ต้องทำให้ชัดเจน")
- **ตัดสิน:** ภาษารูปทรงแบบจับต้องได้ (แสงจากบน, ร่องที่ฝังลงไป, แผ่นที่ยกขึ้น) เป็นของทั้งระบบ ส่วน material ตัดสินแค่ความโปร่ง glass (ค่าเริ่มต้น) ให้ฉากหลังลอดผ่านแบบเบลอและหรี่ solid ให้รูปทรงเดิมแต่ทึบ ตั้งที่ `<Environment material>` ตัวเดียวที่รากของหน้าจอ ห้ามวาง glass กับ solid ข้างกัน (G-MT1) overlay ใช้ material ของหน้าจอที่มันเปิดทับ ถ้าผู้ใช้เปิด reduced transparency จะเปลี่ยนเป็น solid เอง
- **ผลต่อ:** บท Materials, หน้า Choose your look, ปุ่ม Appearance ใน header, `choose_appearance` ใน MCP, skill และ check_usage
- **ค้าง:** หน้าตาของ glass เองยังรอ user เลือกจาก concept-check (R-032) ตอนนี้ glass ที่เป็นแบบรมควันเข้มดูใกล้กับ solid มาก

### D-035: กระจกกลับมาบางและใส แยกจาก solid ให้เห็นชัด (supersedes ค่า body ของ D-025 และ brightness ของ D-011)
- **วันที่:** 2026-10-31 · **เลือกโดย:** user สั่งตรง ("ถ้าจะแยกให้แตกต่างก็ทำ … ไม่ให้คนสับสนกับกระจกแบบทึบกับบาง")
- **ปัญหา:** ตัวกระจก level 1 ทึบ 78% (smoke.1) หรี่ฉากหลังเหลือ 0.42 และเบลอ 64px ผลรวมคือกระจกดูเป็นแผ่นทึบ บน studio และรูปถ่ายแยกจาก solid ไม่ออก อีกทั้ง solid เองยังใช้ body 78% ที่โปร่งอยู่ 22%
- **ตัดสิน:** body ของกระจกเหลือ 45% ใน dark (`color.smoke.glass` #14151873) และ 66% ใน light, blur ลดเป็น 32px (`blur.clear`) เพื่อให้ฉากยังเห็นรูปทรง, brightness ไล่ตาม environment dim .70 / mid .56 / bright .48 ส่วน solid ใช้ `surface.solid` ทึบ 100% ทั้ง level 1
- **วัด:** evidence 23 หน้า × 6 ฉาก × 2 ธีม × 3 โหมด เจอสองต้นเหตุ (1) Navbar, Sidebar, BottomNav, NavigationMenu ใช้แค่ blur ไม่มี saturate/brightness ตามสูตรกระจก บนฉาก Aurora ตัวหนังสือเหลือ 3.4–3.8:1 แก้โดยเพิ่ม `nav.brightness` → `{glass.brightness}` (2) subject หลายตัว (charts, chat, agent, accordion, feed) ตั้ง `bare` ทั้งที่ตัวเองไม่ใช่พื้นผิว ตัวหนังสือจึงวางบนรูปตรงๆ แก้ให้วางบน Card ส่วนตัวอย่าง InputCount, InputClearable, TabsVertical ก็ครอบ Card แล้ว รันซ้ำบนหน้าที่เคยพลาด 18886/18886 ผ่าน
- **คำศัพท์:** Pane มีแค่ glass (มองทะลุ) กับ solid (ทึบ) ไม่มี "กระจกหนา" บท Materials มีตารางบอกว่าคำที่คนใช้ (frosted, smoked, acrylic, flat, opaque) คือแบบไหน

### D-036: mesh gradient เป็น accent ไม่เกินราว 10% ของ region ที่มันอยู่ (supersedes ข้อ "scene หลังกระจก" ของ D-029)
- **วันที่:** 2026-10-31 · **เลือกโดย:** user สั่งตรง ("กฎ mesh gradient มันคือ 10% ของ region นั้นๆ ไม่ใช่เอาไปใช้ wallpaper")
- **ตัดสิน:** Mesh ใช้เป็น icon, album art หรือ swatch ข้างชื่อเรื่อง กินพื้นที่ราวหนึ่งในสิบของ region ที่ครอบมัน (card, section, stage) ห้ามใช้เป็นพื้นหลังของหน้าจอ section หรือ card และห้ามเป็น cover เต็มความกว้าง
- **ผลที่เปลี่ยน:** ตัด Demo backdrop "Aurora (mesh)" ออก (ลิงก์เก่า `?backdrop=aurora` กลับไปเป็น studio และไม่ถูกเขียนลง URL), ตัวอย่าง MeshScene ถูกแทนด้วย MeshAccent, ตัวอย่าง media placeholder ทั้งหมด (AspectRatio, Box, Showcase, ContextMenu, Text caption) ใช้รูปถ่ายแทน mesh, หน้า Mesh และตาราง "Where it goes" ใน Colour · Gradients เขียนกฎใหม่, `check_usage` ของ MCP เตือนเมื่อ Mesh ครอบเนื้อหาหรือเต็มกล่อง, knowledge มีกฎนี้
- **วัด:** gate G-MS1 ใน kiln (พื้นที่ mesh รวม ÷ พื้นที่ region ≤ 0.10)

### D-037: brand เปลี่ยนบุคลิกได้ ไม่ใช่แค่สี (ขยาย D-033)
- **วันที่:** 2026-10-31 · **เลือกโดย:** agent ตามคำถามของ user ("ถ้ามีสิบแบรนด์เอาไปใช้ทำได้ขนาดไหน แตกต่างมากพอรึเปล่า … ยืดหยุ่นพอจะให้ user แก้ไขปรับเปลี่ยนไหม")
- **ปัญหา:** D-033 เปิดให้ brand แก้แค่ 15 token (สี action, focus, chosen glass, font, มุม) ถ้าสิบแบรนด์ใช้ จะได้แอปเดิมที่เปลี่ยนสี
- **ตัดสิน:** เพิ่มแกนบุคลิก: น้ำหนักตัวอักษร (400–800), tracking ของ display, `glass.saturate` (1–2), สี mesh, duration ของ motion (80–1000ms) และ preset สองตัว `density` (compact/regular/roomy เลื่อน gap ทุกตัวหนึ่งขั้นบน space scale, มุมใน = มุมนอก − inset ตามอัตโนมัติ) กับ `motion` (brisk/steady/calm) ส่วน reduced motion ยังกดทุก duration ของแบรนด์เป็น 0
- **สามระดับ:** brand (รายการที่ตรวจได้ build หยุดเมื่อไม่ผ่าน), expert brand (`"tier": "expert"` แก้ semantic ได้ทุกตัว ตรวจแค่ contrast และ build บอกว่าตัวไหนไม่ได้ตรวจ), fork (primitive และ component token เป็นระบบของผู้ใช้เอง)
- **พิสูจน์:** sample brand 9 ตัว + Pane = 10 (Harbor, Sage, Plum, Ledger, Kiddo, Atelier, Pulse, Terra, Signal) บนการ์ดเดียวกันในหน้า Brands ผ่าน brand-check ทุกตัว; BRANDABLE ย้ายไปอยู่ที่ `brand-check.mjs` ที่เดียว ทั้ง build และ `pane-theme` อ่านจากที่นั่น (เดิมสองที่ซ้ำกันและเริ่มไม่ตรงกัน)
