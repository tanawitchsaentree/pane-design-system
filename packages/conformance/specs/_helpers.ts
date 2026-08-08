import { expect, type Page, type Locator } from '@playwright/test';

export const story = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

/** hit area จริง (รวม padding/pseudo) ต้องถึงเกณฑ์ platform */
export async function expectHitArea(el: Locator, min = 40) {
  const b = await el.boundingBox();
  expect(b, 'element ต้องมองเห็นได้').toBeTruthy();
  expect(Math.min(b!.width, b!.height), `hit area ต้อง >= ${min}px`).toBeGreaterThanOrEqual(min);
}

/** state เปลี่ยนต้องมี cue ที่ไม่ใช่สี — วัดจากตำแหน่ง/ขนาดจริง */
export async function expectNonColorCue(el: Locator, act: () => Promise<void>) {
  const before = await el.boundingBox();
  await act();
  // การเปลี่ยนตำแหน่งเป็น CSS transition (duration-fast, ~100ms) ไม่ใช่การเปลี่ยนทันที — ต้อง poll
  // จนกว่า bounding box จะนิ่ง (แตกต่างจาก `before`) ไม่งั้นอ่านค่าเร็วเกินไปจะเจอ 0 เพราะ transition
  // ยังไม่เริ่มขยับ (race condition ของ test เอง ไม่ใช่บั๊ก component)
  await expect
    .poll(
      async () => {
        const after = await el.boundingBox();
        if (!after) return 0;
        return (
          Math.abs(after.x - before!.x) +
          Math.abs(after.y - before!.y) +
          Math.abs(after.width - before!.width) +
          Math.abs(after.height - before!.height)
        );
      },
      { message: 'ต้องมี cue ที่ไม่ใช่สี (ตำแหน่ง/ขนาดต้องเปลี่ยน)', timeout: 2000 },
    )
    .toBeGreaterThan(0);
}

/** roving focus: ลูกศรต้องย้าย focus จริง (jsdom ทำแทนไม่ได้) */
export async function expectRovingFocus(
  page: Page,
  items: Locator,
  key: 'ArrowDown' | 'ArrowRight' = 'ArrowDown',
) {
  // Storybook เป็น SPA — ต้อง await ตัวแรกให้ mount ก่อน count() ไม่งั้น count() จะอ่านได้ 0 เพราะ
  // React ยังไม่ hydrate (race condition ล้วนๆ ไม่ใช่บั๊กของ component)
  await items.first().waitFor({ state: 'visible' });
  const n = await items.count();
  expect(n).toBeGreaterThan(1);
  await items.nth(0).focus();
  await page.keyboard.press(key);
  await expect(items.nth(1)).toBeFocused();
}

/** focus trap: Tab วนอยู่ในกล่อง ไม่หลุดออกไปข้างหลัง */
export async function expectFocusTrapped(page: Page, container: Locator) {
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const inside = await container.evaluate((c) => c.contains(document.activeElement));
    expect(inside, 'focus ต้องไม่หลุดออกจาก overlay').toBe(true);
  }
}

/** ปิดแล้ว focus ต้องกลับที่ trigger เดิม */
export async function expectFocusRestored(page: Page, trigger: Locator, close: () => Promise<void>) {
  await close();
  await expect(trigger).toBeFocused();
}
