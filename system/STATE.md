# STATE — working memory ของ system นี้
- **System:** Dial (`@dial/tokens`, `@dial/react`)
- **Phase ปัจจุบัน:** 3 (Layout + Atoms + Forms + Overlays) — Wave 1-4 ปิดครบ (39/103 components, catalog ปรับ 104→103 จาก D-022) + hardening-1 + **ไฟเขียว W5 พร้อม 4 เงื่อนไขทำครบแล้ว** → พร้อมเริ่ม W5 Selection จริง
- **งานล่าสุดที่เสร็จ:** 4 เงื่อนไขก่อน W5 (ตามที่ user ให้ไฟเขียวแบบมีเงื่อนไข):
  1. **D-022:** ยุบ Autocomplete เข้า Combobox เป็น `aria-autocomplete` mode (none/list/both) ตาม ARIA spec — catalog 104→103, W5 เหลือ 9 ตัว
  2. **Lint bug-class:** เพิ่ม comment-stripping (แก้ false-positive จาก docstring/comment ที่เคยพลาด) + เพิ่ม warning rule จับ "background-color-only visual indicator ไม่มี border" (จับได้จริงกับไฟล์ทดสอบ, ไม่ fail build เพราะ heuristic ไม่ใช่ full parser) + Checkbox/Radio/Switch เปลี่ยนมา `composes: visuallyHidden from VisuallyHidden.module.css` จริง (verify แล้วว่า cross-file compose ทำงานทั้ง dev/build จริง ไม่ duplicate CSS) + Spinner import `<VisuallyHidden>` ตรง — บั๊ก forced-colors ของ Switch thumb/Radio dot พบว่าแก้ไปแล้วในรอบ hardening-1
  3. **Automated contrast checker:** เพิ่ม `packages/conformance/specs/_contrast.ts` (WCAG math จริง) + `contrast-inputgroup-pininput.spec.ts` ที่อ่าน `getComputedStyle()` จริงในเบราว์เซอร์ (ไม่ใช่จาก token file) — วัดได้ตรงกับตัวเลขที่เคย manual-calculate ไว้ (คลาดกัน <0.01) → อัพ InputGroup/PinInput จาก `UNVERIFIED:` เป็น verified จริงแล้ว
  4. **Popover positioning:** เพิ่ม `w4-popover-positioning.spec.ts` verify collision detection + flip จริงในเบราว์เศจร์ (baseline no-flip, bottom-edge→flip-top, right-edge→flip-left, ไม่ overflow viewport) — **ไม่พบบั๊ก** Popover ใช้งานเป็น base ของ W5 ได้ปลอดภัย (ข้อสังเกต: multi-axis corner case เช่น Menu ซ้อน submenu ยังไม่ครอบคลุม ต้องมี spec เฉพาะตอนสร้างจริง)
  - ยืนยันเองซ้ำทุกข้อ: lint 0 error/2 warning (ทั้ง 2 เป็น false-positive จาก CSS cascade ข้าม rule block, verify ด้วย conformance ว่า render ถูกจริง), tsc 0 error, vitest 268/268, playwright 79 passed/5 skipped (chromium+forced-colors+reduced-motion)
- **งานถัดไป:** commit 4 เงื่อนไข + tag `w5-preflight` → **เริ่ม W5 จริงที่ Listbox ก่อนเสมอ** (ตามคำสั่ง user) → ให้ conformance spec ของ Listbox เป็น "แม่แบบ" ของทุกตัวที่มี roving focus ในเวฟนี้ — ทุกตัวใน W5 ต้องมี conformance spec ตั้งแต่วันแรก (roving focus+Home/End, typeahead, scroll-into-view, Escape+focus-restore+Tab-out, ARIA role ให้ตรง pattern — Listbox/Select/Combobox=role=option, Menu/ContextMenu=role=menuitem คนละ keyboard contract, ContextMenu ต้องมี keyboard trigger Shift+F10/Menu key ไม่ใช่แค่ right-click)
- **System Sheet:** `system/sheets/sheet-2026-08-08.png` (ล่าสุด, แสดง "AA · 1 exception") · archive: `sheet-2026-08-08-wave{1,2,3,4}.png`, `sheet-2026-08-08-phase2.png` — ยังไม่ refresh หลัง 4 เงื่อนไขนี้ (ไม่มี component ใหม่ ไม่กระทบภาพรวม เป็น hardening ไม่ใช่ wave)
- **Storybook:** ติดตั้งแล้วที่ `apps/storybook/` — เปิดดู interactive ด้วย `pnpm storybook` (dev server localhost:6006)
- **Conformance:** `packages/conformance/` — 12 spec files ครอบคลุม W1-W4 + contrast checker + popover positioning — รัน `cd packages/conformance && npx playwright test`
- **Git:** commits ครบถึง `2a864d4` (hardening-1) — tags `wave-1`..`wave-4`, `hardening-1` — 4 เงื่อนไข W5-preflight ยังไม่ commit (กำลังจะ commit) — **A1 (git remote + push) ยังเลื่อนตาม user — local-only**
- **Wave ปัจจุบัน:** — (ระหว่าง preflight ปิดกับ W5 เริ่ม) · **Component ผ่าน QA:** 39/103 (Wave 1: 10 layout · Wave 2: 12 atoms · Wave 3: 11 forms · Wave 4: 6 overlays)
- **ค้าง/blocked:** ไม่มี — พร้อมเริ่ม W5 ที่ Listbox
## Log ย่อ (ใหม่สุดบน ≤15 บรรทัด)
- 2026-08-09 W5-preflight เสร็จครบ 4 เงื่อนไข: D-022 (Autocomplete→Combobox), lint bg-only+comment-strip, contrast checker (InputGroup/PinInput verified), Popover positioning verify (ไม่พบบั๊ก) — พร้อมเริ่ม W5 ที่ Listbox
- 2026-08-08 Hardening pass เสร็จสมบูรณ์: lint v2 (6 regression แก้), conformance เขียว (86/86, เจอ 2 บั๊กจริง forced-colors), honesty audit (5 claim แก้), docs 39/39, governance (EXCEPTIONS.md+D-020/D-021), rule upgrade E1-E3
- 2026-08-08 Wave 4 ผ่าน QA ตั้งแต่รอบแรก (0 fix round) — Radix behavior, motion verified, 1 borderline contrast ตัดสินยอมรับได้
- 2026-08-08 D-017/D-018: scope W4=web overlays (ตัด mobile-only), auto-approve API
- 2026-08-08 ปิด WAVE REPORT W3: commit 35e5735 + tag wave-3, system-sheet refresh (เพิ่ม Wave 3 preview)
- 2026-08-08 Wave 3 ผ่าน QA: D-016 แก้ 4 finding (switch travel, hit-area, formfield ref, radio comment) รอบเดียว, contrast self-check (D-015) ป้องกัน contrast finding ได้จริง
- 2026-08-08 merge v14: Reuse Check + contrast self-check บังคับ + Storybook MCP note (เลือกเฉพาะส่วนที่ไม่ต้อง retrofit React)
- 2026-08-08 ปิด WAVE REPORT W2: commit 010158e + tag wave-2, system-sheet refresh (เพิ่ม Wave 2 preview), แก้ .gitignore (dist/ หลุดเข้า git)
- 2026-08-08 qa-a11y รอบ 2: PASS ทั้ง 5 finding ของ D-014 (คำนวณ contrast ใหม่เอง ไม่มี regression)
- 2026-08-08 D-014: แก้ 5 blocking QA findings ของ W2 (badge solid text, button outline border, button danger + link primary contrast, prefers-contrast media query) — lint/build/test/tsc ผ่านหมด
- 2026-08-08 D-013: auto-approve W2 API (ข้าม batch review)
- 2026-08-08 ปิด WAVE REPORT W1: git init+commit+tag wave-1, system-sheet refresh (เพิ่ม Wave 1 preview)
- 2026-08-08 Storybook ติดตั้งจริงที่ apps/storybook/ ผูก token CSS จริง build-storybook ผ่าน
- 2026-08-08 Wave 1 (10 layout primitives) ผ่าน QA เต็มรูปแบบ (แก้ 2 findings: Divider border, Box/Container logical props)
- 2026-08-08 Wave 1 เขียนโค้ดจริงเสร็จ: lint/typecheck/test/build ผ่านหมด
- 2026-08-08 Phase 2 เสร็จ: token-architect ส่ง DTCG 3 ชั้น + Style Dictionary build จริง + token preview
- 2026-08-08 D-011: ชื่อ system/package = Dial
- 2026-08-08 D-010: density baseline = comfortable
- 2026-08-08 D-009: motion = default blueprint (ไม่มีหลักฐานให้บิด)
- 2026-08-08 D-008: radius soft-round + ไม่มี decorative shadow (hairline แทน) + recipe ใหม่ braun-flat.md
- 2026-08-08 D-007: grid/breakpoints = default, lg เป็น anchor ตาม D-002
- 2026-08-08 D-006: color = warm neutral ramp จาก cream + accent orange สงวนจุดเดียว
- 2026-08-08 D-005: typography base16 ratio แบน 1.2, font เดียวทั้ง heading/body
- 2026-08-08 D-004: sizing scale — control height หนาแบบ Braun (md=48)
- 2026-08-08 D-003: spacing base unit = 8px
- 2026-08-08 D-002: platform = web-first
- 2026-08-08 D-001: style = Braun-derived ล้วน (ทางเลือก ก. จาก 3 ref ที่ user ให้)
