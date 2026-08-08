import { test, expect } from '@playwright/test';
import { story } from './_helpers';

// W4 (Overlays/Tooltip) — hover-intent timing + keyboard-focus open/close ต้องพิสูจน์ในเบราว์เซอร์
// จริง: jsdom ไม่มี real pointer/hover events หรือ CSS animation timing ดังนั้น Tooltip.test.tsx
// (vitest) ทำได้แค่ userEvent.hover() ที่เป็น synthetic event, ไม่ผ่าน Radix's actual delayDuration
// timer/focus-visible detection แบบเบราว์เซอร์จริง

test('Tooltip: เปิดเมื่อ keyboard focus ไม่ใช่แค่ hover (D-002)', async ({ page }) => {
  await page.goto(story('overlays-tooltip--keyboard-focus-opens'));
  const trigger = page.getByRole('button', { name: /focus me/i });
  await trigger.waitFor({ state: 'visible' });
  await trigger.focus();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();
});

test('Tooltip: Escape ปิด tooltip ที่เปิดจาก focus', async ({ page }) => {
  await page.goto(story('overlays-tooltip--keyboard-focus-opens'));
  const trigger = page.getByRole('button', { name: /focus me/i });
  await trigger.waitFor({ state: 'visible' });
  await trigger.focus();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
});

test('Tooltip: เปิดเมื่อ hover จริง (pointer event จริง ไม่ใช่ synthetic)', async ({ page }) => {
  await page.goto(story('overlays-tooltip--default'));
  const trigger = page.getByRole('button', { name: /hover me/i });
  await trigger.waitFor({ state: 'visible' });
  await trigger.hover();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();
});
