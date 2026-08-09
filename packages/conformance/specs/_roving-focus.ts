import { expect, type Page, type Locator } from '@playwright/test';

// Roving Focus Pattern helpers — role="option" (Listbox family: Listbox, Select, Combobox,
// MultiSelect, RadioCards, TagInput). ห้ามก๊อปไฟล์นี้ไปเขียนใหม่ที่ component อื่น — import ตรงๆ
// เสมอ ดู packages/conformance/specs/_patterns/roving-focus.md สำหรับเหตุผลและ ARIA contract เต็ม
//
// Menu/Dropdown, ContextMenu (role="menuitem") ใช้ behavior คนละสัญญา (Enter ปิดเมนูทันที,
// ไม่มี aria-selected ค้าง) — ห้ามใช้ helper พวกนี้กับ menuitem-pattern เด็ดขาด ดู README เดียวกัน

/** roving tabindex: มีแค่ 1 item ที่ tabindex="0" ในแต่ละเวลา ตัวอื่น tabindex="-1" ทั้งหมด */
export async function expectRovingTabindex(page: Page, items: Locator) {
  await items.first().waitFor({ state: 'visible' });
  const n = await items.count();
  expect(n, 'ต้องมี option มากกว่า 1 ตัวถึงพิสูจน์ roving tabindex ได้จริง').toBeGreaterThan(1);

  const tabindexes = await items.evaluateAll((els) =>
    els.map((el) => el.getAttribute('tabindex')),
  );
  const zeroCount = tabindexes.filter((t) => t === '0').length;
  expect(zeroCount, 'ต้องมี tabindex="0" เท่ากับ 1 ตัวเสมอ (ตัว active) ไม่ใช่ 0 หรือมากกว่า 1').toBe(1);
  const others = tabindexes.filter((t) => t !== '0');
  expect(
    others.every((t) => t === '-1'),
    'option ที่ไม่ active ทั้งหมดต้องมี tabindex="-1" (ไม่ใช่ absent หรือ "0")',
  ).toBe(true);
}

/**
 * Arrow Down/Up ย้าย active option จริง — default ไม่ wrap (สุดท้ายแล้ว Down ต่อ = ไม่ขยับ)
 * ตั้ง `wrap: true` เฉพาะ component ที่ออกแบบให้ wrap จริงและมีเหตุผลบันทึกไว้ที่เรียก
 */
export async function expectArrowNavigation(
  page: Page,
  items: Locator,
  opts: { wrap?: boolean; downKey?: string; upKey?: string } = {},
) {
  const { wrap = false, downKey = 'ArrowDown', upKey = 'ArrowUp' } = opts;
  await items.first().waitFor({ state: 'visible' });
  const n = await items.count();
  expect(n, 'ต้องมี option มากกว่า 1 ตัวถึงพิสูจน์ arrow navigation ได้จริง').toBeGreaterThan(1);

  await items.nth(0).focus();
  await page.keyboard.press(downKey);
  await expect(items.nth(1)).toBeFocused();

  // เดินไปตัวสุดท้าย
  for (let i = 1; i < n - 1; i++) {
    await page.keyboard.press(downKey);
  }
  await expect(items.nth(n - 1)).toBeFocused();

  // กด Down ต่อที่ตัวสุดท้าย
  await page.keyboard.press(downKey);
  if (wrap) {
    await expect(items.nth(0)).toBeFocused();
  } else {
    await expect(
      items.nth(n - 1),
      'ตัวสุดท้ายกด Down ต่อต้องไม่ขยับ (ห้าม wrap โดยไม่ตั้งใจ) — ถ้า component นี้ต้องการ wrap จริง ให้ผ่าน opts.wrap:true',
    ).toBeFocused();
  }

  // ทดสอบ Up ย้อนกลับจากตำแหน่งปัจจุบัน
  const beforeUp = wrap ? 0 : n - 1;
  await page.keyboard.press(upKey);
  const expectedAfterUp = wrap ? n - 1 : Math.max(0, beforeUp - 1);
  await expect(items.nth(expectedAfterUp)).toBeFocused();
}

/** Home/End กระโดดไป option แรก/สุดท้ายทันที (ไม่ใช่ไล่ทีละตัว) */
export async function expectHomeEnd(page: Page, items: Locator) {
  await items.first().waitFor({ state: 'visible' });
  const n = await items.count();
  expect(n, 'ต้องมี option มากกว่า 1 ตัวถึงพิสูจน์ Home/End ได้จริง').toBeGreaterThan(1);

  await items.nth(1).focus(); // เริ่มจากกลางๆ ไม่ใช่ปลายทางที่ Home/End จะพาไปอยู่แล้ว
  await page.keyboard.press('End');
  await expect(items.nth(n - 1)).toBeFocused();

  await page.keyboard.press('Home');
  await expect(items.nth(0)).toBeFocused();
}

/**
 * Typeahead: พิมพ์ตัวอักษร (ไม่กด modifier) กระโดดไป option แรกที่ label ขึ้นต้นด้วยตัวนั้น
 * `getLabel` ใช้ดึง text ของแต่ละ option มาเทียบ (default: textContent) เผื่อ component ใช้
 * aria-label หรือ data-attribute แทนก็ปรับ getLabel ได้โดยไม่ต้องแก้ helper
 */
export async function expectTypeahead(
  page: Page,
  items: Locator,
  key: string,
  expectedIndex: number,
) {
  await items.first().waitFor({ state: 'visible' });
  await items.nth(0).focus();
  await page.keyboard.press(key);
  await expect(items.nth(expectedIndex)).toBeFocused();
}

/**
 * Scroll-into-view: option ที่อยู่นอกจอ (ใน scroll container) ต้องเลื่อนให้เห็นเมื่อ arrow ไปถึง
 *
 * `focusTarget` (default: `el.focus()` ตรงๆ ผ่าน `evaluate`) คือวิธีที่ใช้ย้าย focus ไปที่
 * `targetItem` — ปรับพารามิเตอร์นี้ได้ถ้า behavior engine ของ component นั้นแยกแยะ "focus
 * modality" (React Aria's `useSelectableCollection` เป็นตัวอย่างจริงที่เจอ: มันเรียก
 * `scrollIntoViewport` เฉพาะตอน modality เป็น `'keyboard'` เท่านั้น — raw `el.focus()` ผ่าน
 * `evaluate()` ไม่ trigger scroll เลยเพราะไม่ใช่ event ที่เกิดจาก keydown จริง, ยืนยันด้วยการรันจริง
 * ตอนสร้าง Listbox: `el.focus()` ตรงๆ scrollTop คงที่ 0 แต่กด `End` (real keyboard event) แล้ว
 * scrollTop ขยับจริง) — ห้าม copy ทั้งฟังก์ชันไปแก้แยกตาม roving-focus.md "เมื่อไหร่ที่เขียนใหม่ได้"
 * ให้ผ่าน parameter นี้แทนเสมอ
 */
export async function expectScrollIntoView(
  page: Page,
  container: Locator,
  targetItem: Locator,
  opts: { focusTarget?: () => Promise<void> } = {},
) {
  const { focusTarget = () => targetItem.evaluate((el) => el.focus()) } = opts;
  const containerBox = await container.boundingBox();
  expect(containerBox, 'scroll container ต้องมี bounding box จริง').toBeTruthy();

  const before = await targetItem.boundingBox();
  const wasVisible =
    !!before &&
    before.y >= containerBox!.y &&
    before.y + before.height <= containerBox!.y + containerBox!.height;

  // ถ้า target มองเห็นอยู่แล้วก่อน scroll แปลว่า test นี้ไม่ได้พิสูจน์ scroll-into-view จริง
  expect(wasVisible, 'target item ต้องอยู่นอกจอก่อนเริ่ม ไม่งั้น test นี้ไม่ได้พิสูจน์ scroll behavior').toBe(false);

  await focusTarget();
  const after = await targetItem.boundingBox();
  expect(after, 'target item ต้องมี bounding box จริงหลัง focus').toBeTruthy();
  const nowVisible =
    after!.y >= containerBox!.y && after!.y + after!.height <= containerBox!.y + containerBox!.height;
  expect(nowVisible, 'target item ต้องเลื่อนเข้ามาในจอของ scroll container หลัง focus').toBe(true);
}

/**
 * Tab-out (roving-focus.md contract ข้อ 8): Tab จาก option ที่ active อยู่ต้องออกจาก widget ทั้งชุด
 * ไปยัง element ถัดไปในหน้า (`after`) — ไม่ใช่ไล่ไปที่ option ตัวถัดไป (นั่นคือหน้าที่ของ Arrow key
 * เท่านั้น) roving tabindex ที่ถูกต้อง (มี option แค่ 1 ตัวที่ tabindex="0" ตัวอื่น "-1") คือสิ่งที่
 * ทำให้ Tab ข้าม option ทั้งหมดไปเจอ `after` ในครั้งเดียว — ถ้า option หลายตัวมี tabindex="0" พร้อมกัน
 * (roving tabindex พัง) Tab จะไปเจอ option ตัวถัดไปก่อน ไม่ใช่ `after`
 *
 * เจตนาใช้ option ตัวกลาง (ไม่ใช่ตัวแรก) เป็นจุดเริ่ม active แล้วพิสูจน์ด้วย **round-trip**
 * (Tab ออก แล้ว Shift+Tab กลับเข้า) ต้องได้ option ตัวเดิม — นี่คือ assertion ที่พิสูจน์ roving-focus
 * "memory" จริง (มี option เดียวที่ tabindex="0" ค้างอยู่ที่ตัวที่ active ก่อนหน้า) การเช็คแค่ปลายทาง
 * ตอน Tab ออกอย่างเดียว (ไม่ round-trip, เริ่มจาก option ตัวแรกซึ่ง degenerate เกินไป) **พิสูจน์ไม่พอ**:
 * เคยเจอจริงว่า mutate ให้ทุก option มี `tabindex="0"` พร้อมกัน (roving tabindex พังเต็มๆ) ทำให้ Tab
 * แวะที่ option ตัวสุดท้ายของ DOM ก่อน (extra focus hop ที่ screen reader จะได้ยิน) แล้ว browser
 * default ค่อยพาไป `after` ต่อ — ปลายทางตอน forward-Tab ยังดูเหมือนถูก (`after` โฟกัสจริง) แต่พฤติกรรม
 * เสียไปแล้วจริงๆ — Shift+Tab กลับเข้ามาจะเผยว่าเสีย เพราะ landing ที่ option สุดท้ายของ DOM (memory
 * หาย) ไม่ใช่ option ตัวกลางที่เพิ่ง active อยู่ (memory ที่ถูกต้อง) — ดู Gate Proof log ใน
 * w5-listbox.spec.ts ข้อ 7 สำหรับหลักฐานการทดลองจริงในเบราว์เซอร์ (ไม่ใช่แค่อ่านซอร์ส React Aria)
 */
export async function expectTabOut(page: Page, items: Locator, after: Locator) {
  await items.first().waitFor({ state: 'visible' });
  const n = await items.count();
  expect(n, 'ต้องมี option มากกว่า 2 ตัวถึงเลือก "ตัวกลาง" ที่ไม่ degenerate ได้จริง').toBeGreaterThan(2);
  const midIndex = Math.floor(n / 2);
  const midItem = items.nth(midIndex);

  await midItem.click();
  await page.keyboard.press('Tab');
  await expect(
    after,
    'Tab จาก option ที่ active ต้องออกจาก widget ทั้งชุดไปยัง element ถัดไปในหน้าทันที ไม่ใช่ไปที่ option ตัวถัดไป',
  ).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(
    midItem,
    'Shift+Tab กลับเข้า widget ต้องคืน focus ให้ option ตัวที่ active ก่อนหน้า (roving-tabindex memory) ' +
      'ไม่ใช่ option ตัวแรก/ตัวสุดท้ายของ DOM เฉยๆ — ถ้า landing ผิดตัว แสดงว่า roving tabindex พังจริง ' +
      'แม้ forward-Tab ปลายทางจะดูถูกก็ตาม',
  ).toBeFocused();
}

/** aria-selected sync กับ state จริง — ไม่ใช่แค่ CSS class ที่มองด้วยตาเหมือนเลือกอยู่ */
export async function expectAriaSelectedSync(
  item: Locator,
  select: () => Promise<void>,
) {
  await expect(item).toHaveAttribute('aria-selected', 'false');
  await select();
  await expect(item).toHaveAttribute('aria-selected', 'true');
}
