import { test } from '@playwright/test';
import { story, expectHitArea } from './_helpers';

// W2 (Atoms) — hit area จริงในเบราว์เซอร์จริง (ไม่ใช่แค่คำนวณจาก CSS ใน jsdom)
// Button/IconButton ทั้งคู่ใช้ size.control.* (sm40/md48/lg56/xl64) แต่ jsdom ไม่มี layout engine
// จึง getBoundingClientRect() คืนค่า 0 เสมอ — ต้องยืนยันด้วยเบราว์เซอร์จริงเท่านั้น
test('Button: hit area >= 40px ทุก size (web-first)', async ({ page }) => {
  await page.goto(story('atoms-button--all-sizes'));
  const buttons = page.getByRole('button');
  await buttons.first().waitFor({ state: 'visible' });
  const n = await buttons.count();
  for (let i = 0; i < n; i++) {
    await expectHitArea(buttons.nth(i), 40);
  }
});

test('IconButton: hit area >= 40px ทุก size (web-first)', async ({ page }) => {
  await page.goto(story('atoms-iconbutton--all-sizes'));
  const buttons = page.getByRole('button');
  await buttons.first().waitFor({ state: 'visible' });
  const n = await buttons.count();
  for (let i = 0; i < n; i++) {
    await expectHitArea(buttons.nth(i), 40);
  }
});
