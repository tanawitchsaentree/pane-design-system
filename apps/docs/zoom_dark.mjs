import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await page.goto('http://localhost:3000/dark-mode', { waitUntil: 'networkidle' });
await page.locator('[data-theme-toggle]').click();
await page.waitForTimeout(300);
const panel = page.locator('.docs-code-panel').first();
await panel.scrollIntoViewIfNeeded();
await panel.screenshot({ path: '/tmp/zoom_dark_panel.png' });

// check actual color of a token
const importColor = await page.locator('.docs-code-panel .shiki span').first().evaluate(el => getComputedStyle(el).color);
console.log('first token color in dark mode:', importColor);
await browser.close();
