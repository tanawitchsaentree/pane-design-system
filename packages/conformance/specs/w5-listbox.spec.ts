import { test, expect } from '@playwright/test';
import { story, expectHitArea } from './_helpers';
import {
  expectRovingTabindex,
  expectArrowNavigation,
  expectHomeEnd,
  expectTypeahead,
  expectScrollIntoView,
  expectAriaSelectedSync,
  expectTabOut,
} from './_roving-focus';

// W5 (Selection/Listbox) — this is the FIRST real-browser proof that the Roving Focus Pattern
// helpers in `_roving-focus.ts` (written ahead of any component, per user instruction) actually
// catch what they claim to catch. Every helper imported above is the literal function from that
// file — none re-implemented here — so a green run of this spec is the Gate Proof for those
// helpers as much as it is a pass for Listbox itself. Listbox is also the template for the rest
// of W5 (Select/Combobox/MultiSelect/RadioCards/TagInput): every one of those reuses these same
// six helpers against their own option markup once built.
//
// Honesty Rule: jsdom cannot prove any of roving-tabindex-after-Arrow-key, Home/End jump,
// typeahead, scroll-into-view, or real hit-area geometry — that's why every assertion below runs
// only here (Playwright, real browser), never in Listbox.test.tsx (Vitest/jsdom).

test('Listbox: roving tabindex ถูกต้องหลังคลิก option (ตัวหนึ่ง tabindex=0 เท่านั้น)', async ({ page }) => {
  await page.goto(story('selection-listbox--default'));
  const options = page.getByRole('option');
  // ต้อง trigger focus เข้า option ก่อน (bootstrap state ของ root คือ tabindex=0, option ทั้งหมด
  // -1 — ดู Listbox.tsx module doc) ไม่งั้น expectRovingTabindex จะเจอ 0 ตัวที่ tabindex="0"
  await options.first().click();
  await expectRovingTabindex(page, options);
});

test('Listbox: Arrow Down/Up ย้าย active option จริง ไม่ wrap', async ({ page }) => {
  await page.goto(story('selection-listbox--default'));
  const options = page.getByRole('option');
  await expectArrowNavigation(page, options, { wrap: false });
});

test('Listbox: Home/End กระโดดไป option แรก/สุดท้ายทันที', async ({ page }) => {
  await page.goto(story('selection-listbox--default'));
  const options = page.getByRole('option');
  await expectHomeEnd(page, options);
});

test('Listbox: typeahead พิมพ์ตัวอักษรกระโดดไป option ที่ label ขึ้นต้นด้วยตัวนั้น', async ({ page }) => {
  await page.goto(story('selection-listbox--scrollable'));
  const options = page.getByRole('option');
  // Scrollable story: Apple(0) Banana(1) Cherry(2) ... Zucchini(25) — พิมพ์ "z" จาก option แรกต้อง
  // กระโดดไป Zucchini (index 25) ตัวเดียวที่ label ขึ้นต้นด้วย Z
  await expectTypeahead(page, options, 'z', 25);
});

test('Listbox: scroll-into-view เลื่อน option นอกจอเข้ามาให้เห็นเมื่อ focus ไปถึง', async ({ page }) => {
  await page.goto(story('selection-listbox--scrollable'));
  const container = page.getByRole('listbox');
  const options = page.getByRole('option');
  const first = options.first();
  const last = options.last();
  // ต้องย้าย focus ด้วย real keyboard event (`End`) ไม่ใช่ raw `el.focus()` — ตรวจสอบแล้วว่า React
  // Aria's `useSelectableCollection` เรียก `scrollIntoViewport` เฉพาะตอน focus modality เป็น
  // 'keyboard' เท่านั้น (ดู `expectScrollIntoView`'s `focusTarget` doc ใน _roving-focus.ts) —
  // เริ่มจาก option แรกก่อนเพื่อให้ modality เป็น keyboard ตั้งแต่ต้น แล้วกด End กระโดดไปตัวสุดท้าย
  await first.click();
  await expectScrollIntoView(page, container, last, {
    focusTarget: () => page.keyboard.press('End'),
  });
});

test('Listbox: aria-selected sync กับ selection state จริง (ไม่ใช่แค่ CSS class)', async ({ page }) => {
  await page.goto(story('selection-listbox--default'));
  const apple = page.getByRole('option', { name: 'Apple' });
  await expectAriaSelectedSync(apple, () => apple.click());
});

test('Listbox: hit area ของแต่ละ option >= 40px (D-002 web-first minimum)', async ({ page }) => {
  await page.goto(story('selection-listbox--default'));
  const options = page.getByRole('option');
  await options.first().waitFor({ state: 'visible' });
  const n = await options.count();
  for (let i = 0; i < n; i++) {
    await expectHitArea(options.nth(i), 40);
  }
});

test('Listbox: Tab ออกจาก widget ทั้งชุดทันที ไม่ไล่ทีละ option (roving-focus.md contract ข้อ 8)', async ({ page }) => {
  await page.goto(story('selection-listbox--tab-out'));
  const options = page.getByRole('option');
  const after = page.getByRole('button', { name: 'After listbox' });
  await expectTabOut(page, options, after);
});

test('Listbox: selectionMode="multiple" — เลือกหลาย option ค้างพร้อมกันจริง (aria-selected ทุกตัวที่เลือก)', async ({ page }) => {
  await page.goto(story('selection-listbox--multiple'));
  const apple = page.getByRole('option', { name: 'Apple' });
  const banana = page.getByRole('option', { name: 'Banana' });
  // story นี้ default select แล้วคือ Apple+Cherry (ดู Listbox.stories.tsx) — คลิก Banana เพิ่มต้อง
  // ไม่ไปแทนที่ selection เดิม (ต่างจาก single-select)
  await expect(apple).toHaveAttribute('aria-selected', 'true');
  await banana.click();
  await expect(banana).toHaveAttribute('aria-selected', 'true');
  await expect(apple).toHaveAttribute('aria-selected', 'true');
});

// --- Gate Proof (ds-conventions/SKILL.md) — mutate ทุก helper ที่ import มาแล้ว confirm ว่าแดงได้
// จริงก่อนถือว่า helper เหล่านี้ใช้งานได้ ผลการ mutate-confirm-revert (รันมือ ไม่ใช่ automated เพราะ
// ต้อง mutate โค้ด component จริงชั่วคราว) บันทึกไว้ที่นี่เพื่อ reproduce ได้รอบหน้า:
//
// 1. expectRovingTabindex — ลบ `tabIndex` ออกจาก optionProps ชั่วคราวใน Option() (Listbox.tsx) ->
//    รันเทสต์นี้ -> แดงจริง ("ต้องมี tabindex="0" เท่ากับ 1 ตัวเสมอ") เพราะ React Aria's own
//    tabIndex ไม่ถูก spread เข้า DOM แล้ว -> คืนโค้ดกลับ -> เขียวอีกครั้ง (ยืนยันแล้ว)
// 2. expectArrowNavigation — เปลี่ยน downKey ที่เรียกเป็น 'ArrowRight' ชั่วคราวในไฟล์นี้ (component
//    ไม่รองรับ orientation="horizontal" ค่า default) -> รันเทสต์ -> แดงจริง (focus ไม่ขยับเพราะ
//    React Aria's default orientation คือ vertical, ArrowRight ไม่ทำอะไร) -> คืนกลับเป็น
//    ArrowDown/ArrowUp -> เขียวอีกครั้ง (ยืนยันแล้ว)
// 3. expectHomeEnd — เดียวกับข้อ 1 (ทั้งคู่พึ่ง tabIndex ที่ React Aria set ให้ ถ้าไม่มี tabIndex
//    focus() ของ Playwright locator ก็ยังโฟกัสได้ตรงๆ แต่ Home/End handler เองมาจาก
//    useSelectableCollection ซึ่งผูกกับ collectionProps บน root ไม่ใช่ per-option — ลบ
//    `{...listBoxProps}` ออกจาก root `<ul>` ชั่วคราว -> รันเทสต์ -> แดงจริง (ไม่มี Home/End handler
//    เลย, focus ไม่ขยับจาก option[1]) -> คืนกลับ -> เขียวอีกครั้ง (ยืนยันแล้ว)
// 4. expectTypeahead — เดียวกับข้อ 3 (typeahead มาจาก collectionProps เดียวกัน) — ลบ
//    `{...listBoxProps}` ออกจาก root -> แดงจริง (พิมพ์ "z" ไม่ขยับ focus เลย) -> คืนกลับ -> เขียว
// 5. expectScrollIntoView — เปลี่ยน `overflow-y: auto` เป็น `overflow-y: visible` ชั่วคราวใน
//    Listbox.module.css `.root` (ปิด scroll container จริง) -> รันเทสต์ -> แดงจริงที่ assertion
//    สุดท้าย ("target item ต้องเลื่อนเข้ามาในจอ ... หลัง focus") เพราะไม่มี scroll ให้เกิดขึ้นจริง
//    (initial "นอกจอ" assertion ยังผ่านอยู่เพราะ root ยัง fixed max-block-size ทำให้ layout ล้น
//    เหมือนเดิม แค่ scroll ไม่ทำงาน) -> คืนกลับเป็น `auto` -> เขียวอีกครั้ง (ยืนยันแล้ว) —
//    หมายเหตุเพิ่ม: helper ตัวนี้เจอบั๊กจริงระหว่าง
//    สร้าง component นี้เอง (ไม่ใช่ mutation ที่ตั้งใจ) — ค่า default เดิมของ `focusTarget` (raw
//    `el.focus()`) ไม่ trigger `scrollIntoViewport` เลยเพราะ React Aria เช็ค focus modality ==
//    'keyboard' ก่อนเสมอ ต้องเพิ่ม `opts.focusTarget` ให้ helper (ผ่าน parameter ใหม่ ไม่ fork
//    ฟังก์ชัน ตามกฎ roving-focus.md) แล้วเรียกด้วย `page.keyboard.press('End')` ในเทสต์นี้จึงเขียว —
//    ยืนยันด้วยการรันจริงทั้งสองแบบ (`el.focus()` -> scrollTop คงที่ 0 -> แดง, `keyboard.press` ->
//    scrollTop ขยับจริง -> เขียว) ก่อนแก้
// 6. expectAriaSelectedSync — เปลี่ยน optionProps ให้ไม่ spread `aria-selected` (comment ทิ้งไว้
//    ชั่วคราวใน Option()) -> รันเทสต์ -> แดงจริง (attribute หายไปทั้งหมด, `toHaveAttribute`
//    fail ตั้งแต่ก่อน select ด้วยซ้ำ) -> คืนกลับ -> เขียวอีกครั้ง (ยืนยันแล้ว)
// 7. expectTabOut (เพิ่มทีหลัง จาก qa-a11y finding — roving-focus.md contract ข้อ 8 ไม่มี test มา
//    ก่อนหน้านี้) — เวอร์ชันแรกของ helper (เช็คแค่ปลายทาง forward-Tab อย่างเดียว, เริ่มจาก option ตัว
//    แรกซึ่ง degenerate) mutate เดี่ยว 2 แบบไม่แดงทั้งคู่ — user สั่งให้เคลียร์ให้จบว่าเป็น "redundancy
//    จริง" หรือ "test อ่อน" ด้วยการเปิดเบราว์เซอร์จริงดู ไม่ใช่อ่านซอร์ส (ดู debug spec ที่รันแล้วลบทิ้ง
//    ใน conversation — สรุปผลจริงที่พิสูจน์ได้ด้านล่าง):
//
//    (a) `tabIndex={0}` ลงทุก option — สืบด้วย focusin event log จริงในเบราว์เซอร์: forward-Tab แวะที่
//    option ตัวสุดท้ายของ DOM (Elderberry) ก่อนไปถึง `after` จริง (extra focus hop ที่ screen reader
//    จะประกาศ) และ Shift+Tab กลับเข้ามาหลัง Tab ออกไปจาก option ตัวกลาง (Cherry) landing ผิดที่
//    (Elderberry แทน Cherry) — **นี่คือ degradation จริง ไม่ใช่ redundancy** ปลายทาง forward-Tab เดิม
//    ที่เช็คแค่ "`after` โฟกัสจริงไหม" ผ่านได้เพราะเป็น assertion ที่อ่อนเกินไป ไม่ใช่เพราะพฤติกรรมถูก
//    100% → **แก้ helper แล้ว**: เปลี่ยนมาเช็ค option ตัวกลาง (ไม่ใช่ตัวแรก, กัน degenerate) + เพิ่ม
//    round-trip assertion (Shift+Tab กลับเข้าต้อง landing ที่ option ตัวเดิมที่ active ก่อน Tab ออก —
//    นี่คือสิ่งที่พิสูจน์ roving-tabindex "memory" จริง) — mutate (a) เดี่ยวๆ กับ helper ใหม่ →
//    **แดงจริงแล้ว** ("Shift+Tab กลับเข้า widget ต้องคืน focus ให้ option ตัวที่ active ก่อนหน้า...")
//
//    (b) ลบ `{...listBoxProps}` ออกจาก root เฉยๆ — สืบด้วย focus log เดียวกัน: forward-Tab ออกจาก
//    widget ถูกต้องจริง (ไม่มี extra hop) และ Shift+Tab กลับเข้ามา landing ที่ option[0] (Apple) ซึ่ง
//    ก็คือตัวที่ active อยู่จริง (เพราะ mutation นี้ทำให้ Arrow-key navigation พังไปแล้วตั้งแต่ก่อน Tab
//    — active ค้างที่ option[0] ตลอด ไม่เคยขยับไป Cherry) — **นี่คือ redundancy จริง**: ชั้นที่ cover
//    คือ `optionProps` (จาก `useOption`, ตั้ง roving tabindex ต่อ option โดยตรง) ทำหน้าที่ทดแทน
//    `listBoxProps`'s tab-handler ได้เพียงพอสำหรับ invariant ที่ helper นี้พิสูจน์ — แต่ mutation (b)
//    เพียงอย่างเดียวถูกจับได้แล้วโดย test อื่น (ข้อ 3/4 expectHomeEnd/expectTypeahead ซึ่งพึ่ง
//    `collectionProps` บน root เหมือนกัน) ไม่ใช่ blind spot ที่ไม่มี test คลุมเลย — mutate (b) เดี่ยวๆ
//    กับ helper ใหม่ → ยังเขียวถูกต้อง (ไม่ false-negative เพราะเป็น redundancy จริง ไม่ใช่ helper อ่อน)
//
//    Layer map: `optionProps` (per-option tabindex, จาก useOption) เพียงพอเองสำหรับ Tab-out invariant
//    พื้นฐาน — `listBoxProps`'s tab handler (จาก useSelectableCollection) เป็น extra safety net ที่
//    ป้องกัน edge case ของ nested-tabbable-children ใน collection (ไม่เกิดกับ Listbox เพราะ option ไม่
//    มี tabbable child) → Tab-out ของ Listbox โดยเฉพาะพึ่ง `optionProps` เป็นหลัก ไม่ใช่ `listBoxProps`
//
//    Mutate ทั้งคู่พร้อมกัน (`tabIndex={0}` ทุก option + ลบ `{...listBoxProps}`) → แดงจริง (เหมือนเดิม)
//    -> revert ทั้งคู่ -> เขียวอีกครั้ง (ยืนยันแล้ว, รันซ้ำหลังแก้ helper)
//
//    บทเรียน (ตามที่ user สั่งให้ codify เป็น Gate Proof Rule เพิ่ม): helper ที่ครอบพฤติกรรมซึ่งมีหลาย
//    ชั้น cover กัน (compound invariant) ต้อง mutate **ทั้งเดี่ยวและรวม** แล้วสำหรับทุกกรณีที่ mutation
//    เดี่ยวไม่แดง ต้อง**เปิดดูจริง**ว่าพฤติกรรมยังถูก 100% (= redundancy, บันทึก layer map) หรือเสีย
//    บางส่วนแต่ assertion จับไม่ได้ (= test อ่อน, ต้องเพิ่ม assertion) — "ไม่แดงตอน mutate เดี่ยว" ไม่ใช่
//    ข้อสรุปที่ปลอดภัยจะปิดเคสได้เองโดยไม่ตรวจ ดู ds-conventions/SKILL.md Gate Proof Rule (compound
//    invariant clause) สำหรับกฎเวอร์ชันทั่วไป
