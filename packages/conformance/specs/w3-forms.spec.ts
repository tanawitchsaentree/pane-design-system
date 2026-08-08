import { test, expect } from '@playwright/test';
import { story, expectHitArea, expectNonColorCue, expectRovingFocus } from './_helpers';

// เคสที่ jsdom เคยปล่อยผ่านใน W3 — ทำให้มันแดงได้จริงตรงนี้
// หมายเหตุ story id: patch ต้นฉบับอ้าง 'forms-radio--group' ซึ่งไม่มีจริงใน Storybook ของเรา
// (Radio.stories.tsx: title 'Forms/Radio' -> id 'forms-radio--*', ไม่มี story ชื่อ 'group' —
// ที่ใกล้เคียงคือ 'Default' ซึ่ง render สอง <Radio> ที่ name เดียวกันอยู่แล้ว) แก้ id ให้ตรง
// ของจริงตามสั่ง (ห้ามแก้ story ของ component ให้ตรง spec)
test('Radio: arrow key ย้าย focus จริง (แทนคำเคลมใน Radio.tsx)', async ({ page }) => {
  await page.goto(story('forms-radio--default'));
  await expectRovingFocus(page, page.getByRole('radio'));
});

// หมายเหตุ click target: input จริงถูก visually-hidden ด้วย clip-path (D-015 pattern เดียวกับ
// Checkbox/Radio) เหลือ bounding box 1px — ผู้ใช้จริงคลิกที่ <label>/track ที่มองเห็น ไม่ใช่ที่
// input ตรงๆ (native label->input click forwarding) ดังนั้นคลิกที่ label เพื่อจำลอง user gesture
// จริง ไม่ใช่ยิง .click() ไปที่ role locator ตรงๆ ซึ่งจะโดน track สกัดกั้นเพราะ track z-index สูงกว่า
test('Switch: toggle แล้ว thumb ต้องขยับจริง ไม่ใช่แค่เปลี่ยนสี', async ({ page }) => {
  await page.goto(story('forms-switch--default'));
  await page.waitForSelector('input[role="switch"]');
  const thumb = page.getByTestId('switch-thumb');
  const label = page.getByRole('switch').locator('xpath=ancestor::label[1]');
  await expectNonColorCue(thumb, () => label.click());
});

// หมายเหตุ: fix จริงจาก hardening pass Group C — Switch thumb / Radio dot เดิมใช้ background-color
// อย่างเดียว ทำให้หายไปเงียบๆ ใน forced-colors mode (เหมือน Divider regression W1) เพิ่ม border จริง
// เข้าไป ยืนยันด้วย test นี้ (ไม่ใช่แค่คอมเมนต์อ้าง "verified" ลอยๆ — ต้อง fail ได้จริงถ้า border
// หายไปอีก): วัด border-width ที่คำนวณจริงต้อง > 0 เมื่ออยู่ใน forced-colors mode
test('Switch/Radio: checked state มี border จริง (รอดจาก forced-colors, ไม่ใช่แค่ background-color)', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'forced-colors', 'ต้องรันใน forced-colors mode ถึงจะพิสูจน์อะไรได้');

  await page.goto(story('forms-switch--default'));
  await page.waitForSelector('input[role="switch"]');
  const thumb = page.getByTestId('switch-thumb');
  const thumbBorder = await thumb.evaluate((el) => parseFloat(getComputedStyle(el).borderWidth));
  expect(thumbBorder, 'Switch thumb ต้องมี border > 0 (ไม่ใช่แค่ background-color)').toBeGreaterThan(0);

  await page.goto(story('forms-radio--default'));
  await page.waitForSelector('input[type="radio"]');
  const radio = page.getByRole('radio').nth(0); // defaultChecked ใน Default story
  await radio.check({ force: true });
  const dot = radio.locator('xpath=following-sibling::span[1]//span[contains(@class,"dot")]');
  const dotBorder = await dot.evaluate((el) => parseFloat(getComputedStyle(el).borderWidth));
  expect(dotBorder, 'Radio dot ที่ checked ต้องมี border > 0 (ไม่ใช่แค่ background-color)').toBeGreaterThan(0);
});

// หมายเหตุ hit area: Checkbox/Radio/Switch ใช้ native <input> ที่ visually-hidden (clip 1px) ใต้
// <label> ที่เป็นคลิกเป้าจริง (D-015 pattern) — role element เองมี bounding box 1px เสมอ (ถูกต้อง
// ตาม a11y technique) ดังนั้นเกณฑ์ 40px ต้องวัดที่ label (ancestor) ซึ่งเป็นพื้นที่คลิกจริงที่ผู้ใช้
// สัมผัส ไม่ใช่ที่ input element ที่ซ่อนอยู่
test('Checkbox/Radio/Switch: hit area >= 40px (web-first)', async ({ page }) => {
  const cases = [
    ['forms-checkbox--default', 'checkbox'],
    ['forms-radio--default', 'radio'],
    ['forms-switch--default', 'switch'],
  ] as const;
  for (const [id, role] of cases) {
    await page.goto(story(id));
    const label = page.getByRole(role).first().locator('xpath=ancestor::label[1]');
    await expectHitArea(label, 40);
  }
});
