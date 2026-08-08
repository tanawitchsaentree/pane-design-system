import { test, expect } from '@playwright/test';
import { story, expectFocusTrapped, expectFocusRestored } from './_helpers';

test('Dialog: focus trap + คืน focus ให้ trigger เมื่อ Esc', async ({ page }) => {
  await page.goto(story('overlays-dialog--default'));
  const trigger = page.getByRole('button', { name: /open/i });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expectFocusTrapped(page, dialog);
  await expectFocusRestored(page, trigger, () => page.keyboard.press('Escape'));
});

// Dialog.module.css เคลม "verified real travel — not a 0-duration opacity flip like the Switch
// regression D-016 fixed" (D-009) — เคลมนี้ต้องมี test ที่ fail ได้จริงถ้า scale หายไป ไม่ใช่แค่
// คอมเมนต์ลอยๆ (Honesty Rule) วัดจาก bounding box จริงระหว่าง enter animation ต้องเปลี่ยนขนาด
// (scale 0.96->1 แปลว่า width จริงต้องขยับ ไม่ใช่แค่ opacity)
test('Dialog: enter animation มี scale transform จริง ไม่ใช่แค่ opacity fade', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced-motion', 'reduced-motion ตั้งใจตัด scale ออกเหลือ opacity เท่านั้น (D-009)');

  await page.goto(story('overlays-dialog--default'));
  const trigger = page.getByRole('button', { name: /open/i });
  await trigger.waitFor({ state: 'visible' });
  await trigger.click();
  const dialog = page.getByRole('dialog');

  const widths = new Set<string>();
  const deadline = Date.now() + 500;
  while (Date.now() < deadline) {
    const b = await dialog.boundingBox();
    if (b) widths.add(b.width.toFixed(1));
  }
  expect(widths.size, 'ขนาดของ dialog ต้องเปลี่ยนระหว่าง enter animation (scale จริง)').toBeGreaterThan(1);
});

// หมายเหตุ: spec เดิมเช็ค [data-ds-surface] ทันทีหลัง goto แต่ Drawer/Toast/Popover ทั้งสามตัวไม่ได้
// เปิดอยู่ default (ต้อง trigger ก่อน) เลยหาไม่เจอเสมอ (element not found, ไม่ใช่บั๊ก forced-colors
// จริง) แก้ให้ trigger ก่อนเช็คให้ตรงกับพฤติกรรมจริงของแต่ละ component:
// - Drawer/Popover: กดปุ่ม "Open ..." (Radix trigger)
// - Toast: ต้องกดปุ่ม variant ใดก็ได้เพื่อ fire toast ผ่าน useToast()
test('Overlays: มองเห็นได้ใน forced-colors', async ({ page }, info) => {
  test.skip(info.project.name !== 'forced-colors', 'รันเฉพาะ project forced-colors');

  await page.goto(story('overlays-drawer--default'));
  await page.getByRole('button', { name: /open drawer/i }).click();
  await expect(page.locator('[data-ds-surface]').first()).toBeVisible();

  await page.goto(story('overlays-toast--default'));
  await page.getByRole('button', { name: 'default', exact: true }).click();
  await expect(page.locator('[data-ds-surface]').first()).toBeVisible();

  await page.goto(story('overlays-popover--default'));
  await page.getByRole('button', { name: /open popover/i }).click();
  await expect(page.locator('[data-ds-surface]').first()).toBeVisible();
});
