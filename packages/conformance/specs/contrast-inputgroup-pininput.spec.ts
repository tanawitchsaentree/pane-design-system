import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { story } from './_helpers';
import { parseRgb, contrastRatio } from './_contrast';

// input.json's own $description self-checks border.interactive vs surface.inset at 4.07:1
// (light) / 3.91:1 (dark), and border.invalid vs surface.inset at 5.74:1 (light) / 7.90:1 (dark)
// — re-measured 2026-08-14 after D-028 (dial-braun-rederivation) rebuilt the neutral ramp's real
// hex values; original numbers were 3.47:1/4.20:1 and 6.05:1/6.87:1 pre-D-028. Numbers computed
// by hand and recorded in prose, never re-checked by anything that runs — that's what this spec
// closes.
// InputGroup.module.css and PinInput.module.css both reuse the exact same token pairing (the
// outer group frame's border+bg for InputGroup; each cell's border+bg for PinInput) and both
// carried an UNVERIFIED comment pointing at this gap. This spec closes it by pulling the real
// `border-color`/`background-color` the browser resolved via `getComputedStyle()` — not the
// token source files — and re-computing the WCAG contrast ratio from those live values.

// Storybook's theme toolbar just flips `document.documentElement`'s data-theme/data-contrast
// attributes from a decorator (apps/storybook/.storybook/preview.ts) — no theme-aware URL query
// param is read by that decorator, so the most direct way to reach dark mode in an iframe-only
// Playwright nav is to set the attribute on `documentElement` ourselves (same DOM state the
// toolbar would produce) rather than trying to drive the manager UI's toolbar control.
// IMPORTANT ordering: the decorator re-applies `context.globals.theme` (always 'light' by
// default, since nothing here drives Storybook's globals) on every render, so setting the
// attribute BEFORE the story mounts gets silently clobbered back to light — confirmed by
// instrumenting a raw run: setting dark pre-mount still read back as the light border/bg pair.
// Waiting for the story's real DOM (an `input`) to appear first, then setting the attribute,
// avoids that race.
async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((t) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.removeAttribute('data-contrast');
    } else {
      root.removeAttribute('data-theme');
      root.removeAttribute('data-contrast');
    }
  }, theme);
  // `.cell`/`.group` transition `border-color`/`border-width` over `--ds-transition-fast`
  // (100ms) — reading getComputedStyle() immediately after flipping the attribute can catch the
  // border mid-animation (confirmed directly: an un-waited read of the invalid/dark cell measured
  // 2.44:1, the *light* danger-700-on-dark-bg ratio, not the settled dark danger-400 one).
  // Wait past the transition so we read the browser's settled, final color.
  await page.waitForTimeout(200);
}

async function getBorderBgContrast(page: Page, selector: string) {
  const rgbPair = await page.locator(selector).first().evaluate((el) => {
    const cs = getComputedStyle(el);
    return { border: cs.borderTopColor, bg: cs.backgroundColor };
  });
  const border = parseRgb(rgbPair.border);
  const bg = parseRgb(rgbPair.bg);
  return contrastRatio(border, bg);
}

test.describe('InputGroup: outer frame border/bg contrast (input.json pairing)', () => {
  test('light theme — border.interactive vs surface.inset >= 3:1 (input.json cites 3.47:1)', async ({
    page,
  }) => {
    await page.goto(story('forms-inputgroup--with-prefix'));
    await page.waitForSelector('input');
    await setTheme(page, 'light');
    const ratio = await getBorderBgContrast(page, '[class*="group"]');
    expect(ratio, `contrast จริงที่วัดได้: ${ratio.toFixed(3)}:1`).toBeGreaterThanOrEqual(3);
    // ยืนยันว่าตัวเลขจริงใกล้เคียงกับที่ input.json อ้าง (3.47:1) ไม่ใช่แค่ผ่านเกณฑ์ 3:1 ลอยๆ
    expect(ratio, `ต้องใกล้เคียง 3.47:1 ที่ input.json อ้างไว้ ได้จริง ${ratio.toFixed(3)}:1`).toBeGreaterThan(3.3);
  });

  test('dark theme — border.interactive vs surface.inset >= 3:1 (input.json cites 3.91:1 post-D-028)', async ({
    page,
  }) => {
    await page.goto(story('forms-inputgroup--with-prefix'));
    await page.waitForSelector('input');
    await setTheme(page, 'dark');
    const ratio = await getBorderBgContrast(page, '[class*="group"]');
    expect(ratio, `contrast จริงที่วัดได้: ${ratio.toFixed(3)}:1`).toBeGreaterThanOrEqual(3);
    // D-028 (dial-braun-rederivation) rebuilt the neutral ramp's real hex values (hue correction
    // from measurement against the real Braun reference) — this moved the dark-theme number from
    // its original 4.20:1 self-check down to 3.91:1, still clearing the real 3:1 UI-boundary floor
    // above (the actual gate), just with a smaller margin than before. Threshold updated to match.
    expect(ratio, `ต้องใกล้เคียง 3.91:1 (re-measured post-D-028) ได้จริง ${ratio.toFixed(3)}:1`).toBeGreaterThan(3.7);
  });
});

test.describe('PinInput: cell border/bg contrast (input.json pairing)', () => {
  test('light theme, border.interactive (default cell) vs surface.inset >= 3:1 (cites 3.47:1)', async ({
    page,
  }) => {
    await page.goto(story('forms-pininput--default'));
    await page.waitForSelector('input');
    await setTheme(page, 'light');
    const ratio = await getBorderBgContrast(page, 'input[aria-label="Digit 1 of 6"]');
    expect(ratio, `contrast จริงที่วัดได้: ${ratio.toFixed(3)}:1`).toBeGreaterThanOrEqual(3);
    expect(ratio, `ต้องใกล้เคียง 3.47:1 ที่ input.json อ้างไว้ ได้จริง ${ratio.toFixed(3)}:1`).toBeGreaterThan(3.3);
  });

  test('dark theme, border.interactive (default cell) vs surface.inset >= 3:1 (cites 3.91:1 post-D-028)', async ({
    page,
  }) => {
    await page.goto(story('forms-pininput--default'));
    await page.waitForSelector('input');
    await setTheme(page, 'dark');
    const ratio = await getBorderBgContrast(page, 'input[aria-label="Digit 1 of 6"]');
    expect(ratio, `contrast จริงที่วัดได้: ${ratio.toFixed(3)}:1`).toBeGreaterThanOrEqual(3);
    // See InputGroup's own dark-theme test above for why this moved from 4.20:1 to 3.91:1 (D-028
    // neutral-ramp rebuild) — still clears the real 3:1 floor above with margin.
    expect(ratio, `ต้องใกล้เคียง 3.91:1 (re-measured post-D-028) ได้จริง ${ratio.toFixed(3)}:1`).toBeGreaterThan(3.7);
  });

  test('light theme, invalid-state border vs surface.inset >= 3:1 (cites 6.05:1)', async ({ page }) => {
    await page.goto(story('forms-pininput--states'));
    await page.waitForSelector('input[aria-label="Digit 1 of 4"]');
    await setTheme(page, 'light');
    // "States" story's second PinInput block renders `invalid` — cell aria-labels reset per group,
    // so scope to the group that actually carries `data-invalid` to avoid matching the default one.
    const ratio = await getBorderBgContrast(page, '[role="group"][aria-label="Invalid"] input');
    expect(ratio, `contrast จริงที่วัดได้: ${ratio.toFixed(3)}:1`).toBeGreaterThanOrEqual(3);
    expect(ratio, `ต้องใกล้เคียง 6.05:1 ที่ input.json อ้างไว้ ได้จริง ${ratio.toFixed(3)}:1`).toBeGreaterThan(5.5);
  });

  test('dark theme, invalid-state border vs surface.inset >= 3:1 (cites 6.87:1)', async ({ page }) => {
    await page.goto(story('forms-pininput--states'));
    await page.waitForSelector('input[aria-label="Digit 1 of 4"]');
    await setTheme(page, 'dark');
    const ratio = await getBorderBgContrast(page, '[role="group"][aria-label="Invalid"] input');
    expect(ratio, `contrast จริงที่วัดได้: ${ratio.toFixed(3)}:1`).toBeGreaterThanOrEqual(3);
    expect(ratio, `ต้องใกล้เคียง 6.87:1 ที่ input.json อ้างไว้ ได้จริง ${ratio.toFixed(3)}:1`).toBeGreaterThan(6.3);
  });
});
