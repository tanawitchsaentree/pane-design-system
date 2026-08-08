import { test } from '@playwright/test';
import { story, expectFocusTrapped, expectFocusRestored } from './_helpers';

// W4 (Overlays/Drawer) — Drawer ยืม state machine เดียวกับ Dialog ทุกตัวอักษร (@radix-ui/react-dialog,
// D-018 Reuse Check ใน Drawer.tsx) แต่ patch เดิมมีแค่ forced-colors visibility check ให้ Drawer ไม่มี
// focus-trap/focus-restore spec แยกเหมือน Dialog — เพิ่มให้ครบตามที่ ORDERS สั่ง (ถึงจะยืมโค้ดเดียวกัน
// ก็ต้องพิสูจน์แยก เพราะ CSS/markup ต่างจาก Dialog พอที่จะพังคนละจุดได้)

test('Drawer: focus trap + คืน focus ให้ trigger เมื่อ Esc', async ({ page }) => {
  await page.goto(story('overlays-drawer--default'));
  const trigger = page.getByRole('button', { name: /open drawer/i });
  await trigger.waitFor({ state: 'visible' });
  await trigger.click();
  const drawer = page.getByRole('dialog');
  await drawer.waitFor({ state: 'visible' });
  await expectFocusTrapped(page, drawer);
  await expectFocusRestored(page, trigger, () => page.keyboard.press('Escape'));
});

test('Drawer: placement=bottom (D-017 bottom sheet role) ก็ trap focus เหมือนกัน', async ({ page }) => {
  await page.goto(story('overlays-drawer--bottom-sheet-role'));
  const trigger = page.getByRole('button', { name: /open bottom sheet/i });
  await trigger.waitFor({ state: 'visible' });
  await trigger.click();
  const drawer = page.getByRole('dialog');
  await drawer.waitFor({ state: 'visible' });
  await expectFocusTrapped(page, drawer);
  await expectFocusRestored(page, trigger, () => page.keyboard.press('Escape'));
});
