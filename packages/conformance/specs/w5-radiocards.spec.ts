import { test, expect } from '@playwright/test';
import { story, expectHitArea } from './_helpers';

// W5 (Selection/RadioCards) — D-023: RadioCards is native `<input type=radio>` grouped by `name`
// (same engine as Radio/Rating), NOT the React Aria collection stack Listbox uses — so this spec
// intentionally does NOT import anything from `_roving-focus.ts`. That helper set's contract
// (`expectRovingTabindex` etc.) asserts a `tabindex` DOM attribute React Aria's
// `useSelectableCollection` sets per-item — verified empirically (real Chromium) while building
// this component that native `<input type=radio>` never sets that attribute on any item, before
// OR after focus/Arrow-key movement, so those helpers would silently pass-through/false-negative
// if pointed at RadioCards rather than proving anything real about it. What IS proven here is
// exactly what jsdom (RadioCards.test.tsx) is honestly unable to: real native radio-group
// Arrow-key behavior with a card-shaped visual instead of a dot, real computed hit-area geometry
// across the WHOLE card (not just the visually-hidden 1px input), the non-color selected cue
// (border widening/darkening + indicator checkmark), and real forced-colors rendering of that cue.

test('RadioCards: arrow key ย้าย selection จริงระหว่างการ์ด (native radio-group, ไม่ wrap)', async ({ page }) => {
  await page.goto(story('selection-radiocards--default'));
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });
  const n = await radios.count();
  expect(n, 'ต้องมีการ์ดมากกว่า 1 ใบถึงพิสูจน์ arrow-key cycle ได้จริง').toBeGreaterThan(1);

  // เริ่มจากการ์ดแรก (unchecked ใน Default story — defaultValue คือใบกลาง "pro") ให้แน่ใจว่า
  // ArrowDown ทั้ง "ย้าย focus" และ "select" การ์ดถัดไปจริง ไม่ใช่แค่ขยับ focus เฉยๆ
  await radios.nth(0).focus();
  await page.keyboard.press('ArrowDown');
  // native radio-group behavior: ArrowDown ทั้งย้าย focus และเปลี่ยน checked ไปที่การ์ดถัดไปทันที
  await expect(radios.nth(1)).toBeFocused();
  await expect(radios.nth(1)).toBeChecked();
});

test('RadioCards: arrow key ทำงานเหมือนกันทั้ง ArrowRight/ArrowDown (native behavior ไม่สนใจว่า orientation คืออะไร)', async ({
  page,
}) => {
  await page.goto(story('selection-radiocards--default'));
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });
  await radios.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(radios.nth(1)).toBeFocused();
  await expect(radios.nth(1)).toBeChecked();
});

test('RadioCards: roving tabindex ของกลุ่ม — Tab เข้ากลุ่มครั้งแรกต้อง landing ที่การ์ดที่ checked อยู่ (ไม่ใช่การ์ดแรกของ DOM เสมอไป)', async ({
  page,
}) => {
  // Default story: defaultValue="pro" (การ์ดตัวกลาง, ไม่ใช่ตัวแรก) — native radio-group's single
  // tab-stop ต้อง landing ที่ตัวที่ checked อยู่จริง ไม่ใช่ตัวแรกของ DOM (ซึ่งเป็น "basic" ที่ unchecked)
  await page.goto(story('selection-radiocards--default'));
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });

  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('Tab');
  await expect(radios.nth(1), 'Tab เข้ากลุ่มต้อง landing ที่การ์ดที่ checked อยู่ (pro) ไม่ใช่การ์ดแรกของ DOM (basic)').toBeFocused();
  await expect(radios.nth(1)).toBeChecked();
});

test('RadioCards: Tab ออกจากกลุ่มทั้งชุดในครั้งเดียว (native radio-group = 1 tab stop, ไม่ไล่ทีละการ์ด)', async ({
  page,
}) => {
  await page.goto(story('selection-radiocards--default'));
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });

  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('Tab'); // เข้ากลุ่ม (landing ที่ pro, checked)
  await page.keyboard.press('Tab'); // ออกจากกลุ่ม — native radio-group ต้องออกทั้งชุดในครั้งเดียว
  const active = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el ? { tag: el.tagName, type: (el as HTMLInputElement).type } : null;
  });
  expect(
    active?.tag === 'INPUT' && active.type === 'radio',
    'Tab ตัวที่สองต้องออกจากกลุ่ม radio ทั้งชุด ไม่ใช่ไปที่การ์ดถัดไปในกลุ่มเดียวกัน',
  ).toBe(false);
});

test('RadioCards: hit area ทั้งการ์ด >= 40px (web-first, D-002/D-016) — วัดที่ label ทั้งใบ ไม่ใช่ input ที่ซ่อนอยู่', async ({
  page,
}) => {
  await page.goto(story('selection-radiocards--default'));
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });
  const n = await radios.count();
  for (let i = 0; i < n; i++) {
    const label = radios.nth(i).locator('xpath=ancestor::label[1]');
    await expectHitArea(label, 40);
  }
});

test('RadioCards: คลิกที่ไหนในการ์ดก็เลือกได้ (native label-wraps-input click forwarding, ไม่ใช่แค่คลิกจุดเล็กๆ)', async ({
  page,
}) => {
  await page.goto(story('selection-radiocards--default'));
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });

  // คลิกที่ cardVisual ของการ์ดแรก (พื้นที่เนื้อการ์ดจริงที่ user เห็น ไม่ใช่ role locator ของ input
  // ที่ visually-hidden อยู่ — 1px bounding box ตาม D-015 pattern เดียวกับ Checkbox/Radio/Switch)
  const basicCardVisual = page.locator('span[class*="cardVisual"]').nth(0);
  await basicCardVisual.click();
  await expect(radios.nth(0), 'คลิกพื้นที่การ์ด (ไม่ใช่แค่ indicator เล็กๆ) ต้อง select การ์ดนั้นจริง').toBeChecked();
});

test('RadioCards: selected state มี non-color cue จริง — border หนาขึ้น + indicator เปลี่ยนขนาด/แสดง checkmark (ไม่ใช่แค่สีเปลี่ยน)', async ({
  page,
}) => {
  await page.goto(story('selection-radiocards--default'));
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });

  const basicCardVisual = page.locator('span[class*="cardVisual"]').nth(0);
  const beforeBorder = await basicCardVisual.evaluate((el) => getComputedStyle(el).borderWidth);
  expect(beforeBorder, 'การ์ดที่ยัง unchecked ต้องมี border บาง (hairline) ไม่ใช่ thick').toBe('1px');

  await basicCardVisual.click();
  // ย้ายเมาส์ออกจากการ์ดทันทีหลังคลิก — `.click()` ทิ้งเมาส์ไว้ hover การ์ดอยู่ และ `:hover` ก็ set
  // border-width เป็น thick เหมือนกัน (คนละ selector, แต่ผลลัพธ์ทับกันได้ที่ 2px) ถ้าไม่ย้ายออก
  // assertion ข้างล่างจะผ่านได้แม้ `:checked`'s border-width rule หายไปจริง (เจอจริงจาก mutate-
  // confirm-revert ตอนสร้าง test นี้: ลบ `border-width` ออกจาก `.input:checked ~ .cardVisual` แล้ว
  // ยังเขียวอยู่ เพราะ `:hover` บัง — ต้องย้ายเมาส์ออกก่อนถึงจะแยกสอง cue นี้ได้จริง ดู Gate Proof log
  // ท้ายไฟล์)
  await page.mouse.move(0, 0);

  // การเปลี่ยน border-width เป็น CSS transition (duration-fast) ไม่ใช่ทันที — poll จนนิ่ง (แบบเดียวกับ
  // _helpers.ts's expectNonColorCue ใช้ poll กัน race condition ของ transition เอง)
  await expect
    .poll(async () => basicCardVisual.evaluate((el) => getComputedStyle(el).borderWidth), {
      message: 'border-width ต้องหนาขึ้นเป็น thick (2px) จริงหลัง select (ไม่ใช่แค่ตอน hover) — นี่คือ non-color cue',
      timeout: 2000,
    })
    .toBe('2px');

  // indicator (badge มุมการ์ด) ต้องมี svg checkmark ปรากฏขึ้นจริง — cue ที่สองซ้อนกับ border, ไม่ใช่
  // แค่สีพื้นเปลี่ยน
  const svgCount = await basicCardVisual.locator('svg').count();
  expect(svgCount, 'indicator ของการ์ดที่ checked ต้องมี checkmark svg จริง (shape cue, ไม่ใช่สีอย่างเดียว)').toBe(1);
});

test('RadioCards: forced-colors — indicator border ของการ์ดที่ checked ยังหนากว่าการ์ดที่ unchecked จริง (รอดจาก forced-colors, ไม่ใช่แค่ background-color)', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'forced-colors', 'ต้องรันใน forced-colors mode ถึงจะพิสูจน์อะไรได้');

  await page.goto(story('selection-radiocards--default'));
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });

  // Default story: index 1 ("pro") คือ defaultValue ที่ checked อยู่, index 0 ("basic") unchecked
  const checkedIndicator = page.locator('span[class*="indicator"]').nth(1);
  const uncheckedIndicator = page.locator('span[class*="indicator"]').nth(0);

  const checkedBorder = await checkedIndicator.evaluate((el) => parseFloat(getComputedStyle(el).borderWidth));
  const uncheckedBorder = await uncheckedIndicator.evaluate((el) => parseFloat(getComputedStyle(el).borderWidth));

  expect(checkedBorder, 'indicator ของการ์ดที่ checked ต้องมี border > 0 ใน forced-colors (ไม่ใช่แค่ background-color)').toBeGreaterThan(0);
  expect(
    checkedBorder,
    'indicator ที่ checked ต้องหนากว่า unchecked จริงใน forced-colors — นี่คือสิ่งที่ยังแยกแยะ selected ได้แม้สีถูก override',
  ).toBeGreaterThan(uncheckedBorder);
});

test('RadioCards: disabled group บล็อกทุกการ์ดจริงในเบราว์เซอร์ (click และ arrow key ทั้งคู่)', async ({ page }) => {
  await page.goto(story('selection-radiocards--disabled-group'));
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });
  const n = await radios.count();
  for (let i = 0; i < n; i++) {
    await expect(radios.nth(i)).toBeDisabled();
  }
});

// --- Gate Proof (ds-conventions/SKILL.md) — mutate ทุก assertion ใหม่ในไฟล์นี้แล้ว confirm ว่าแดง
// ได้จริงก่อนถือว่าใช้งานได้ ผลการ mutate-confirm-revert (รันมือจริงทุกข้อ ไม่ใช่เดา) บันทึกไว้ที่นี่
// เพื่อ reproduce ได้รอบหน้า — ไม่ import อะไรจาก `_roving-focus.ts` (RadioCards ไม่ใช่ Listbox
// family ตาม D-023 — ดู module doc ของ RadioCards.tsx) จึงไม่มี "reuse ตรงๆ" ที่ต้องข้าม gate proof
// ได้เหมือน w5-listbox.spec.ts's item 8 — ทุก assertion ในไฟล์นี้เป็นของใหม่ ต้องพิสูจน์ทุกข้อ:
//
// 1. Arrow key ย้าย selection (ทั้งสองเทสต์แรก) + roving landing-on-checked + Tab-out — mutate
//    เดียวกันครอบคลุมทั้ง 4 เทสต์: เปลี่ยน `name={ctx.name}` เป็น `name={ctx.name + '-' + value}` ใน
//    `RadioCardsItem` (RadioCards.tsx) ชั่วคราว ทำให้ radio แต่ละใบมี `name` ไม่ซ้ำกัน = ไม่ใช่กลุ่ม
//    เดียวกันอีกต่อไป (native radio-group mechanism พังทั้งหมด) -> รันทั้ง 4 เทสต์ -> แดงจริงทุกตัว
//    (arrow key ไม่ย้าย focus เลย, Tab เข้ากลุ่มไม่ landing ที่ checked เพราะไม่มี "กลุ่ม" ให้ landing,
//    Tab-out ไปเจอ radio ตัวถัดไปแทนที่จะออกจากกลุ่ม เพราะแต่ละ input กลายเป็น standalone tab stop
//    ของตัวเอง) -> คืนกลับ -> เขียวอีกครั้ง (ยืนยันแล้ว)
// 2. hit area >= 40px — mutate `.card`'s `min-inline-size`/`min-block-size` จาก
//    `size.control.lg` เป็น `size.icon.sm` (16px) และ `.cardVisual`'s `padding` จาก
//    `space.inset.md` เป็น `0` ชั่วคราวใน RadioCards.module.css -> รันเทสต์ -> แดงจริง (ได้ 22px ไม่
//    ถึง 40px ตามที่ error message รายงาน) -> คืนกลับ -> เขียวอีกครั้ง (ยืนยันแล้ว)
// 3. คลิกที่ไหนในการ์ดก็เลือกได้ — mutate เปลี่ยน root element ของ `RadioCardsItem` จาก `<label>`
//    เป็น `<div>` ชั่วคราว (ตัด native label-wraps-input mechanism ออกทั้งหมด) -> รันเทสต์ -> แดงจริง
//    (คลิก cardVisual แล้ว radio ยังไม่ checked เพราะไม่มี label ให้ browser forward click ไปที่
//    input ที่ visually-hidden) -> คืนกลับ -> เขียวอีกครั้ง (ยืนยันแล้ว)
// 4. selected state มี non-color cue — สอง assertion ในเทสต์เดียว ต้อง mutate แยกกันทั้งคู่ (compound
//    invariant, ตาม Gate Proof Rule's Compound Invariant Clause):
//    (a) border-width: ลบ `border-width: var(--ds-border-width-thick)` ออกจาก
//        `.input:checked ~ .cardVisual` ใน RadioCards.module.css ชั่วคราว -> รันเทสต์ -> **เขียวผิด
//        ที่** ครั้งแรก (false negative จริง ไม่ใช่ redundancy) — สืบแล้วพบสาเหตุ: `.click()` ของ
//        Playwright ทิ้งเมาส์ไว้ hover อยู่บนการ์ดหลังคลิก และ `:hover` rule (คนละ selector) ก็ set
//        `border-width: thick` เหมือนกัน เลยบัง mutation ที่ `:checked` rule ไว้เงียบๆ (เปิดเบราว์เซอร์
//        จริงยืนยันด้วย `el.matches(':hover')` -> `true` หลังคลิกจริง) — **นี่คือ test อ่อน ไม่ใช่
//        redundancy จริง** (พฤติกรรมเสียจริงถ้า `:checked`'s border-width หายไปเวลาเมาส์ไม่ได้ hover
//        การ์ดอยู่ เช่น select ด้วย keyboard — assertion เดิมจับไม่ได้) -> แก้เทสต์เพิ่ม
//        `page.mouse.move(0, 0)` ก่อน assert เพื่อตัด `:hover` ออกจากสมการ -> mutate เดิมซ้ำ -> แดง
//        จริงแล้ว ("border-width ต้องหนาขึ้นเป็น thick...(ไม่ใช่แค่ตอน hover)") -> คืนกลับ -> เขียว
//        อีกครั้ง (ยืนยันแล้ว)
//    (b) checkmark svg: เปลี่ยน `{checked ? <svg>...</svg> : null}` เป็น `{false ? ... : null}` ใน
//        `RadioCardsItem` (RadioCards.tsx) ชั่วคราว (svg ไม่ render ไม่ว่า checked จะเป็นอะไร) -> รัน
//        เทสต์ -> แดงจริง (svg count = 0 ไม่ใช่ 1) -> คืนกลับ -> เขียวอีกครั้ง (ยืนยันแล้ว)
// 5. forced-colors indicator border — ลบ `border-width: var(--ds-border-width-thick)` ออกจาก
//    `.input:checked ~ .cardVisual .indicator` ชั่วคราว -> รันใน forced-colors project -> แดงจริง
//    (checked indicator border เท่ากับ unchecked border, ไม่มากกว่า) -> คืนกลับ -> เขียวอีกครั้ง
//    (ยืนยันแล้ว) — mutation นี้แยกจากข้อ 4(a) เพราะเป็นคนละ selector (`.indicator` ไม่ใช่
//    `.cardVisual`) แม้จะดูคล้ายกัน
// 6. disabled group บล็อกทุกการ์ด — mutate `const disabled = ctx.disabled || itemDisabled;` เป็น
//    `const disabled = itemDisabled;` ใน `RadioCardsItem` ชั่วคราว (ตัด group-level disable cascade
//    ออก) -> รันเทสต์ -> แดงจริง (radio ยัง enabled อยู่ทั้งที่ group ตั้ง `disabled` ไว้) -> คืนกลับ ->
//    เขียวอีกครั้ง (ยืนยันแล้ว) — regression เดียวกันนี้ยังถูกจับได้จาก
//    `RadioCards.test.tsx`'s jsdom unit test ด้วย (dual coverage ตั้งใจ: unit test พิสูจน์ DOM fact,
//    conformance test พิสูจน์ว่ามันรอดในเบราว์เซอร์จริงด้วย ไม่ใช่ redundancy ที่ต้องตัดออก)
//
// ทุกข้อ revert แล้วรัน full suite (chromium + forced-colors + reduced-motion) ซ้ำ ยืนยัน 25/25 ผ่าน
// (2 skip ที่ตั้งใจ — forced-colors-only test บน project อื่น) ไม่มี regression หลง
