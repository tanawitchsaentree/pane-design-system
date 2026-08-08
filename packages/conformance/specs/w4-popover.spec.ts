import { test, expect } from '@playwright/test';
import { story } from './_helpers';

// W4 (Overlays/Popover) — click-outside dismissal ต้องพิสูจน์ด้วย real mouse event นอก viewport ของ
// element (jsdom ไม่มี layout ดังนั้น "นอกกรอบ popover" เป็นแนวคิดที่วัดไม่ได้เลยใน jsdom — ทุก
// element มี bounding box 0x0 ที่ตำแหน่งเดียวกัน) รวมถึง controlled/uncontrolled open state ที่ Radix
// ผูกกับ Escape/outside-click ทั้งคู่ต้องยิงผ่านเบราว์เซอร์จริง

test('Popover: คลิกนอกกรอบปิด popover จริง', async ({ page }) => {
  await page.goto(story('overlays-popover--default'));
  const trigger = page.getByRole('button', { name: /open popover/i });
  await trigger.waitFor({ state: 'visible' });
  await trigger.click();
  const content = page.getByText('plain content, no title required');
  await expect(content).toBeVisible();
  await page.mouse.click(500, 500);
  await expect(content).toBeHidden();
});

// หมายเหตุ: สมมติฐานเดิมของ spec นี้ผิด — ตรวจแล้วพบว่า Radix Popover ย้าย focus เข้า content เสมอ
// ตอนเปิด (ไม่ว่า modal จะเป็น true/false ก็ตาม) เพื่อให้ keyboard user กด Tab ต่อในพาเนลได้ทันที
// ไม่ใช่บั๊ก component — แก้ spec ให้ตรงกับพฤติกรรมจริงที่ตรวจสอบแล้ว (ตาม Honesty Rule: ยืนยันด้วย
// การรันจริงก่อนเขียน assertion ไม่ใช่เดาจาก docs)
test('Popover: เปิดแล้ว focus ย้ายเข้า content panel จริง (Radix a11y behavior, ยืนยันแล้วในเบราว์เซอร์จริง)', async ({ page }) => {
  await page.goto(story('overlays-popover--default'));
  const trigger = page.getByRole('button', { name: /open popover/i });
  await trigger.waitFor({ state: 'visible' });
  await trigger.click();
  const content = page.getByText('plain content, no title required');
  await expect(content).toBeVisible();
  const panel = page.getByRole('dialog');
  const focusInsidePanel = await panel.evaluate((el) => el.contains(document.activeElement));
  expect(focusInsidePanel, 'focus ต้องย้ายเข้า popover panel ตอนเปิด').toBe(true);
});

test('Popover: controlled open (defaultOpen) render เปิดอยู่จริงตั้งแต่แรก', async ({ page }) => {
  await page.goto(story('overlays-popover--controlled'));
  await expect(page.getByText(/opened via `defaultOpen`/i)).toBeVisible();
});

test('Popover: Escape ปิด panel และคืน focus ให้ trigger', async ({ page }) => {
  await page.goto(story('overlays-popover--default'));
  const trigger = page.getByRole('button', { name: /open popover/i });
  await trigger.waitFor({ state: 'visible' });
  await trigger.click();
  const content = page.getByText('plain content, no title required');
  await expect(content).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
});
