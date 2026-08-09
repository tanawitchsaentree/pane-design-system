# STATE — working memory ของ system นี้
- **System:** Dial (`@dial/tokens`, `@dial/react`)
- **Phase ปัจจุบัน:** 3 (Layout + Atoms + Forms + Overlays) — Wave 1-4 ปิดครบ (39/103 components, catalog ปรับ 104→103 จาก D-022) + hardening-1 + w5-preflight (4 เงื่อนไข) + **code review pass เสร็จ, ปิด follow-up ครบ** → เริ่ม W5 ที่ Listbox
- **งานล่าสุดที่เสร็จ:** Code review (3 subagent คู่ขนาน: code correctness / spec docs accuracy / cross-file consistency) หลัง w5-preflight เจอ finding จริง 1 จุด critical + ปิด 3 ข้อที่ user สั่งเพิ่ม:
  - **[CRITICAL, แก้แล้ว] lint v3 มีช่องโหว่จริง:** property-name list (`SIZING`/`SPACING`/`OTHER`) มีแค่ bare name — `padding-inline-start:`, `border-inline-end-width:`, `inset-block-end:` ไม่ match เพราะหลังคำ base ไม่ใช่ `:` ทันที เนื่องจากกฎเหล็กบังคับ logical properties เท่านั้น แปลว่า raw-value ส่วนใหญ่ในโค้ดจริงหลุด regex ไปเงียบๆ ทั้งหมด — **แก้เป็น v4**: เพิ่ม `LOGICAL_SUFFIXES` ให้ margin/padding/inset ครบ 4 edge + border-{edge}-{width/style/color} · verify เอง 3 ชั้น: (1) สร้างไฟล์ทดสอบยืนยันจับ 3 case ที่เคยหลุดได้จริง (2) สแกนทั้งระบบ 197 ไฟล์ = 0 false positive ใหม่ (โค้ดจริงใช้ var(--ds-*) อยู่แล้วทุกที่) (3) mutate โค้ดจริงชั่วคราวแล้ว revert เพื่อพิสูจน์ regression-catch จริง
  - **[ปิดตามคำสั่ง] warning 2 จุดค้าง → 0/0 จริง:** เพิ่ม conformance test ใหม่ใน `w3-forms.spec.ts` ("Switch track (checked) และ Radio dot (disabled+checked)...กันบั๊กเปราะจาก rule reorder") ที่ proof จริงว่า fail เมื่อ mutate โค้ด (ลบ border แล้ว test แดงจริง, revert แล้วเขียว) → ใส่ suppression comment (`no-hardcode-ok`) แบบ inline ติดกับบรรทัดที่ flag พร้อมอ้าง spec file ชื่อจริง — lint ตอนนี้ 0 error/0 warning
  - **[ปิดตามคำสั่ง] Popover multi-axis corner case → TODO ที่ผูกกับ Menu:** เขียน TODO block ใน `w4-popover-positioning.spec.ts` หัวไฟล์ ผูกชัดกับ "W5 — Menu/Dropdown, ContextMenu" ระบุ 3 กรณีที่ยังไม่ครอบคลุม (multi-axis, nested submenu, content-taller-than-viewport) + sync ไว้ใน STATE.md นี้ (ดูบรรทัด "งานถัดไป" ด้านล่าง — ต้องทำก่อนถือว่า Menu positioning "verified")
  - Spec docs review (สุ่ม 12/39 ไฟล์): ผ่านหมด ไม่มีการเดา ตรงกับ source code จริงทุกจุดรวมตัวเลข contrast ละเอียดใน toast.md — ไม่ต้องแก้
  - Cross-file consistency review: เจอ STATE.md เก่าขัดกันเอง (บอกว่า "ยังไม่ commit" ทั้งที่ commit ไปแล้ว) + README.md ค้างเลข 108 เดิม (ต้อง 103) + STATE.md เก่าอ้าง "12 spec files" ผิด (จริง 9 `.spec.ts` + 2 helper) — **แก้ไฟล์นี้ (STATE.md) ให้ตรงแล้ว, README.md ยังไม่แก้ (ดูงานถัดไป)**
- **งานถัดไป:**
  1. แก้ `README.md:43` เลข "108 ตัว/10 waves" → "103 ตัว" (ค้างจาก D-017/D-022 — ยังไม่ทำ)
  2. **เริ่ม W5 ที่ Listbox ก่อนเสมอ** — เขียน `packages/conformance/specs/_patterns/roving-focus.md` (หรือ shared helper จริงที่ import ใช้ร่วมกัน ไม่ใช่ให้ตัวอื่นก๊อป) เป็นแม่แบบก่อนตัดโค้ด Listbox — บทเรียนจาก VisuallyHidden clip-pattern ที่ก๊อปกัน 5 ที่: การเลียนแบบไม่มีต้นฉบับชี้ได้ = drift ทุกครั้ง
  3. Listbox conformance ต้องครบ: roving focus+Home/End, typeahead, scroll-into-view (option นอกจอ), Escape+focus-restore+Tab-out, `role="option"` (ไม่ใช่ menuitem — คนละ keyboard contract, ห้าม Menu ยืมฐาน Listbox)
  4. **CHECKPOINT พิเศษ (นอกกติกา wave ปกติ):** พอ Listbox เสร็จ+ผ่าน QA+conformance เขียว → **หยุดรายงาน รอ user ตรวจแม่แบบก่อน** ห้ามไหลไป Select ทันที เพราะ Listbox เป็นแม่แบบของอีก 6 ตัวใน wave นี้ ถ้าเพี้ยนจะคูณ 7
  5. Menu/Dropdown, ContextMenu: `role="menuitem"` แยกฐานจาก Listbox เด็ดขาด + ContextMenu ต้องมี keyboard trigger (Shift+F10/Menu key) ไม่ใช่แค่ right-click + ต้องเขียน `w5-menu-positioning.spec.ts` ปิด TODO ข้อ 3 ก่อนถือว่า Menu positioning verified (ดู TODO ใน `w4-popover-positioning.spec.ts`)
  - หลัง Listbox เสร็จ ไม่ต้องขอไฟเขียวซ้ำสำหรับตัวอื่นใน wave (user บอก "วิ่งยาวได้ตามเดิม เจอ stop condition ค่อยหยุดถาม") — checkpoint นี้จำกัดแค่ Listbox ตัวเดียว
- **System Sheet:** `system/sheets/sheet-2026-08-08.png` (ล่าสุด, แสดง "AA · 1 exception") · archive: `sheet-2026-08-08-wave{1,2,3,4}.png`, `sheet-2026-08-08-phase2.png` — ยังไม่ refresh หลัง hardening-1/w5-preflight/review-fixes (ไม่มี component ใหม่ ไม่กระทบภาพรวม)
- **Storybook:** ติดตั้งแล้วที่ `apps/storybook/` — เปิดดู interactive ด้วย `pnpm storybook` (dev server localhost:6006)
- **Conformance:** `packages/conformance/specs/` — 9 ไฟล์ `.spec.ts` จริง (contrast-inputgroup-pininput, w2-atoms, w3-checkbox-indeterminate, w3-forms, w4-drawer, w4-overlays, w4-popover-positioning, w4-popover, w4-tooltip) + 2 helper (`_helpers.ts`, `_contrast.ts`) — รัน `cd packages/conformance && npx playwright test`
- **Git:** commits ครบถึง `aa512df` (w5-preflight) — tags `wave-1`..`wave-4`, `hardening-1`, `w5-preflight` — review-fix รอบนี้ (lint v4 + cascade-guard test + Popover TODO) ยังไม่ commit — **A1 (git remote + push) ยังเลื่อนตาม user — local-only**
- **Wave ปัจจุบัน:** — (ระหว่าง review-fix ปิดกับ W5/Listbox เริ่ม) · **Component ผ่าน QA:** 39/103 (Wave 1: 10 layout · Wave 2: 12 atoms · Wave 3: 11 forms · Wave 4: 6 overlays)
- **ค้าง/blocked:** README.md เลขรวม component ยังค้าง 108 (ไม่ block งาน แค่ตกหล่น — แก้พร้อม commit รอบนี้)
## Log ย่อ (ใหม่สุดบน ≤15 บรรทัด)
- 2026-08-09 Code review pass: เจอ+แก้ lint v3→v4 (critical: logical property regex hole), ปิด warning 2 จุดด้วย cascade-guard test จริง, Popover corner-case → TODO ผูก Menu, พบ+จะแก้ README เลขค้าง
- 2026-08-09 W5-preflight เสร็จครบ 4 เงื่อนไข: D-022 (Autocomplete→Combobox), lint bg-only+comment-strip, contrast checker (InputGroup/PinInput verified), Popover positioning verify (ไม่พบบั๊ก)
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
