# DECISIONS — long-term memory ของ system นี้
> เขียนผ่าน /lock-decision เท่านั้น · แก้ของเก่า = supersede + ประเมิน impact
## Format
### D-{nnn}: {หัวข้อ}
- **วันที่:** · **Phase:** 
- **เลือก:** / **เพราะ:** / **ตัวเลือกที่ตัดทิ้ง:** / **กระทบ:**
---

### D-001: Style direction = Braun-derived ล้วน (ทางเลือก ก.)
- **วันที่:** 2026-08-08 · **Phase:** 0
- **เลือก:** ยึด ref ภาพ 1-2 (Braun-style radio: cream/off-white body, สีจัด orange/coral สงวนไว้เฉพาะจุดที่นิ้วสัมผัส, ไม่มี drop-shadow ตกแต่ง, type flat ไม่พึ่ง scale ใหญ่, hierarchy จากตำแหน่ง/ขนาด block ไม่ใช่ฟอนต์) เป็น driver เดียวของระบบ · ภาพ 3 (feel — speckled material, mint/orange two-tone, digital-first) เก็บไว้เป็นแรงบันดาลใจเรื่อง sustainability/material-honesty แบบ note เท่านั้น ไม่แปลงเป็น token
- **เพราะ:** user เลือกทาง ก. จากทางเลือก ก./ข./ค. ที่เสนอ — เอาความสงบ+สีสงวนเฉพาะจุดเต็มตัว ไม่ผสมกับภาษาสีสองโทน+พื้นผิวมีเรื่องเล่าของภาพ 3 เพื่อไม่ให้ระบบสับสนว่า "สีจัดคือของสำคัญ" หรือ "สีจัดคือ mood ทั่วไป"
- **ตัวเลือกที่ตัดทิ้ง:** ข. Hybrid (ยืม 2-accent orange+mint จากภาพ 3 มาคู่กับโครง Braun), ค. Feel ล้วน (ภาพ 3 เป็น driver หลัก ภาพ 1-2 เป็น archive)
- **กระทบ:** color.action.* (สงวนสีจัดไว้จุดเดียว ห้ามมี secondary accent สีมินต์), type scale (แบน ratio ต่ำ ~1.2), density baseline (comfortable/spacious จาก ref ที่ของน้อยชิ้น), ไม่มี texture/speckle token · ถ้าทีหลังอยากดึงภาพ 3 กลับมา = supersede ตัวนี้ + เพิ่ม secondary accent hue และพิจารณา texture token ใหม่

### D-002: Platform = Web-first
- **วันที่:** 2026-08-08 · **Phase:** 1 (ข้อ 0)
- **เลือก:** web-first — hover เป็น interaction ชั้นหนึ่ง (ไม่ใช่แค่ enhancement), touch target ไม่บังคับ 44px เป็นกฎตายตัวแต่ยังคงเผื่อ 40px ขั้นต่ำสำหรับ mouse+trackpad, density default = comfortable (ยืนตาม D-001), breakpoint แรกที่ล็อก = desktop/laptop viewport (lg 1024) ก่อน แล้วไล่ลงมือถือทีหลังแบบ responsive ปกติ ไม่ใช่ mobile-first reflow, ลำดับ component inventory ยืนตาม default (Sidebar/ContextMenu/hover-Tooltip ไม่ต้องเลื่อนไปท้าย, ไม่ดัน BottomNav/Sheet ขึ้นก่อน)
- **เพราะ:** user ตอบ "web" ตรงคำถามข้อ 0 ของ Phase 1
- **ตัวเลือกที่ตัดทิ้ง:** mobile-first (touch target 44px บังคับ, hover เป็น enhancement เท่านั้น, breakpoint แรก 390), both-equal (ต้องออกแบบคู่ขนานทั้ง input mode ตั้งแต่ต้น)
- **กระทบ:** ลำดับ component inventory (คง default tier ไม่ reorder), qa-a11y checklist (ไม่ต้องบังคับ hover-only ต้องมี tap/focus fallback อย่างเข้มเหมือน mobile-first แต่ยัง WCAG keyboard-focus ปกติ), ทุก breakpoint token (lg เป็น anchor แรก), docs/lab preview default เปิดที่ desktop frame

### D-003: Spacing base unit = 8px
- **วันที่:** 2026-08-08 · **Phase:** 1
- **เลือก:** base unit = 8px · scale = 0, 8, 16, 24, 32, 40, 48, 64, 80, 96, 128, 160 (คูณ 8 ทั้งหมด) · semantic alias: inset.sm/md/lg, stack.sm/md/lg, inline.sm/md/lg ผูกกับ scale นี้
- **เพราะ:** ref (Braun radio, D-001) ไม่มีตัวเลขที่วัดได้ตรงเพราะเป็น hardware แต่ layout ที่เห็น (speaker ใหญ่, dial ใหญ่, ปุ่มห่างกันชัด, ของน้อยชิ้นไม่แน่น) ส่อ mood spacious/comfortable ซึ่งจับคู่กับ base 8 มากกว่า 4 (4 เหมาะ dense UI/dashboard ที่ระบบนี้ยังไม่ระบุว่าต้องมี) — user ยืนยัน 8
- **ตัวเลือกที่ตัดทิ้ง:** 4px (granularity ละเอียดกว่า เผื่อ dense component ในอนาคต แต่ over-engineer ตอนนี้), 6px (หารลงตัวกับ grid/breakpoint มาตรฐานยาก)
- **กระทบ:** space.* ทั้งหมด, size.* (ยังคนละ namespace แต่มักอ้าง dimension เดียวกับ space — ต้องเช็คตอน sizing round), ทุก component token ที่อ้าง dimension, grid gutter · ถ้าทีหลังต้องมี dense component (table แน่นๆ) = supersede ตัวนี้หรือเพิ่ม exception scale ย่อยเฉพาะจุด

### D-004: Sizing scale — control height หนาแบบ Braun (md=48)
- **วันที่:** 2026-08-08 · **Phase:** 1
- **เลือก:** `size.icon.*` = 16/20/24/32 · `size.avatar.*` = 24/32/40/48/64/96 · `size.control.*` (t-shirt) = sm 40 · md **48** · lg 56 · xl 64 (คนละ namespace จาก `space.*` ตาม D-003 เด็ดขาด แม้ค่าจะซ้ำ 8-multiple)
- **เพราะ:** user สั่ง "auto approve ให้ใกล้เคียงตามภาพเลย" — เลือกทางเลือกที่ขยับ control height ทั้งชุด +8 จาก default มาตรฐาน เพราะ dial/knob ในภาพ Braun มีสัดส่วนหนา มั่นคง ใหญ่กว่า flat UI ทั่วไปเทียบตัวเครื่อง ไม่ใช่ค่า default เฉยๆ
- **ตัวเลือกที่ตัดทิ้ง:** default มาตรฐาน (sm32/md40/lg48/xl56) — บางเกินไปเทียบสัดส่วนหนาของ ref
- **กระทบ:** ทุก component ที่ใช้ t-shirt sizing (Button, Input, Select, ฯลฯ), component tokens ที่อ้าง `size.control.*`, ต้องเช็ค touch/click target ยังพอเหมาะกับ web-first (D-002 ไม่บังคับ 44px แต่ md=48 เกินอยู่แล้วไม่มีปัญหา) · ถ้าทีหลังอยากได้ UI บางลง = supersede ตัวนี้กลับไป default

### D-005: Typography — base 16px, ratio แบน 1.2 (Minor Third), เดี่ยว font family
- **วันที่:** 2026-08-08 · **Phase:** 1
- **เลือก:** base 16px · ratio 1.2 → scale: xs 11 · sm 13 · md 16(base) · lg 19 · xl 23 · 2xl 28 · 3xl 33 · 4xl 40 · 5xl 48 · font stack เดียวกันทั้ง heading/body (geometric grotesque sans เช่น Inter/system-ui — web-safe stand-in ของ geometric sans แบบ Braun) + mono แยกสำหรับ code · line-height: body 1.5, heading 1.15
- **เพราะ:** D-001 กำหนดไว้แล้วว่า hierarchy มาจากตำแหน่ง/ขนาด block ไม่ใช่ font scale (ref: FM display, VOLUME label ใช้ weight/family เดียวกันหมด ไม่มี type ใหญ่เด่น) → ratio ต้องแบนที่สุดในตารางมาตรฐาน (1.2) ไม่ใช้ 1.25+ ที่จะสร้าง hierarchy ทางฟอนต์ซึ่งขัดกับ DNA ของ ref
- **ตัวเลือกที่ตัดทิ้ง:** ratio 1.25 (Major Third — สมดุลทั่วไป แต่สร้าง hierarchy ทางฟอนต์มากกว่าที่ ref บอก), 2 font families แยก heading/body (ref ไม่มีสัญญาณว่าต้องแยก)
- **กระทบ:** text.* composite tokens ทั้งหมด, ทุก component ที่ใช้ heading/body, ถ้าทีหลังอยากได้ hierarchy จากฟอนต์มากขึ้น = supersede ratio และอาจต้องเพิ่ม font family ที่สอง

### D-006: Color — neutral ramp จาก cream, accent orange สงวนจุดเดียว
- **วันที่:** 2026-08-08 · **Phase:** 1
- **เลือก:** `color.neutral.*` ramp 50-950 เป็น warm neutral (ไม่ใช่ gray เย็น) จาก cream (~#F2EFE9 ที่ 50) ไปมืดใกล้ดำอมน้ำตาล (~#242220 ที่ 950) generate ใน OKLCH · `color.brand.*` (accent) = orange/coral ramp จากภาพ knob · roles อื่น (success/warning/danger/info) ใช้ hue มาตรฐานแต่ desaturate ลงให้เข้ากับ mood สงบ · semantic: `bg.canvas`=neutral.50, `bg.surface`=neutral.0/25, `text.default`=neutral.900, `action.primary`=brand.600 · **กฎสงวนสี (จาก D-001):** accent เข้มใช้เฉพาะ primary interactive element ที่สำคัญที่สุดของแต่ละ view ห้ามใช้ตกแต่ง/เน้นข้อความทั่วไป
- **เพราะ:** ตัวเครื่อง ref เป็น cream ล้วน สีจัดอยู่แค่ปุ่มหมุนเดียว — สื่อชัดว่า neutral ramp ต้องอุ่น (warm) ไม่ใช่ gray เย็นแบบ tech-neutral ทั่วไป และ accent ต้อง scarce ตามกฎที่ lock ไว้แล้วใน D-001
- **ตัวเลือกที่ตัดทิ้ง:** cool/gray neutral ramp (มาตรฐานทั่วไปแต่ขัดกับ warm cream ของ ref), multi-accent (primary+secondary) — ขัด D-001 ตรงๆ
- **กระทบ:** color.* ทั้งหมด, ทุก semantic bg/text/border/action token, contrast AA ต้องคุมเข้มเพราะ warm neutral มักมี contrast ต่ำกว่า cool gray ที่ lightness เดียวกัน ต้อง QA เช็คละเอียด · ถ้าทีหลังอยากได้ 2nd accent = supersede D-001 ก่อน (impact ใหญ่กว่าตัวนี้)

### D-007: Grid & Breakpoints
- **วันที่:** 2026-08-08 · **Phase:** 1
- **เลือก:** breakpoints มาตรฐาน sm640/md768/**lg1024(anchor แรกตาม D-002)**/xl1280/2xl1536 · 12-column grid · gutter = space.300 (24px)
- **เพราะ:** web-first (D-002) ไม่มีเหตุผลจาก ref ให้บิด breakpoint จากมาตรฐาน — ใช้ default ของ blueprint ตรงๆ โดยยึด lg เป็น anchor ตาม D-002
- **ตัวเลือกที่ตัดทิ้ง:** custom breakpoint scale (ไม่มีหลักฐานจาก ref รองรับการบิด)
- **กระทบ:** container max-width ต่อ breakpoint, component ที่ตอบสนอง container query (§4.5)

### D-008: Radius / Shadow / Border — soft radius, ไม่มี decorative shadow, hairline แทนเงา
- **วันที่:** 2026-08-08 · **Phase:** 1
- **เลือก:** radius scale sm8/md12/lg16/xl24/2xl32/full (soft-rounded ตามตัวเครื่อง ไม่ sharp ไม่ pill-only) · **ห้ามมี drop-shadow ตกแต่งบน card/button/input ปกติ** — ใช้ `border.hairline` (1px, neutral.200-300) แทนเงาเป็นตัวสร้างขอบ/definition · shadow (elevation) สงวนไว้เฉพาะ layer ที่ต้อง "ลอยจริง" เท่านั้น (modal, popover, toast) ระดับ 0-2 เบาๆ ไม่ใช่เงาหนัก · border widths 1/2
- **เพราะ:** D-001 ระบุไว้แล้วว่า ref ไม่มี drop-shadow ตกแต่ง ความนูน/ขอบสื่อด้วยเนื้อวัสดุจริงซึ่งจอแบนไม่มี ต้องแทนด้วย hairline border ไม่ใช่เงาปลอม — นี่ต่างจาก neumorphism ที่ยังใช้เงาคู่เป็นหลัก (recipe แยกกันคนละสไตล์ ดู docs/style-recipes/braun-flat.md ที่จะเขียนคู่กับ decision นี้)
- **ตัวเลือกที่ตัดทิ้ง:** sharp radius (ขัดกับตัวเครื่องโค้งมน), neumorphism dual-shadow (มี recipe อยู่แล้วแต่ขัดกับกฎ "ไม่มี drop-shadow ตกแต่ง" ของ D-001 ตรงๆ)
- **กระทบ:** radius.*, shadow.* (จำกัดการใช้เหลือ elevation จริงเท่านั้น), border.hairline ต้องมีในทุก interactive component, qa-a11y ต้อง verify ว่า state เปลี่ยนด้วย non-shadow cue เสมอ (ดู style recipe)

### D-009: Motion
- **วันที่:** 2026-08-08 · **Phase:** 1
- **เลือก:** ใช้ default ของ blueprint ตรงๆ — duration: fast100/base200/slow300/slower500 · easing: standard/decelerate/accelerate · `prefers-reduced-motion` รองรับทุก component
- **เพราะ:** ref เป็นภาพนิ่ง ไม่มีหลักฐานให้บิด motion จาก default — ไม่มีเหตุผลให้ทำ custom
- **ตัวเลือกที่ตัดทิ้ง:** — (ไม่มีทางเลือกอื่นที่มีหลักฐานรองรับ)
- **กระทบ:** duration.*, cubicBezier.*, transition.* — ถ้าทีหลังมีหลักฐาน/ความต้องการเฉพาะ (เช่น brand ต้องการ motion เด้งขึ้น) ค่อย supersede

### D-010: Density baseline = Comfortable
- **วันที่:** 2026-08-08 · **Phase:** 1
- **เลือก:** density default = **comfortable** (ยืนยันเป็นทางการจาก note ที่ตั้งไว้ใน D-001) — เผื่อ compact/spacious mode ไว้ในโครง token แต่ยังไม่ generate จนกว่ามี use case จริง (เช่น dashboard/table หนาแน่น)
- **เพราะ:** ref แสดงของน้อยชิ้น โล่ง ไม่มีสัญญาณว่าต้อง dense ตั้งแต่ต้น — comfortable ตรงกับ mood ที่สุดและไม่ over-engineer ตอนยังไม่รู้ scope ของ dense component
- **ตัวเลือกที่ตัดทิ้ง:** compact (ไม่มีหลักฐานรองรับ ต้องรอ use case), spacious (เผื่อไว้เกินความจำเป็นตอนนี้)
- **กระทบ:** space.* mapping ที่ compact/spacious mode จะสลับ (โครงเผื่อไว้แต่ยังไม่ generate ค่า), ต้อง revisit ทันทีที่มี component ที่ต้องการ dense จริง

### D-011: ชื่อ System/Package = Dial
- **วันที่:** 2026-08-08 · **Phase:** 1 (จบก่อนเข้า Phase 2)
- **เลือก:** ชื่อ system = **Dial** → package scope `@dial/tokens`, `@dial/react`
- **เพราะ:** user บอกให้ตั้งไปเลย — เลือก "Dial" เพราะเป็นชิ้นส่วนหัวใจของ ref ทั้งคู่ (หน้าปัด/dial ของวิทยุ + knob หมุน) สั้น จำง่าย ไม่ชนกับ trademark ของแบรนด์อื่น (ต้องเลี่ยง Braun/Material/MUI ตาม blueprint §13)
- **ตัวเลือกที่ตัดทิ้ง:** ชื่อที่พาดพิงแบรนด์ต้นทาง (Braun/Lectron ใดๆ) — ห้ามใช้ตรงๆ ตามกฎ trademark
- **กระทบ:** package.json ทุก package, npm scope, docs site title, Storybook title, ทุกจุดที่ reference ชื่อ brand — เปลี่ยนทีหลัง = rename ทั่ว repo

### D-012: W1 Layout+Primitives — API ทั้ง wave (Box/Flex/Stack/Grid/Container/Center/Spacer/Divider/AspectRatio/VisuallyHidden)
- **วันที่:** 2026-08-08 · **Phase:** 3 (Wave 1)
- **เลือก:** API ตาม BATCH API REVIEW ที่เสนอ — Box เป็น base ทุกตัว (`asChild`, forwardRef, ไม่มี variant/size), Flex/Stack/Center extends Box ด้วย gap จาก `space.*`, Grid/Container ผูก breakpoint จาก D-007, Divider ผูก `border.hairline`/`hairline-strong` จาก D-008, AspectRatio ผูก `ratio.*` token, Spacer/VisuallyHidden เป็น utility เดี่ยวไม่มี variant — ทุกตัวไม่มี "use client" (ล้วน presentational)
- **เพราะ:** user ยืนยัน "ดี ลุย" ต่อ BATCH API REVIEW ทั้งชุด — รวบเป็น decision เดียวตาม production-run economics (ไม่ล็อกทีละตัว)
- **ตัวเลือกที่ตัดทิ้ง:** แยก Stack ออกจาก Flex เป็น implementation อิสระ (เลือก thin-wrapper แทนเพื่อลด duplication logic)
- **กระทบ:** ทุก component ตั้งแต่ Tier 1 ขึ้นไปที่ต้องใช้ layout primitive เหล่านี้เป็นฐาน (แทบทุกตัวในระบบ) — เปลี่ยน Box API ทีหลัง = กระทบทั้ง 108 ตัวใน catalog

### D-013: W2 Atoms-Core — auto-approve API ตาม pattern มาตรฐาน (Text/Heading/Icon/Button/IconButton/Link/Badge/Avatar/Spinner/Skeleton/Kbd/Image)
- **วันที่:** 2026-08-08 · **Phase:** 3 (Wave 2)
- **เลือก:** ข้าม BATCH API REVIEW checkpoint — component-engineer เดา API ตาม pattern มาตรฐานของ library ระดับเดียวกัน (Radix Themes/Chakra/MUI atoms) โดยอ้าง token ที่ lock แล้ว (D-001 ถึง D-012) เท่านั้น แล้วทำต่อเองจนจบ wave รวม qa-a11y gate — ไม่หยุดถามทีละตัว/ทีละ prop
- **เพราะ:** user สั่ง auto-approve ต่อจาก pattern เดียวกับที่ใช้ตอน sizing/typography ใน Phase 1 — ยอมรับ trade-off ว่า Button/IconButton/Link (interactive ตัวแรกของระบบ) จะไม่ผ่าน batch review ก่อนสร้างจริง
- **ตัวเลือกที่ตัดทิ้ง:** เสนอ BATCH API REVIEW ก่อนเหมือน Wave 1 (ปลอดภัยกว่าแต่ user ปฏิเสธ ต้องการความเร็ว)
- **กระทบ:** ถ้า API ของ Button/IconButton/Link ที่ auto-approve ไปผิดจากที่ user ต้องการจริง = ต้อง supersede ทีหลังและ regenerate ทุก component ที่อ้าง API เหล่านี้เป็นฐาน (Tier 2 molecules ส่วนใหญ่ใช้ Button ต่อ) — ความเสี่ยงสูงกว่า Wave 1 เพราะเป็น wave แรกที่มี interactive component จริง

### D-014: W2 Wave 2 QA fix — 5 blocking contrast findings (Badge solid text, Button outline border, Button/Link danger+primary AA, prefers-contrast media query)
- **วันที่:** 2026-08-08 · **Phase:** 3 (Wave 2, QA fix)
- **เลือก:** (1) เพิ่ม `color.text.onRoleSolid` semantic token (flip white/light↔`neutral.950`/dark ตาม theme เหมือน `text.onPrimary`) แล้วให้ `badge.json`'s solid.text ใช้ token นี้แทน hardcode `{color.base.white}` — แก้ dark-theme badge solid contrast 2.0-2.7:1 → 5.95-7.94:1 ทุก role · (2) เพิ่ม `color.border.interactive` (neutral.500 ทั้ง 2 theme) แยกจาก `border.hairline` สำหรับ border ของ interactive control (Button outline neutral) ที่ต้องผ่าน WCAG 3:1 UI-component — แก้ 1.24-1.48:1 → 3.72-3.96:1 ทั้ง light/dark · (3) เลื่อน `color.action.primary.default`/`color.action.danger.default` (light) จาก step 600→700 (contrast บน canvas 4.02:1/4.46:1 → 6.38:1/6.50:1) และ `color.action.danger.default` (dark) จาก step 700→400 (2.13:1 → 6.07:1, mirror pattern เดียวกับ primary brand.600→400 ที่ทำถูกอยู่แล้ว) พร้อมเพิ่ม `text.onDanger` (dark) เป็น `neutral.950` (แทน white) ให้ตรงกับ fill ที่สว่างขึ้น · (4) เพิ่ม `@media (prefers-contrast: more)` block ต่อท้าย build/css/light.css ผ่าน postbuild script (`packages/tokens/scripts/postbuild-contrast-media.mjs`, เรียกจาก `build.mjs`) ที่ diff ค่าจริงระหว่าง light.css กับ light-contrast-more.css แล้ว emit ค่าที่ต่างกันเข้า `:root` ใน media query — ให้ OS/browser auto-detect ทำงานคู่กับ manual `[data-contrast="more"]` attribute เดิม (ไม่ลบของเดิม)
- **เพราะ:** qa-a11y ตีกลับ 5 blocking finding จาก Wave 2 — ทุกจุดวัด contrast จริงจาก hex ที่ build ออกมา (relative luminance formula) แล้วพบต่ำกว่า WCAG AA (text 4.5:1, UI-boundary 3:1) จริงตามที่ QA รายงาน วิธีแก้ทุกจุดเลือกใช้ pattern ที่ระบบมีอยู่แล้วและพิสูจน์แล้วว่าใช้งานได้ (theme-flip token แบบ `text.onPrimary`, darker-in-light/lighter-in-dark แบบที่ primary ทำถูกอยู่แล้ว) เพื่อไม่สร้าง pattern ใหม่ที่ขัดกับของเดิม
- **ตัวเลือกที่ตัดทิ้ง:** ใช้ token คู่เดียว (`color.base.white`) สำหรับ badge solid text ทุก theme ต่อไปแล้วปรับ background lightness step ของ dark role.*.solid ให้เข้มลงจนขาวอ่านได้ — ตัดทิ้งเพราะจะทำให้ dark badge solid ดู "เข้ม/มืด" ผิดจาก mood ที่ role.*.solid ของ dark ตั้งใจให้ "ผิวสว่างลอยขึ้นมา" (เหมือน action.primary dark ที่ใช้ brand.400 ไม่ใช่ brand.600) — เปลี่ยน text token ตาม pattern เดิมที่มีอยู่แล้วปลอดภัยกว่า · ใช้ `border.hairlineStrong` (neutral.400/600) แทนที่จะสร้าง `border.interactive` ใหม่สำหรับ finding #2 — ตัดทิ้งเพราะ hairlineStrong สงวนไว้เป็น prefers-contrast override token ตาม braun-flat rule 5 อยู่แล้ว การใช้ซ้ำเป็นค่า default ของ interactive border จะทำให้ manual contrast-more toggle ไม่มีอะไรให้ "เข้มขึ้นกว่า default" อีก (สอง token ต้องมีช่องว่างให้ step ขึ้นได้จริง)
- **กระทบ:** `color.text.onRoleSolid`, `color.border.interactive`, `color.action.primary.default/hover/active` (light), `color.action.danger.default/hover/active` (ทั้ง 2 theme), `color.text.onDanger` (dark) — ทุก component ที่ alias token เหล่านี้ (Badge ทุก role solid, Button/IconButton solid+outline ทุก intent, Link default variant) เปลี่ยนสีจริงตามไปด้วยแต่ hue/ตำแหน่งใน ramp เดิม (แค่เลื่อน step) จึงไม่กระทบ D-006 (ยังเป็น warm neutral + accent สงวนจุดเดียว) · build script เพิ่มไฟล์ใหม่ `packages/tokens/scripts/postbuild-contrast-media.mjs` ที่ผูกกับ build.mjs — ถ้าทีหลังเพิ่ม dark+contrast-more หรือเปลี่ยน scope ของ contrast-more.json ต้อง revisit script นี้ด้วยเพราะมันสมมติว่า diff เทียบกับ light.css เท่านั้น

### D-015: W3 Forms-Core — auto-approve API + contrast self-check บังคับก่อนส่ง QA (Input/Textarea/Checkbox/Radio/Switch/Label/FormField/HelperText/Fieldset/InputGroup/PinInput)
- **วันที่:** 2026-08-08 · **Phase:** 3 (Wave 3)
- **เลือก:** ข้าม BATCH API REVIEW เหมือน D-013 (auto-approve) แต่เพิ่มกฎใหม่จาก v14-merge: component-engineer ต้อง (1) รัน Reuse Check ก่อนสร้างแต่ละตัว (เช็คว่า Label ทับซ้อนกับ Text ไหม, FormField/HelperText ใช้ pattern composition จาก Box/Flex/Stack ของ Wave 1 ได้ไหม) (2) คำนวณ WCAG contrast จริงของทุก token สีใหม่ก่อนส่งต่อ qa-a11y (ไม่ใช่รอ QA จับ) — เป้าหมาย: ปิด wave เร็วกว่า Wave 2 ที่เสียเวลาไปกับรอบ QA-fail-fix-reverify เรื่อง contrast
- **เพราะ:** user ขอ "optimize หน่อย" หลัง Wave 2 ใช้เวลาไปเกือบ 2 ชม. (ส่วนใหญ่จากรอบ qa-a11y ตีกลับ contrast แล้วต้องแก้ใหม่) — ป้องกันที่ต้นเหตุแทนแก้ปลายเหตุ
- **ตัวเลือกที่ตัดทิ้ง:** เสนอ BATCH API REVIEW ก่อนสร้าง (ปลอดภัยกว่าแต่ช้ากว่า ขัดกับที่ user ขอให้เร็วขึ้น)
- **กระทบ:** input component ทุกตัวใน wave นี้ต้องรองรับ controlled+uncontrolled (§7) และยืม behavior จาก React Aria สำหรับ Checkbox/Radio/Switch (edge case a11y เยอะกว่า native element เปล่า) — ถ้า contrast self-check พลาดจุดไหน qa-a11y ยังเป็น gate สุดท้ายที่จับได้เหมือนเดิม ไม่ลดมาตรฐาน แค่ลดรอบ round-trip

### D-016: W3 Wave 3 QA fix — 4 findings (Switch thumb travel, Checkbox/Radio/Switch touch target, FormField forwardRef, Radio comment over-claim)
- **วันที่:** 2026-08-08 · **Phase:** 3 (Wave 3, QA fix)
- **เลือก:** (1) Switch track `size.avatar.xs`(24px)→`size.avatar.lg`(48px) ให้ thumb (`size.icon.md`=20px) มี travel distance จริง 24px (เดิม 0px เพราะ track เท่าตัว thumb+offset พอดี) · (2) Checkbox/Radio/Switch `.wrapper` เพิ่ม `min-inline-size`/`min-block-size: size.control.sm`(40px ตาม D-002) ให้ hit-area ถึงเกณฑ์ web-first โดย visual indicator (24px) ยัง center อยู่กลางด้วย flex · (3) FormField เปลี่ยนจาก plain function เป็น `forwardRef<ElementRef<'div'>>` ให้ตรง pattern เดียวกับทุก component อื่นในระบบ (เป็นตัวเดียวที่หลุดจาก 33 ตัว) · (4) แก้ comment ใน Radio.tsx ที่เคย over-claim ว่า arrow-key navigation "verified" — เปลี่ยนเป็นระบุชัดว่าเป็น native browser behavior ที่ unit test (jsdom) พิสูจน์ไม่ได้ พร้อม manual-QA note ให้ verify ในเบราว์เซอร์จริง
- **เพราะ:** qa-a11y ตีกลับ 4 finding จาก Wave 3 — ข้อสำคัญ: **contrast self-check ตาม D-015 ทำงานได้ผลจริง** (ไม่มี contrast finding เลยรอบนี้ ต่างจาก Wave 2 ที่เจอ 5 จุด) แต่ D-015 ยังไม่ครอบคลุม dimension/behavior class ของบั๊ก (thumb travel, hit-area, forwardRef, test-claim accuracy) — เป็น regression class ใหม่ที่ยังไม่มี self-check เฉพาะ
- **ตัวเลือกที่ตัดทิ้ง:** เพิ่ม Playwright test จริงสำหรับ arrow-key navigation ของ Radio (แก้ปัญหาถูกจุดกว่าแต่ใช้เวลามากกว่า) — เลือกแก้แค่ความถูกต้องของคำอ้างใน comment ก่อน เพิ่ม real-browser test เป็นงานค้างที่ยังไม่ทำ (ไม่ block wave นี้)
- **กระทบ:** `component/switch.json` (ขนาด track), Checkbox/Radio/Switch `.module.css` (.wrapper hit-area — pattern นี้ควรใช้เป็นมาตรฐานสำหรับ selection control ตัวใหม่ในอนาคตด้วย ไม่ใช่แค่ 3 ตัวนี้), FormField.tsx (breaking change เล็กถ้ามีคนใช้ FormField แบบ non-ref มาก่อน — แต่ยังไม่มี consumer จริงนอกจาก stories/tests ของเราเอง) · ทีหลังสร้าง selection control ใหม่ (เช่น RadioCards ใน W5) ต้อง apply hit-area pattern เดียวกันนี้ตั้งแต่แรก ไม่ต้องรอ QA จับซ้ำ

### D-017: W4 scope = Web Overlays (ตัด mobile-only pattern ออกจาก catalog เดิม)
- **วันที่:** 2026-08-08 · **Phase:** 3 (ก่อนเริ่ม Wave 4)
- **เลือก:** ตัด ActionSheet, FAB, PullToRefresh ออกจาก W4 (เป็น mobile-only pattern ที่ขัดกับ D-002 web-first) · เหลือ 6 ตัว: Dialog/Modal, Drawer (เก็บ role ของ Sheet/BottomSheet ไว้เป็น variant ของ Drawer ไม่ใช่ component แยก), Popover, Tooltip, Toast, Snackbar
- **เพราะ:** CATALOG.md เดิมออกแบบ wave นี้จาก catalog ทั่วไปที่ default เป็น mobile-first แต่ระบบนี้ล็อก web-first ไปแล้วตั้งแต่ D-002 — ทำ mobile-only pattern ไปจะเป็นงานที่ไม่มีที่ใช้จริงในระบบนี้ user เลือกทางตัดออกแทนทำแบบ web-adapted ทั้งหมด (เร็วกว่า)
- **ตัวเลือกที่ตัดทิ้ง:** ทำทั้ง 10 ตัวแบบ web-adapted (เช่น FAB เป็นปุ่มลอยบน desktop ก็มีคนใช้) — ใช้เวลามากกว่าเพราะต้องคิด adaptation เพิ่ม ไม่ตรงกับเป้าหมาย optimize เวลาที่ user ขอไว้
- **กระทบ:** CATALOG.md ต้องปรับจำนวนตัวรวมทั้งระบบ (108 → 104: ตัด ActionSheet/FAB/PullToRefresh ออก 3 ตัว + รวม Sheet/BottomSheet เป็น variant ของ Drawer อีก 1 ตัว) และปรับ engine map ของ wave นี้ · ถ้าทีหลังเปลี่ยน D-002 เป็น mobile-first หรือ both = ต้อง revisit และอาจเพิ่มตัวที่ตัด/รวมไปกลับเข้ามาเป็น component แยก

### D-018: W4 Web Overlays — auto-approve API ตาม pattern มาตรฐาน (Dialog/Drawer/Popover/Tooltip/Toast/Snackbar)
- **วันที่:** 2026-08-08 · **Phase:** 3 (Wave 4)
- **เลือก:** auto-approve เหมือน D-013/D-015 — component-engineer เดา API ตาม pattern มาตรฐาน (Radix Dialog/Popover/Toast primitives) โดยยืม behavior จาก Radix สำหรับ focus trap/portal/escape-to-close ตาม §7 (ห้ามเขียนเอง) แล้วทำต่อเองจนจบ wave รวม qa-a11y gate — ไม่หยุดถามทีละตัว
- **เพราะ:** user เลือก auto-approve ต่อจาก pattern เดียวกับ Wave 2-3 แม้ overlay จะซับซ้อนกว่า (focus trap, portal, z-index stacking) ยอมรับความเสี่ยงว่า Toast provider pattern ที่ component อื่นจะเรียกใช้ทีหลัง (เช่น FormField validation, form submit feedback) อาจต้อง supersede ถ้า API ไม่ตรงที่ต้องการจริง
- **ตัวเลือกที่ตัดทิ้ง:** BATCH API REVIEW ก่อนสร้าง (ปลอดภัยกว่าเพราะ Dialog/Toast เป็น API ที่ wave หลังๆ จะเรียกใช้เป็น base แต่ user เลือกความเร็ว)
- **กระทบ:** ทุก component ใน W5-10 ที่ต้องใช้ Dialog เป็น base (เช่น confirmation dialog ใน data table), Toast provider ที่ FormField/Form validation จะเรียกใช้ — ถ้า API ผิดจากที่ต้องการ = ต้อง supersede + regenerate component ที่พึ่งพา ความเสี่ยงสูงกว่า Wave 2-3 เพราะ overlay เป็น infrastructure ที่ wave หลังอ้างอิงเยอะกว่า atom/form เดี่ยวๆ

### D-019: W4 QA judgment — ยอมรับ border.interactive บน surface.overlay (dark) = 2.99:1 เป็น non-boundary decorative use
- **วันที่:** 2026-08-08 · **Phase:** 3 (Wave 4, QA verdict)
- **เลือก:** ยอมรับ contrast 2.99:1 (ต่ำกว่า 3:1 UI-boundary minimum เล็กน้อย, ห่างกัน ~0.5%) ของ `color.border.interactive` บน `surface.overlay` ใน dark theme — ใช้เฉพาะเป็น decorative accent bar ของ Toast variant `default` เท่านั้น ไม่ใช่ boundary จริงของ panel (panel ใช้ shadow.elevation.md + surface-lightness jump แทนตามที่ braun-flat.md rule 5 กำหนดไว้แล้วสำหรับ dark mode) — **เกณฑ์ที่ตั้งไว้ชัดเจน:** ยอมรับได้เฉพาะกรณี non-boundary/decorative state-cue เท่านั้น ถ้ามีใครเอา token นี้ไปทำ actual clickable-boundary ของปุ่ม/input ที่ต่ำกว่า 3:1 ต้อง reject ทันที ไม่ใช่ precedent ทั่วไป
- **เพราะ:** qa-a11y คำนวณ contrast ใหม่เองยืนยันตัวเลขตรงกับที่ component-engineer รายงาน (ไม่ over-claim) แล้วตัดสินโดยเทียบกับ pattern ที่ระบบยอมรับไว้แล้ว (Divider's border.hairline บน surface.overlay วัดได้ 1.48:1 ซึ่งต่ำกว่านี้อีกแต่ QA ก็ยอมรับตั้งแต่ D-014 เพราะเป็น quiet internal divider ไม่ใช่ boundary) — 3 variant อื่น (success/warning/danger) ของ Toast ผ่าน 4.5:1+ สบายอยู่แล้ว มีแค่ default variant เดียวที่ borderline
- **ตัวเลือกที่ตัดทิ้ง:** แก้ `color.border.interactive` ให้เข้มขึ้นเพื่อผ่าน 3:1 เต็ม — ตัดทิ้งเพราะ token นี้ใช้ระดับระบบ (Button outline, Input, Checkbox, Switch ที่ผ่าน QA ไปแล้วใน Wave 2-3) แก้ตรงนี้จะกระทบทุก component ที่อ้างอิงย้อนหลัง โดยที่ปัญหาจริงอยู่แค่ context การใช้งานของ Toast เท่านั้น (แก้ context ถูกกว่าแก้ token กลาง)
- **กระทบ:** ไม่มีการเปลี่ยน token — เป็น judgment call ที่บันทึกไว้เพื่อไม่ต้อง relitigate ทีหลัง ถ้ามี component ใหม่ในอนาคตอยากใช้ `border.interactive` เป็น boundary จริงในบริบทที่ contrast ต่ำกว่า 3:1 ต้องกลับมาดู decision นี้ก่อนว่าเข้าเกณฑ์ที่ยอมรับได้หรือไม่

### D-020: ปฏิเสธ Portable Core retrofit จาก v14
- **วันที่:** 2026-08-08 · **Phase:** 3 (governance, หลัง Wave 4)
- **เลือก:** ไม่ retrofit ระบบ Dial ให้เป็น Portable Core / multi-framework-adapter ตาม pattern ของ v14 kit drop (packages/spec+conformance แยกจาก React, adapter บาง) แม้จะ merge ส่วนอื่นของ v14 ไปแล้ว (Reuse Check, contrast self-check, MCP note)
- **เพราะ:** ระบบเดินไปแล้ว 2 wave เต็มบน React ล้วน (Wave 1-2 ตอนตัดสินใจนี้) การรื้อโครงกลางทางจะเสียเวลามากกว่าที่ได้ประโยชน์คืนในระยะสั้น
- **ตัวเลือกที่ตัดทิ้ง:** retrofit ทันที (ปลอดภัยกว่าในระยะยาวถ้าต้องรองรับ framework อื่นจริง แต่ costly ตอนนี้)
- **กระทบ:** **สำคัญที่สุด — บันทึกต้นทุนของการเลื่อนไว้ชัดๆ** ถ้าอนาคตต้องรองรับ framework อื่น (Vue/Svelte/WC) ต้อง extract CSS/spec ออกจาก React ย้อนหลังทั้ง 39+ component ที่มีอยู่ ณ ตอนนั้น — ยิ่งเลื่อนนานยิ่งมี component มากขึ้นที่ต้อง extract ยิ่งแพงขึ้นเรื่อยๆ ไม่ใช่ cost คงที่

### D-021: ยอมรับ E-001 (accent bar contrast 2.99:1) พร้อมขอบเขตแคบสุด
- **วันที่:** 2026-08-08 · **Phase:** 3 (governance, หลัง Wave 4)
- **เลือก:** ยอมรับ exception E-001 ตามที่บันทึกใน EXCEPTIONS.md — ขอบเขต: ใช้ได้เฉพาะ decorative accent ที่ไม่ทำหน้าที่ boundary/state และมี cue อื่นที่ผ่านเกณฑ์อยู่ในบริเวณเดียวกันแล้ว
- **เพราะ:** อ้างอิง D-019 ที่ qa-a11y ตัดสินไปแล้ว — entry นี้คือการทำให้ decision เป็นทางการผ่าน EXCEPTIONS registry ตาม governance policy ใหม่ (ไม่ใช่ตัดสินใจใหม่ แค่ formalize สิ่งที่ตัดสินแล้ว)
- **ตัวเลือกที่ตัดทิ้ง:** แก้ token ให้ผ่าน 3:1 เต็ม (ตัดทิ้งด้วยเหตุผลเดียวกับ D-019 — token ใช้ระดับระบบ แก้จะกระทบ component อื่นที่ผ่าน QA แล้ว)
- **กระทบ:** เหมือน D-019 — ไม่มี token เปลี่ยน แค่ทำให้ decision นี้ query ได้จาก EXCEPTIONS.md แทนที่จะฝังอยู่ใน DECISIONS.md อย่างเดียว

### D-022: W5 scope — ยุบ Autocomplete เข้า Combobox เป็น mode/prop (ไม่ใช่ component แยก)
- **วันที่:** 2026-08-09 · **Phase:** 3 (ก่อนเริ่ม Wave 5)
- **เลือก:** ตัด Autocomplete ออกจาก catalog เป็น component เดี่ยว — รวมเข้า Combobox เป็น prop/mode เดียวกัน (ตาม ARIA spec: combobox + autocomplete คือ pattern เดียวกัน ต่างกันแค่ autocomplete behavior ของ input filtering) · catalog รวมทั้งระบบ 104 → 103
- **เพราะ:** user ชี้ตรงตาม ARIA Authoring Practices Guide — combobox widget มี `aria-autocomplete` เป็น attribute ของตัวมันเอง (none/list/both) ไม่ใช่ widget คนละตัว ทำแยกกันจะได้ 2 component ที่ API ซ้อนทับ 90% ต่างกันแค่ prop เดียว ตรงกับที่ Reuse Check (component-engineer.md ข้อ 0) ควรจับได้ตั้งแต่แรกถ้าทำ W5 แบบ auto-approve
- **ตัวเลือกที่ตัดทิ้ง:** ทำ Autocomplete แยกเป็น component อิสระ (ตามที่ catalog เดิมเขียนไว้) — ตัดทิ้งเพราะจะสร้าง pattern drift ทันทีที่ wave นี้เริ่ม (สองตัวที่ทำหน้าที่เดียวกันแต่คนละ API)
- **กระทบ:** `docs/CATALOG.md` ต้องอัพเดตจำนวนรวม (104→103) และรายชื่อ W5 (10→9 ตัว) · Combobox ต้อง design API ให้รองรับ `autocomplete: 'none'|'list'|'both'` ตั้งแต่ BATCH API REVIEW ของ wave นี้ ไม่ใช่เติมทีหลัง
