// Wave 5 selection. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;
  await go('/components/listbox/code');
  await check('Listbox', 'one tab stop; arrow keys move, Space chooses, aria-selected follows', async () => {
    const lb = main().locator('[role="listbox"]').first();
    await lb.focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press(' ');
    const sel = await lb.locator('[role="option"][aria-selected="true"]').count();
    expect(sel > 0, 'nothing chosen after Space');
    expect(!!(await lb.getAttribute('aria-activedescendant')), 'no active descendant');
  });
  await go('/components/combobox/code');
  await check('Combobox', 'typing filters, arrow keys highlight while focus stays in the field, Enter chooses, Esc closes', async () => {
    const input = main().locator('[data-component="Combobox"] input[role="combobox"]').first();
    await input.focus(); await page.keyboard.type('Lof'); await page.waitForTimeout(200);
    const opts = await page.locator('[role="listbox"] [role="option"]').count();
    expect(opts === 1, `filter shows ${opts} options`);
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
    expect((await input.inputValue()) === 'Lofoten', `value is ${await input.inputValue()}`);
    expect(await input.evaluate((e) => e === document.activeElement), 'focus left the field');
    await page.keyboard.press('Escape');
  });
  await go('/components/autocomplete/code');
  await check('Autocomplete', 'keeps free text that matches no suggestion', async () => {
    const input = main().locator('[data-component="Autocomplete"] input[role="combobox"]').first();
    await input.fill('Hasselblad X2D'); await page.keyboard.press('Escape');
    expect((await input.inputValue()) === 'Hasselblad X2D', 'free text was lost');
  });
  await go('/components/multi-select/code');
  await check('MultiSelect', 'chosen values are chips with named remove buttons; Backspace removes the last', async () => {
    const root = main().locator('[data-component="MultiSelect"]').first();
    const before = await root.locator('[data-component="Chip"]').count();
    expect(before > 0, 'no chips');
    expect(await root.getByRole('button', { name: /^Remove / }).count() === before, 'a chip without a named remove button');
    await root.locator('input').focus(); await page.keyboard.press('Backspace');
    expect(await root.locator('[data-component="Chip"]').count() === before - 1, 'Backspace did not remove the last chip');
  });
  await go('/components/menu/code');
  await check('Menu', 'opens from the keyboard on its first action and Esc returns focus', async () => {
    const trig = main().getByRole('button', { name: 'More actions' }).first();
    await trig.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(200);
    expect(await page.locator('[role="menu"]').count() > 0, 'no menu');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('role') === 'menuitem'), 'focus not on an action');
    await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    expect(await trig.evaluate((e) => e === document.activeElement), 'focus did not return');
  });
  await go('/components/context-menu/code');
  await check('ContextMenu', 'opens from the keyboard menu key on a focused target', async () => {
    const target = main().locator('[data-component="ContextMenu"], [tabindex="0"]').first();
    await target.focus(); await page.keyboard.press('Shift+F10'); await page.waitForTimeout(200);
    const open = await page.locator('[role="menu"]').count() > 0;
    if (open) await page.keyboard.press('Escape');
    expect(open, 'Shift+F10 did not open the menu');
  });
  await go('/components/radio-cards/code');
  await check('RadioCards', 'arrow keys choose like a radio group and the chosen card carries a check', async () => {
    const r = main().locator('[role="radio"][data-state="checked"]').first();
    await r.focus(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100);
    expect(await main().locator('[role="radio"][data-state="checked"] svg').count() > 0, 'no check on the chosen card');
  });
  await go('/components/rating/code');
  await check('Rating', 'arrow keys change the score; read-only is one image with a spoken score', async () => {
    const group = main().locator('[data-component="Rating"][role="radiogroup"]').first();
    await group.locator('[role="radio"][data-state="checked"]').focus(); await page.keyboard.press('ArrowLeft');
    expect(await group.locator('[role="radio"][data-state="checked"]').getAttribute('aria-label') === '3 out of 5', 'arrow did not lower the score');
    expect(/out of/.test(await main().locator('[data-component="Rating"][role="img"]').first().getAttribute('aria-label')), 'read-only score not spoken');
  });
  await go('/components/tag-input/code');
  await check('TagInput', 'Enter and a comma add, duplicates are ignored, Backspace removes', async () => {
    const root = main().locator('[data-component="TagInput"]').first();
    const n0 = await root.locator('[data-component="Chip"]').count();
    const input = root.locator('input'); await input.fill('harbour'); await page.keyboard.press('Enter');
    await input.type('harbour,');
    expect(await root.locator('[data-component="Chip"]').count() === n0 + 1, 'duplicate added or Enter failed');
    await page.keyboard.press('Backspace');
    expect(await root.locator('[data-component="Chip"]').count() === n0, 'Backspace did not remove');
  });
}
