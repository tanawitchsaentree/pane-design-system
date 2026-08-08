import { test, expect } from '@playwright/test';
import { story } from './_helpers';

// W3 (Forms/Checkbox) — `indeterminate` เป็น DOM-only property (ไม่มี HTML attribute คู่กัน) ที่ต้อง
// sync ด้วย ref effect (ดู Checkbox.tsx) jsdom เซ็ต `.indeterminate = true` ได้ก็จริง แต่การพิสูจน์ว่า
// เบราว์เซอร์ *เพนต์* glyph ที่ต่างจาก checked/unchecked จริง (ไม่ใช่แค่ property ถูกเซ็ต) ต้องดูด้วย
// เบราว์เซอร์จริงเท่านั้น — ที่นี่วัดจาก bounding box ของ SVG glyph ที่มองเห็น (shape cue ไม่ใช่สี)

test('Checkbox: indeterminate แสดง glyph ที่ต่างจาก checked/unchecked จริง', async ({ page }) => {
  await page.goto(story('forms-checkbox--states'));
  await page.waitForSelector('input[type=checkbox]');

  const indeterminate = page.getByRole('checkbox', { name: 'Indeterminate' });
  await expect(indeterminate).toHaveJSProperty('indeterminate', true);
  await expect(indeterminate).toHaveAttribute('aria-checked', 'mixed');

  // glyph ที่มองเห็นต้องเป็นเส้นแนวนอน (dash) ไม่ใช่เครื่องหมายถูก (checkmark) ของ checked state —
  // วัดจาก bounding box จริงของ svg ที่ active อยู่ (ตัวที่ opacity:1 ผ่าน CSS attribute selector)
  const label = indeterminate.locator('xpath=ancestor::label[1]');
  const dashIcon = label.locator('svg').nth(1); // .indeterminateIcon เป็น svg ตัวที่สอง (ดู Checkbox.tsx)
  const box = await dashIcon.boundingBox();
  expect(box, 'indeterminate glyph ต้องมองเห็น (มี bounding box จริง)').toBeTruthy();
  expect(box!.width, 'glyph ต้องมีขนาดจริง ไม่ใช่ 0 (แปลว่า CSS ซ่อนไว้)').toBeGreaterThan(0);
});
