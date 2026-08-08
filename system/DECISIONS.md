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
