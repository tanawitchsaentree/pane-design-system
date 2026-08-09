import { test, expect } from '@playwright/test';
import { story } from './_helpers';

// W4 (Overlays/Popover) — collision detection / auto-flip conformance. jsdom has no layout engine,
// so "is the panel inside the viewport" and "did Radix flip to the opposite side" are concepts that
// only exist in a real browser. This spec proves Radix's Popper-based collision detection (which
// Popover.tsx gets for free from @radix-ui/react-popover) actually flips the panel when the
// preferred `side` has no room, keeps it fully inside the viewport bounds, and — just as
// importantly — does NOT flip when there IS room (a naive "always flips" implementation would pass
// a sloppy "flip happened" assertion without ever proving it was *necessary*).
//
// Fixtures used: Popover.stories.tsx `Centered` / `EdgeCollisionBottom` / `EdgeCollisionRight`
// (added alongside this spec — the pre-existing stories all render trigger content in the middle
// of the canvas, so there was no fixture that put a trigger near a real viewport edge).
//
// TODO(W5 — Menu/Dropdown, ContextMenu): this suite only proves SINGLE-AXIS edge collision
// (bottom-only, right-only) with Radix's DEFAULT collisionPadding. It does NOT cover:
//   1. Multi-axis collision — trigger constrained on two edges at once (e.g. bottom-right corner)
//   2. Nested submenus — a Menu with a submenu popover anchored to a menuitem inside another
//      popover; Radix's collision boundary for the inner popover needs its own verification once
//      that DOM structure exists (submenu-of-submenu positioning is a documented Radix edge case)
//   3. Content taller than the viewport — long option lists (Select/Combobox/Menu) that need
//      Radix's `avoidCollisions` + internal scroll rather than a simple flip
// Do not assume Popover's baseline coverage above extends to these — when Menu/Dropdown or
// ContextMenu are built in this wave, write a dedicated w5-menu-positioning.spec.ts (or extend
// this file) covering all three before considering Menu's positioning "verified". Tracked in
// system/STATE.md under W5 preflight follow-ups — keep both in sync if this TODO is resolved.

const VIEWPORT = { width: 800, height: 600 };

test.describe('Popover: collision detection / flip', () => {
  test.use({ viewport: VIEWPORT });

  test('baseline: trigger กลางจอ (มีที่ว่างทุกด้าน) side="bottom" ไม่ flip โดยไม่จำเป็น', async ({ page }) => {
    await page.goto(story('overlays-popover--centered'));
    const trigger = page.getByRole('button', { name: /centered trigger/i });
    await trigger.waitFor({ state: 'visible' });
    await trigger.click();

    const panel = page.getByRole('dialog');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('data-side', 'bottom');

    const box = await panel.boundingBox();
    expect(box, 'panel ต้องมี bounding box จริง').toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(VIEWPORT.width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(VIEWPORT.height);
  });

  test('collision ขอบล่าง: trigger ชิดขอบล่างจอ side="bottom" ต้อง flip เป็น "top" และไม่ล้นจอ', async ({ page }) => {
    await page.goto(story('overlays-popover--edge-collision-bottom'));
    const trigger = page.getByRole('button', { name: /near bottom edge/i });
    await trigger.waitFor({ state: 'visible' });

    const triggerBox = await trigger.boundingBox();
    expect(triggerBox, 'trigger ต้องมี bounding box จริง').toBeTruthy();
    // sanity: trigger ต้องอยู่ใกล้ขอบล่างจริง ไม่งั้น test นี้ไม่ได้ทดสอบ collision จริง
    expect(triggerBox!.y + triggerBox!.height).toBeGreaterThan(VIEWPORT.height - 60);

    await trigger.click();
    const panel = page.getByRole('dialog');
    await expect(panel).toBeVisible();

    await expect(panel).toHaveAttribute('data-side', 'top');

    const box = await panel.boundingBox();
    expect(box, 'panel ต้องมี bounding box จริง').toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(VIEWPORT.width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(VIEWPORT.height);
  });

  test('collision ขอบขวา: trigger ชิดขอบขวาจอ side="right" ต้อง flip เป็น "left" และไม่ล้นจอ', async ({ page }) => {
    await page.goto(story('overlays-popover--edge-collision-right'));
    const trigger = page.getByRole('button', { name: /near right edge/i });
    await trigger.waitFor({ state: 'visible' });

    const triggerBox = await trigger.boundingBox();
    expect(triggerBox, 'trigger ต้องมี bounding box จริง').toBeTruthy();
    // sanity: trigger ต้องอยู่ใกล้ขอบขวาจริง ไม่งั้น test นี้ไม่ได้ทดสอบ collision จริง
    expect(triggerBox!.x + triggerBox!.width).toBeGreaterThan(VIEWPORT.width - 100);

    await trigger.click();
    const panel = page.getByRole('dialog');
    await expect(panel).toBeVisible();

    await expect(panel).toHaveAttribute('data-side', 'left');

    const box = await panel.boundingBox();
    expect(box, 'panel ต้องมี bounding box จริง').toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(VIEWPORT.width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(VIEWPORT.height);
  });
});
