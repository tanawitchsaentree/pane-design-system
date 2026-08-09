import { test, expect } from '@playwright/test';
import { story, expectHitArea } from './_helpers';

// W5 (Selection/Rating) — D-023: Rating is native `<input type=radio>` grouped by `name` (same
// engine as Radio/RadioCards), NOT the React Aria collection stack Listbox uses — so this spec
// intentionally does NOT import anything from `_roving-focus.ts` (that helper set's contract is
// role="option"/roving-tabindex, a different ARIA pattern than a native radiogroup, which gets
// Arrow-key cycling and roving focus for free from the browser with zero JS). What IS proven here
// is exactly what jsdom (Rating.test.tsx) cannot: real native radio-group arrow-key behavior with
// a star-shaped visual instead of a dot, real mouse-hover preview, real computed geometry (hit
// area), and real forced-colors rendering of the shape-based selected/unselected cue.

test('Rating: arrow key ย้าย selection จริงระหว่างดาว (native radio-group, ไม่ wrap)', async ({ page }) => {
  await page.goto(story('selection-rating--default'));
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });
  const n = await radios.count();
  expect(n, 'ต้องมีดาวมากกว่า 1 ดวงถึงพิสูจน์ arrow-key cycle ได้จริง').toBeGreaterThan(1);

  await radios.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  // native radio-group behavior: ArrowRight both moves focus AND selects the next radio
  await expect(radios.nth(1)).toBeFocused();
  await expect(radios.nth(1)).toBeChecked();
});

test('Rating: arrow key ทำงานเหมือนกันทั้ง ArrowRight/ArrowDown (native behavior ไม่สนใจว่า visual เป็นดาว)', async ({
  page,
}) => {
  await page.goto(story('selection-rating--default'));
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });
  await radios.nth(1).focus();
  await page.keyboard.press('ArrowDown');
  await expect(radios.nth(2)).toBeFocused();
  await expect(radios.nth(2)).toBeChecked();
});

test('Rating: hover ผ่านดาวที่ 3 ต้องไฮไลท์ดาว 1-3 ก่อนคลิกจริง (mouse hover preview)', async ({ page }) => {
  await page.goto(story('selection-rating--default'));
  const stars = page.locator('label[class*="star"]');
  await stars.first().waitFor({ state: 'visible' });

  await stars.nth(2).hover();
  const states = await stars.evaluateAll((els) =>
    els.map((el) => el.querySelector('[data-state]')?.getAttribute('data-state')),
  );
  expect(states.slice(0, 3), 'ดาว 1-3 ต้อง preview เป็น selected ระหว่าง hover ดาวที่ 3').toEqual([
    'selected',
    'selected',
    'selected',
  ]);
  expect(states.slice(3), 'ดาว 4-5 ต้องยังเป็น unselected ระหว่าง hover ดาวที่ 3').toEqual(
    states.slice(3).map(() => 'unselected'),
  );

  // เอาเมาส์ออกจากทั้งกลุ่ม (ไม่ใช่แค่ย้ายไปดาวอื่น) ต้องคืนกลับเป็น current value (0 ในสถานะเริ่มต้น)
  await page.mouse.move(0, 0);
  const statesAfter = await stars.evaluateAll((els) =>
    els.map((el) => el.querySelector('[data-state]')?.getAttribute('data-state')),
  );
  expect(statesAfter, 'พอเมาส์ออกจากกลุ่ม ต้องคืนกลับเป็น current value (ยังไม่เลือกอะไร = unselected ทุกดวง)').toEqual(
    statesAfter.map(() => 'unselected'),
  );
});

test('Rating: hover preview ไม่กระทบค่าที่เลือกจริงจนกว่าจะคลิก (preview vs commit ต้องคนละ state)', async ({
  page,
}) => {
  await page.goto(story('selection-rating--with-default-value')); // defaultValue=3
  const stars = page.locator('label[class*="star"]');
  await stars.first().waitFor({ state: 'visible' });

  await stars.nth(4).hover(); // preview ดาว 5
  const radios = page.getByRole('radio');
  await expect(radios.nth(2), 'ค่าจริง (ดาว 3) ต้องยัง checked อยู่ระหว่าง hover preview').toBeChecked();
  await expect(radios.nth(4), 'ดาว 5 ยังไม่ถูกเลือกจริงแค่เพราะ hover').not.toBeChecked();

  await page.mouse.move(0, 0);
  await expect(radios.nth(2), 'พอเมาส์ออก ค่าจริงต้องยังเป็นดาว 3 เหมือนเดิม (ไม่ถูก preview ทับ)').toBeChecked();
});

test('Rating: hit area ต่อดาว >= 40px (web-first)', async ({ page }) => {
  await page.goto(story('selection-rating--default'));
  const stars = page.locator('label[class*="star"]');
  await stars.first().waitFor({ state: 'visible' });
  const n = await stars.count();
  for (let i = 0; i < n; i++) {
    await expectHitArea(stars.nth(i), 40);
  }
});

test('Rating: selected vs unselected คือ shape ต่างกันจริง (filled path vs outline path), ไม่ใช่สีอย่างเดียว', async ({
  page,
}) => {
  await page.goto(story('selection-rating--with-default-value')); // defaultValue=3
  const stars = page.locator('label[class*="star"]');
  await stars.first().waitFor({ state: 'visible' });

  // ดาวที่เลือก (index 0-2): filled <svg> ต้อง display:block, outline <svg> ต้อง display:none
  for (const i of [0, 1, 2]) {
    const visual = stars.nth(i).locator('[data-state]');
    await expect(visual).toHaveAttribute('data-state', 'selected');
    const filledDisplay = await visual
      .locator('svg[class*="filled"]')
      .evaluate((el) => getComputedStyle(el).display);
    const outlineDisplay = await visual
      .locator('svg[class*="outline"]')
      .evaluate((el) => getComputedStyle(el).display);
    expect(filledDisplay, `ดาว ${i + 1} (selected) ต้องแสดง filled star จริง`).toBe('block');
    expect(outlineDisplay, `ดาว ${i + 1} (selected) ต้องซ่อน outline star จริง`).toBe('none');
  }

  // ดาวที่ไม่เลือก (index 3-4): กลับกัน
  for (const i of [3, 4]) {
    const visual = stars.nth(i).locator('[data-state]');
    await expect(visual).toHaveAttribute('data-state', 'unselected');
    const filledDisplay = await visual
      .locator('svg[class*="filled"]')
      .evaluate((el) => getComputedStyle(el).display);
    const outlineDisplay = await visual
      .locator('svg[class*="outline"]')
      .evaluate((el) => getComputedStyle(el).display);
    expect(filledDisplay, `ดาว ${i + 1} (unselected) ต้องซ่อน filled star จริง`).toBe('none');
    expect(outlineDisplay, `ดาว ${i + 1} (unselected) ต้องแสดง outline star จริง`).toBe('block');
  }
});

test('Rating: forced-colors — selected/unselected ยังแยกแยะได้จริงแม้สีถูก override', async ({ page }, info) => {
  test.skip(info.project.name !== 'forced-colors', 'ต้องรันใน forced-colors mode ถึงจะพิสูจน์อะไรได้');

  await page.goto(story('selection-rating--with-default-value')); // defaultValue=3
  const stars = page.locator('label[class*="star"]');
  await stars.first().waitFor({ state: 'visible' });

  // สีของ selected/unselected อาจถูก forced-colors ทำให้เท่ากัน (currentColor ของทั้งคู่ถูก system
  // override) — สิ่งที่ยังต้องต่างกันจริงคือ "shape" ผ่าน which svg is display:block, ไม่ใช่สี
  const selectedVisual = stars.nth(0).locator('[data-state]');
  const unselectedVisual = stars.nth(4).locator('[data-state]');

  const selectedFilledDisplay = await selectedVisual
    .locator('svg[class*="filled"]')
    .evaluate((el) => getComputedStyle(el).display);
  const selectedOutlineDisplay = await selectedVisual
    .locator('svg[class*="outline"]')
    .evaluate((el) => getComputedStyle(el).display);
  const unselectedFilledDisplay = await unselectedVisual
    .locator('svg[class*="filled"]')
    .evaluate((el) => getComputedStyle(el).display);
  const unselectedOutlineDisplay = await unselectedVisual
    .locator('svg[class*="outline"]')
    .evaluate((el) => getComputedStyle(el).display);

  expect(selectedFilledDisplay, 'selected star ต้องยังแสดง filled path ใน forced-colors').toBe('block');
  expect(selectedOutlineDisplay, 'selected star ต้องยังซ่อน outline path ใน forced-colors').toBe('none');
  expect(unselectedFilledDisplay, 'unselected star ต้องยังซ่อน filled path ใน forced-colors').toBe('none');
  expect(unselectedOutlineDisplay, 'unselected star ต้องยังแสดง outline path ใน forced-colors').toBe('block');

  // ยืนยันอีกชั้นว่า "which shape is rendered" ต่างกันจริงระหว่างสอง star (คนละดวง คนละ path ที่โชว์)
  expect(
    [selectedFilledDisplay, unselectedFilledDisplay],
    'selected/unselected ต้องไม่โชว์ filled-path เหมือนกันทั้งคู่ (ไม่งั้นแยกไม่ได้ใน forced-colors)',
  ).not.toEqual(['block', 'block']);
});

test('Rating: readOnly บล็อกการเปลี่ยนค่าจริงในเบราว์เซอร์ (click และ arrow key ทั้งคู่)', async ({ page }) => {
  await page.goto(story('selection-rating--read-only-average')); // defaultValue=4, readOnly
  const radios = page.getByRole('radio');
  await radios.first().waitFor({ state: 'visible' });

  await expect(radios.nth(3), 'ค่าเริ่มต้นต้องเป็นดาว 4').toBeChecked();

  // คลิกดาวสุดท้ายตรงๆ (ผ่าน label ที่มองเห็น ไม่ใช่ locator ของ input ที่ซ่อนอยู่)
  const lastStarLabel = page.locator('label[class*="star"]').nth(4);
  await lastStarLabel.click();
  await expect(radios.nth(3), 'คลิกดาวอื่นตอน readOnly ต้องไม่เปลี่ยนค่าจริง').toBeChecked();
  await expect(radios.nth(4)).not.toBeChecked();

  // arrow key ก็ต้องถูกบล็อกเหมือนกัน (native radio-group arrow-key re-select ถูก preventDefault)
  await radios.nth(3).focus();
  await page.keyboard.press('ArrowRight');
  await expect(radios.nth(3), 'arrow key ตอน readOnly ต้องไม่เปลี่ยนค่าจริง').toBeChecked();
});
