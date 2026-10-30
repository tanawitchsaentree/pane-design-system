// Wave 8 inputs. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;
  // examples only: the header's live demo stage renders the component first on every tab
  const ex = () => main().locator('figure.example');
  const tiny = (name, type, size) => ({ name, mimeType: type, buffer: Buffer.alloc(size, 1) });

  await go('/components/password-input/code');
  await check('PasswordInput', 'the show button toggles what is typed and says its state', async () => {
    const root = ex().locator('[data-component="PasswordInput"]').first();
    const input = root.locator('input');
    const btn = root.locator('button[aria-pressed]');
    expect(await input.getAttribute('type') === 'password', 'the field starts shown');
    await btn.click();
    expect(await input.getAttribute('type') === 'text', 'the button does not show the text');
    expect(await btn.getAttribute('aria-pressed') === 'true', 'the button does not say it is on');
    await btn.click();
    expect(await input.getAttribute('type') === 'password', 'the button does not hide it again');
  });
  await check('PasswordInput', 'it carries the autocomplete name password managers need', async () => {
    const ac = await ex().locator('[data-component="PasswordInput"] input').evaluateAll((els) => els.map((e) => e.getAttribute('autocomplete')));
    expect(ac.includes('current-password') && ac.includes('new-password'), `autocomplete names: ${ac.join(', ')}`);
  });

  await go('/components/search-input/code');
  await check('SearchInput', 'it is a search landmark with a named field', async () => {
    const root = ex().locator('[data-component="SearchInput"]').first();
    expect(await root.getAttribute('role') === 'search', 'no search landmark');
    expect(await root.locator('input').getAttribute('aria-label'), 'the field has no name');
  });
  await check('SearchInput', 'Esc clears the query and keeps focus in the field', async () => {
    const input = ex().locator('[data-component="SearchInput"] input').first();
    await input.fill('Senja'); await page.keyboard.press('Escape');
    expect(await input.inputValue() === '', 'Esc did not clear');
    expect(await input.evaluate((e) => e === document.activeElement), 'focus left the field');
  });
  await check('SearchInput', 'the clear button shows with a query and puts focus back', async () => {
    const root = ex().locator('[data-component="SearchInput"]').first();
    const input = root.locator('input');
    expect(await root.locator('button').count() === 0, 'a clear button with no query');
    await input.fill('Reine');
    await root.locator('button[aria-label="Clear search"]').click();
    expect(await input.inputValue() === '', 'the button did not clear');
    expect(await input.evaluate((e) => e === document.activeElement), 'focus did not return to the field');
  });

  await go('/components/number-input/code');
  await check('NumberInput', 'arrow keys step and Home and End go to the limits', async () => {
    const input = ex().locator('[data-component="NumberInput"] [role="spinbutton"]').first();
    await input.focus(); await page.keyboard.press('ArrowUp');
    expect(await input.getAttribute('aria-valuenow') === '2', `ArrowUp gave ${await input.getAttribute('aria-valuenow')}`);
    await page.keyboard.press('End');
    expect(await input.getAttribute('aria-valuenow') === '10', 'End did not go to the top');
    await page.keyboard.press('Home');
    expect(await input.getAttribute('aria-valuenow') === '1', 'Home did not go to the bottom');
  });
  await check('NumberInput', 'a typed number is held to the limits when the field is left', async () => {
    const input = ex().locator('[data-component="NumberInput"] [role="spinbutton"]').first();
    await input.fill('40'); await input.blur();
    expect(await input.inputValue() === '10', `40 became ${await input.inputValue()}`);
  });
  await check('NumberInput', 'the steppers stop at the limits', async () => {
    const root = ex().locator('[data-component="NumberInput"]').first();
    expect(await root.locator('button[aria-label^="Increase"]').isDisabled(), 'plus still works at the top');
    expect(await root.locator('button[aria-label^="Decrease"]').isEnabled(), 'minus is off at the top');
  });

  await go('/components/range-slider/code');
  await check('RangeSlider', 'two sliders, each named for its end', async () => {
    const names = await ex().locator('[data-component="RangeSlider"]').first().locator('[role="slider"]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')));
    expect(names.length === 2 && /minimum/.test(names[0] ?? '') && /maximum/.test(names[1] ?? ''), `names: ${names.join(', ')}`);
  });
  await check('RangeSlider', 'arrow keys move one end and the two never cross', async () => {
    const [lo, hi] = [0, 1].map((i) => ex().locator('[data-component="RangeSlider"]').first().locator('[role="slider"]').nth(i));
    await lo.focus(); await page.keyboard.press('ArrowRight');
    expect(await lo.getAttribute('aria-valuenow') === '90', `the low end is ${await lo.getAttribute('aria-valuenow')}`);
    await page.keyboard.press('End');
    expect(Number(await lo.getAttribute('aria-valuenow')) < Number(await hi.getAttribute('aria-valuenow')), 'the ends crossed');
  });

  await go('/components/editable/code');
  await check('Editable', 'Enter saves and focus returns to the text', async () => {
    const root = ex().locator('[data-component="Editable"]').first();
    await root.locator('button').click();
    const input = root.locator('input');
    expect(await input.evaluate((e) => e === document.activeElement), 'the field did not take focus');
    await input.fill('Lofoten, March'); await page.keyboard.press('Enter');
    const btn = root.locator('button');
    expect((await btn.textContent())?.includes('Lofoten, March'), 'Enter did not save');
    expect(await btn.evaluate((e) => e === document.activeElement), 'focus did not return to the text');
  });
  await check('Editable', 'Esc puts the words back', async () => {
    const root = ex().locator('[data-component="Editable"]').nth(1);
    const before = await root.locator('button').textContent();
    await root.locator('button').click(); await root.locator('input').fill('something else'); await page.keyboard.press('Escape');
    expect(await root.locator('button').textContent() === before, 'Esc kept the change');
  });

  await go('/components/file-upload/code');
  await check('FileUpload', 'a chosen file is listed with its size and a remove button', async () => {
    const root = ex().locator('[data-component="FileUpload"]').first();
    await root.locator('input[type="file"]').setInputFiles([tiny('march.pdf', 'application/pdf', 2048)]);
    expect((await root.textContent())?.includes('march.pdf'), 'the file is not listed');
    expect((await root.textContent())?.includes('2 KB'), 'no size');
    await root.locator('button[aria-label="Remove march.pdf"]').click();
    expect(!(await root.textContent())?.includes('march.pdf'), 'remove did not remove it');
  });
  await check('FileUpload', 'a refused file is said in words', async () => {
    const root = ex().locator('[data-component="FileUpload"]').first();
    await root.locator('input[type="file"]').setInputFiles([tiny('notes.txt', 'text/plain', 100)]);
    const alert = root.locator('[role="alert"]');
    expect((await alert.textContent())?.includes('notes.txt is not a file type'), 'no reason in words');
  });

  await go('/components/dropzone/code');
  await check('Dropzone', 'the zone is a button that opens the file chooser', async () => {
    const zone = ex().locator('[data-component="Dropzone"]').first();
    expect(await zone.evaluate((e) => e.tagName) === 'BUTTON', 'the zone is not a button');
    const [chooser] = await Promise.all([page.waitForEvent('filechooser', { timeout: 2000 }), zone.click()]);
    expect(!!chooser, 'no file chooser opened');
  });
  await check('Dropzone', 'a file of the wrong type is refused in words', async () => {
    const card = ex().filter({ hasText: 'Nothing chosen yet' }).first();
    await card.locator('input[type="file"]').setInputFiles([tiny('a.png', 'image/png', 10), tiny('b.jpg', 'image/jpeg', 10)]);
    const text = await card.textContent();
    expect(text?.includes('Ready to price b.jpg'), 'the right file is not taken');
    expect(text?.includes('a.png is not a file type'), 'the wrong file is not refused in words');
  });

  await go('/components/color-picker/code');
  await check('ColorPicker', 'swatches are radios named for their colour', async () => {
    const radios = ex().locator('[data-component="ColorPicker"]').first().locator('[role="radio"]');
    expect(await radios.count() >= 3, 'no swatches');
    expect(await radios.first().getAttribute('aria-label') === 'Fjord blue', 'a swatch has no name');
    await radios.nth(2).click();
    expect(await radios.nth(2).getAttribute('data-state') === 'checked', 'pressing a swatch does not choose it');
  });
  await check('ColorPicker', 'a typed hex chooses that colour', async () => {
    const root = ex().locator('[data-component="ColorPicker"]').filter({ has: page.locator('input') }).first();
    await root.locator('input').fill('#3a6ea5');
    expect(await root.locator('[role="radio"][aria-label="Fjord blue"]').getAttribute('data-state') === 'checked', 'the typed colour is not chosen');
    expect((await root.textContent())?.includes('Fjord blue'), 'the chosen name is not said');
  });

  await go('/components/otp-flow/code');
  await check('OTPFlow', 'a wrong code is said in words and the cells clear', async () => {
    const root = ex().locator('[data-component="OTPFlow"]').first();
    await root.locator('input').first().focus(); await page.keyboard.type('000000'); await page.waitForTimeout(200);
    expect((await root.locator('[role="status"]').textContent())?.includes('not right'), 'no error in words');
    const vals = await root.locator('input').evaluateAll((els) => els.map((e) => e.value).join(''));
    expect(vals === '', 'the cells kept the wrong code');
  });
  await check('OTPFlow', 'a right code is accepted', async () => {
    const root = ex().locator('[data-component="OTPFlow"]').first();
    await root.locator('input').first().focus(); await page.keyboard.type('123456'); await page.waitForTimeout(200);
    expect((await root.locator('[role="status"]').textContent())?.includes('Code accepted'), 'the right code is not accepted');
  });
  await check('OTPFlow', 'the resend button waits before it can be pressed', async () => {
    const btn = ex().locator('[data-component="OTPFlow"]').nth(1).getByRole('button', { name: 'Send a new code' });
    expect(await btn.isDisabled(), 'resend can be pressed at once');
  });
}
