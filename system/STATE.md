# STATE — working memory ของ system นี้
- **System:** Pane (`pane-tokens`, `pane-react`) — spatial glass จาก anchor A (D-008): กระจกใส + หรี่ฉากหลัง (D-010/D-011) บนรูปถ่ายจริง
- **Phase ปัจจุบัน:** pilot ขยายเป็นหนังสือ 37 บท + 13 components, ธีม light/dark วัดทั้งคู่ (D-015)
- **งานล่าสุดที่เสร็จ:** playground ทุกหน้า foundation, copy คลิกเดียว, บท Themes & backdrops, ตาราง 2×2 ทุก component, status/history/limitations/a11y matrix จาก benchmark 10 DS · verify เขียว (2026-10-27)
- **งานถัดไป:** รอ user เลือกแบบ form (apps/lab/forms, A/B/C) → สร้าง W3 · derivation round ของ Button (ghost/danger/loading) · G-BT1 รายการหัวข้อ 9 หน้า foundation · ดู `NEXT.md`
- **Wave ปัจจุบัน:** pilot · **Component ผ่าน QA:** 13/13 (Alpha 1: Environment, Beta 12)
- **ค้าง/blocked:** — (ดู BACKLOG.md)
## Log ย่อ (ใหม่สุดบน ≤15 บรรทัด)
- 2026-10-27 ดึก: ทุก component (15 ตัว รวม Select/Slider ที่เพิ่งมีหน้า) เป็น 4 tab ถึงระดับ Carbon (G-K1–K8 เขียว), Style tab สร้างจาก kiln spec-capture, หนังสือ 101 หน้า: Getting started 5 หน้า, Foundations +Content/Accessibility, Patterns +12 (G-IA1 เขียว), nav แสดง catalog ที่ยังไม่ทำทั้งหมด · contrast ทุกหน้าใหม่ 0 fail, axe 0 · tone 96→ ที่เหลือคือ docstring Select (guard บล็อก) · บั๊กที่เจอระหว่างเขียน: control 32–36px ต่ำกว่า P6, opacity 0.5 ดิบ 4 ที่, Avatar ไม่มี forced-colours, Tabs ไม่มี hover → BACKLOG (แก้ตอน derivation round)
- 2026-10-27 0.2.0 พร้อมให้ project อื่นติดตั้ง (ยังไม่ publish — มือ user): consumer จริง (Vite + React 19 + TS 7) install จาก tarball → tsc strict 0 error, build ผ่าน, render ใน browser 12 components 0 console error · บั๊กที่จับได้: (1) `import 'pane-tokens/css'` แดงใน tsc ≥6 (TS2882) → ใส่ `types` ให้ CSS exports ทั้งสอง package + smoke check ใหม่ (gate-proof M6, smoke 20/20) (2) drawer เมนูบนมือถือเลื่อนไม่ได้ (`align-self: start` บน fixed box ทำให้สูงเท่าเนื้อหา) → link ล่างจอกดไม่ถึง (3) 4 check ใน conformance ชี้ selector เก่าก่อน D-016/D-017 → แก้ · conformance 74/74
- 2026-10-27 verify: glass 144,433/144,564 (131 excepted E-001, ทั้งหมดในธีม dark; light 0 fail ที่ 4.5:1) · conformance 73/73 (G-F1/C1/C2/T1/B1/L1/M1 gate-proofed) · tone 36/36 · smoke 19/19 · bug ที่จับได้: halo ขาวสืบทอดเข้า nested theme, Banner 3.57 → surface.well, ตัวอักษรบนรูปเป็น ink ในธีม light (1.38) → overlay pin dark
- 2026-10-26 กระจกบาง 0.46 + halo + E-001 (42 nodes 3.85–4.49), motion นุ่ม (token), docs → หนังสือ 26 บทตาม docs-engine content model: props generate (react-docgen-typescript), demo floor บังคับใน conformance (gate-proofed), bundle size esbuild, keyboard ผูก test
- 2026-10-26 บั๊กที่ evidence จับได้: class `.anchor` ของ heading ชนกับการ์ด anchor → การ์ดหลุดนอกจอ (x=-228)
- 2026-10-26 user: "เทามาเลย ไม่เบลอ ไม่ใส" → tint เทา .82 ทิ้ง, ใช้ backdrop brightness + รูป Unsplash 4 รูป; glass-sweep วัดทั้งหน้า → 0.36 ทุกรูป; verify: glass 11556/11556, conformance 28/28
- 2026-10-26 verify: tokens 201 (tier + collision gate) · lint 0/23 · barrel ok · tsc 0 · glass 11595/11595 text checks (4 scenes × 3 modes, harness + docs page) · conformance 28/28 · axe 0 (normal + forced-colors)
- 2026-10-26 gate proof: graphite.bright .82 → .5 = 1609 checks แดง; คืนค่า = เขียว
- 2026-10-26 จับได้ระหว่างทาง: surface.quiet .14 ยก backdrop ใต้ตัวขาว (4.25:1) → .08; kbd ring ทับกล่องตัวอักษร; caption/ตัวเลขบนรูปทับกัน; demo Environment วาง dim บนฉากสว่าง (docs ผิดกฎตัวเอง) → แยก tile ต่อฉาก
- 2026-10-26 build: CSS custom property ที่ชี้ var() resolve ที่ :root — env block ต้องประกาศ dependents ซ้ำ ไม่งั้น [data-environment] ไม่มีผลกับ --ds-card-bg (พิสูจน์ใน conformance: dim ≠ mid ≠ bright)
- 2026-10-26 D-008 anchor A (supersede D-002/D-004) · D-009 environment tint (agent ตัดสิน ตามคำสั่งไม่ถามซ้ำ)
