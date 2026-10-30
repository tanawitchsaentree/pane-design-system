// Wave A: Button toggles, links and menu buttons, ButtonGroup, SplitButton, clearable and counted fields,
// FormField warnings, Fieldset errors, FileUpload status. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page, tabTo } = t;
  const ex = () => main().locator('figure.example');
  const eventually = async (fn, ms = 1500) => { const end = Date.now() + ms; for (;;) { try { return await fn(); } catch (e) { if (Date.now() > end) throw e; await new Promise((r) => setTimeout(r, 50)); } } };

  await go('/components/button/code');
  await check('Button', 'a toggle says pressed and flips on Enter', async () => {
    const b = ex().locator('button[aria-pressed]', { hasText: 'Bold' }).first();
    expect(await b.getAttribute('aria-pressed') === 'true', 'Bold does not start pressed');
    await b.focus(); await page.keyboard.press('Enter');
    await eventually(async () => expect(await b.getAttribute('aria-pressed') === 'false', 'Enter did not turn it off'));
  });
  await check('Button', 'with href it is a link that looks like a button', async () => {
    const a = ex().locator('a[data-component="Button"]').first();
    expect(await a.count() === 1 && (await a.getAttribute('href')) === '#pricing', 'no link with the href');
  });
  await check('Button', 'a menu button says when its menu is open', async () => {
    const b = ex().locator('[data-component="Button"][aria-haspopup="menu"]').first();
    await b.focus(); await page.keyboard.press('Enter');
    await eventually(async () => expect(await b.getAttribute('aria-expanded') === 'true', 'not expanded'));
    await page.keyboard.press('Escape');
  });

  await go('/components/button-group/code');
  await check('ButtonGroup', 'each button is its own tab stop', async () => {
    const g = ex().first().locator('[data-component="ButtonGroup"]');
    expect(await g.getAttribute('role') === 'group' && (await g.getAttribute('aria-label')) === 'Text style', 'not a named group');
    const bs = g.locator('button'); await tabTo(page, bs.first()); await page.keyboard.press('Tab');
    expect(await bs.nth(1).evaluate((e) => e === document.activeElement), 'Tab did not move to the second button');
  });

  await go('/components/split-button/code');
  await check('SplitButton', 'the action and the chevron are two tab stops', async () => {
    const s = ex().first().locator('[data-component="SplitButton"] button');
    expect(await s.count() === 2, `found ${await s.count()} buttons`);
    await tabTo(page, s.first()); await page.keyboard.press('Tab');
    expect(await s.nth(1).evaluate((e) => e === document.activeElement), 'Tab did not reach the chevron');
  });
  await check('SplitButton', 'the chevron opens the menu', async () => {
    const c = ex().first().locator('[data-component="SplitButton"] button').nth(1);
    expect((await c.getAttribute('aria-label')) === 'More ways to save', 'the chevron is not named');
    await c.focus(); await page.keyboard.press('Enter');
    await eventually(async () => expect(await page.locator('[role="menu"]').isVisible(), 'no menu'));
    await page.keyboard.press('Escape');
    await eventually(async () => expect(await c.evaluate((e) => e === document.activeElement), 'focus did not return to the chevron'), 4000);
  });

  await go('/components/input/code');
  await check('Input', 'the clear button empties the field and puts focus back', async () => {
    const fig = ex().filter({ hasText: 'A clear button once there is text' }).first();
    const field = fig.locator('input').first();
    const clear = fig.locator('[data-component="InputGroup"] button').first();
    await clear.click();
    await eventually(async () => expect((await field.inputValue()) === '' && await field.evaluate((e) => e === document.activeElement), 'not cleared or focus lost'));
    expect(await clear.evaluate((e) => getComputedStyle(e).visibility) === 'hidden', 'the empty field still shows a clear button');
  });
  await check('Input', 'a counted field shows how many characters are used', async () => {
    const f = ex().locator('input[maxlength="40"]').first();
    const wrap = f.locator('xpath=ancestor::span[1]');
    expect(((await wrap.textContent()) ?? '').includes('14 of 40'), `count reads "${await wrap.textContent()}"`);
  });

  await go('/components/form-field/code');
  await check('FormField', 'a warning says Warning and does not mark the field invalid', async () => {
    const f = ex().locator('[data-component="FormField"]', { hasText: '2,000 people' }).first();
    const i = f.locator('input');
    expect(await i.getAttribute('aria-invalid') === null, 'marked invalid');
    const said = await i.evaluate((e) => (e.getAttribute('aria-describedby') ?? '').split(' ').map((id) => document.getElementById(id)?.textContent ?? '').join(' '));
    expect(/Warning/.test(said) && /2,000 people/.test(said), `describedby reads "${said}"`);
  });

  await go('/components/fieldset/code');
  await check('Fieldset', 'a group error is read with the group and says Error', async () => {
    const f = ex().locator('fieldset', { hasText: 'Choose at least one paper' }).first();
    const said = await f.evaluate((e) => (e.getAttribute('aria-describedby') ?? '').split(' ').map((id) => document.getElementById(id)?.textContent ?? '').join(' '));
    expect(/Error/.test(said) && /at least one paper/.test(said), `describedby reads "${said}"`);
  });

  await go('/components/file-upload/code');
  await check('FileUpload', 'each file says where its upload has got to', async () => {
    const rows = ex().locator('[data-component="FileUpload"] li');
    const txt = await rows.allTextContents();
    expect(txt.some((x) => /Uploaded/.test(x)) && txt.some((x) => /dropped/.test(x)), `rows: ${txt.join(' / ').slice(0, 160)}`);
    expect(await ex().locator('[data-component="FileUpload"] [role="progressbar"]').count() >= 1, 'no progress bar on the uploading file');
  });
}
