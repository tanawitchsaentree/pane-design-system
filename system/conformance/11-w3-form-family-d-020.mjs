// W3 form family (D-020): labels, descriptions and keyboard, all through Radix or native elements. Run by tooling/kiln/conformance.mjs on the built book (moved from tooling/conformance.mjs, 2026-10-28).
export default async function (t) {
  const { check, expect, eventually, tabTo, page, go, main, browser, base } = t;
  const srv = { base }; const ctx = page.context();
  // --- W3 form family (D-020): labels, descriptions and keyboard, all through Radix or native elements ---
  await go('/components/input/code');
  const nameField = main().locator('#hero').getByRole('textbox', { name: 'Display name' }).first();
  await check('Input', 'reachable with Tab and labelled by its FormField', async () => {
    await tabTo(page, nameField);
    const d = await nameField.getAttribute('aria-describedby');
    expect(d && (await page.locator(`[id="${d.split(' ')[0]}"]`).count()) === 1, 'help is not tied to the field');
  });
  await check('Input', 'an error marks the field invalid and is read with it', async () => {
    const email = main().getByRole('textbox', { name: /Email/ }).first();
    expect((await email.getAttribute('aria-invalid')) === 'true', 'aria-invalid is not set');
    const ids = (await email.getAttribute('aria-describedby')) ?? '';
    const text = await page.evaluate((ids) => ids.split(' ').map((i) => document.getElementById(i)?.textContent ?? '').join(' '), ids);
    expect(/^Error\./.test(text.trim()), `the error is not spoken first: "${text.slice(0, 60)}"`);
  });
  await go('/components/textarea/code');
  await check('Textarea', 'labelled by its FormField', async () => {
    expect((await main().getByRole('textbox', { name: 'Bio' }).count()) > 0, 'no textarea named Bio');
  });
  await go('/components/checkbox/code');
  const cb = main().getByRole('checkbox', { name: 'Show my email on my profile' }).first();
  await check('Checkbox', 'Space toggles it and the label is its name', async () => {
    await tabTo(page, cb);
    const before = await cb.getAttribute('aria-checked');
    await page.keyboard.press('Space');
    await eventually(() => cb.getAttribute('aria-checked'), before === 'true' ? 'false' : 'true', 'Space did not toggle');
  });
  await check('Checkbox', 'a mixed parent reports aria-checked="mixed"', async () => {
    const parent = main().getByRole('checkbox', { name: 'Download everything' }).first();
    expect((await parent.getAttribute('aria-checked')) === 'mixed', `aria-checked is ${await parent.getAttribute('aria-checked')}`);
  });
  await check('Checkbox', 'the target is at least 44px tall', async () => {
    const h = await main().locator('[data-component="Checkbox"]').first().evaluate((e) => e.getBoundingClientRect().height);
    expect(h >= 44, `row is ${h}px`);
  });
  await go('/components/radio/code');
  const group = main().locator('#hero').getByRole('radiogroup', { name: 'Who can message you' }).first();
  await check('Radio', 'one tab stop and arrow keys choose', async () => {
    const chosen = group.getByRole('radio', { name: 'People you follow' });
    await tabTo(page, chosen);
    await page.keyboard.press('ArrowDown');
    await eventually(() => group.getByRole('radio', { name: 'No one' }).getAttribute('aria-checked'), 'true', 'ArrowDown did not choose the next option');
    await page.keyboard.press('Tab');
    expect(!(await group.evaluate((g) => g.contains(document.activeElement))), 'Tab stopped on another option');
  });
  await go('/components/switch/code');
  const sw = main().getByRole('switch', { name: 'Private account' }).first();
  await check('Switch', 'Space toggles it', async () => {
    await tabTo(page, sw);
    const before = await sw.getAttribute('aria-checked');
    await page.keyboard.press('Space');
    await eventually(() => sw.getAttribute('aria-checked'), before === 'true' ? 'false' : 'true', 'Space did not toggle');
  });
  await go('/components/pin-input/code');
  const pin = main().locator('#hero').getByRole('group', { name: 'Verification code' }).first();
  await check('PinInput', 'typing moves on and paste fills every cell', async () => {
    const cells = pin.getByRole('textbox');
    await cells.nth(0).click();
    await page.keyboard.type('12');
    expect(await cells.nth(2).evaluate((e) => document.activeElement === e), 'focus did not move to the third cell');
    // Backspace in an empty cell clears the cell before it and moves there, one cell per press
    await page.keyboard.press('Backspace');
    expect(await cells.nth(1).evaluate((e) => document.activeElement === e) && (await cells.nth(1).inputValue()) === '', 'Backspace did not clear the previous cell and move back');
    await page.keyboard.press('Backspace');
    expect(await cells.nth(0).evaluate((e) => document.activeElement === e), 'a second Backspace did not reach the first cell');
    await cells.nth(0).evaluate((el) => { const dt = new DataTransfer(); dt.setData('text', '654321'); el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); });
    await eventually(() => cells.nth(5).inputValue(), '1', 'paste did not fill the last cell');
  });

  await go('/components/banner/code');
  await check('Banner', 'dismiss is a named button and removes the banner', async () => {
    const d = main().getByRole('button', { name: 'Dismiss' }).first();
    // the banner itself: a static Banner is a <section> labelled by its tone
    const count = () => main().locator('section[aria-label="Info"]', { hasText: 'New sign-in from Zürich' }).count();
    const before = await count();
    await d.click();
    await page.waitForTimeout(600); // the line closes its height before it is removed
    const after = await count();
    expect(before >= 1 && after === before - 1, `banner count ${before} → ${after}`);
  });
  await check('Banner', 'live="polite" appears as role="status", live="assertive" as role="alert"', async () => {
    await main().getByRole('button', { name: 'Save', exact: true }).click();
    await main().getByRole('button', { name: 'Simulate error' }).click();
    expect((await main().getByRole('status').filter({ hasText: 'Saved' }).count()) === 1, 'no status');
    expect((await main().getByRole('alert').filter({ hasText: 'offline' }).count()) === 1, 'no alert');
  });
  await check('Banner', 'the tone is spoken as prefix text', async () => {
    const t = await main().locator('section', { hasText: 'Upload failed' }).first().innerText();
    expect(/Error:\s*Upload failed/.test(t), `text: ${t.slice(0, 60)}`);
  });

}
