// FormField, Label, HelperText, Fieldset and InputGroup: the parts that make a field speak. Run by
// tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, page, go, main } = t;

  await go('/components/form-field/code');
  await check('FormField', 'the label names the control and the help text describes it', async () => {
    const r = await main().locator('[data-example-live] [data-component="FormField"]').first().evaluate((f) => {
      const c = f.querySelector('input, textarea, button[role], [role="combobox"]');
      const lab = c?.labels?.[0]?.textContent ?? document.getElementById(c?.getAttribute('aria-labelledby') ?? '')?.textContent;
      const desc = (c?.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean).map((id) => document.getElementById(id)?.textContent ?? '').join(' ');
      const help = f.querySelector('[data-component="HelperText"]')?.textContent ?? '';
      return { lab, desc, help };
    });
    expect(r.lab && r.lab.trim().length > 0, 'control has no label');
    expect(!r.help || r.desc.includes(r.help.trim()), `aria-describedby "${r.desc}" misses help "${r.help}"`);
    return `"${r.lab.trim()}"`;
  });
  await check('FormField', 'an error marks the control invalid and is read before the help', async () => {
    const r = await main().locator('[data-example-live] [data-component="FormField"]').evaluateAll((fs) => fs.map((f) => {
      const err = [...f.querySelectorAll('[data-component="HelperText"]')].find((h) => h.textContent.startsWith('Error'));
      if (!err) return null;
      const c = f.querySelector('input, textarea, button[role]');
      const ids = (c?.getAttribute('aria-describedby') ?? '').split(' ');
      return { invalid: c?.getAttribute('aria-invalid'), first: ids[0] === err.id };
    }).filter(Boolean));
    expect(r.length > 0, 'no FormField with an error on the page');
    expect(r.every((x) => x.invalid === 'true' && x.first), JSON.stringify(r));
    return `${r.length} fields with errors`;
  });

  await go('/components/label/code');
  await check('Label', 'a native <label> tied to its control, and a click on it focuses the control', async () => {
    const all = await main().locator('[data-example-live] [data-component="Label"]').evaluateAll((ls) => ls.map((l) => [l.tagName, !!l.control]));
    expect(all.length > 0 && all.every((x) => x[0] === 'LABEL'), JSON.stringify(all));
    const tied = all.filter((x) => x[1]).length;
    expect(tied > 0, 'no Label on the page is tied to a control');
    const lab = main().locator('[data-example-live] [data-component="Label"]').nth(all.findIndex((x) => x[1]));
    await lab.click();
    expect(await lab.evaluate((l) => document.activeElement === l.control), 'clicking the label did not focus its control');
    return `${tied} of ${all.length} labels tied to a control`;
  });

  await go('/components/helper-text/code');
  await check('HelperText', 'the error tone says the word Error and carries a glyph, so it is not colour alone', async () => {
    const r = await main().locator('[data-example-live] [data-component="HelperText"]').evaluateAll((hs) => hs.map((h) => [h.textContent.startsWith('Error'), !!h.querySelector('svg[aria-hidden="true"]')]));
    const err = r.filter((x) => x[0]);
    expect(err.length > 0, 'no error HelperText on the page');
    expect(err.every((x) => x[1]), 'an error has no glyph');
    return `${err.length} errors of ${r.length}`;
  });

  await go('/components/fieldset/code');
  await check('Fieldset', 'a native <fieldset> whose <legend> names the group', async () => {
    const r = await page.evaluate(() => {
      const f = document.querySelector('main [data-example-live] [data-component="Fieldset"]');
      return [f?.tagName, f?.querySelector(':scope > legend')?.textContent?.trim()];
    });
    expect(r[0] === 'FIELDSET' && r[1], r.join(' '));
    return `"${r[1]}"`;
  });

  await go('/components/input-group/code');
  await check('InputGroup', 'one text input inside, with its adornments outside the input’s value and name', async () => {
    const r = await main().locator('[data-example-live] [data-component="InputGroup"]').first().evaluate((g) => {
      const inputs = g.querySelectorAll('input');
      const i = inputs[0];
      const name = i?.labels?.[0]?.textContent ?? i?.getAttribute('aria-label') ?? '';
      const adorn = [...g.children].filter((c) => !c.contains(i)).map((c) => c.textContent.trim()).filter(Boolean);
      return { n: inputs.length, value: i?.value ?? '', name, adorn };
    });
    expect(r.n === 1, `${r.n} inputs`);
    expect(r.adorn.every((a) => !r.value.includes(a)), `adornment ${r.adorn} leaked into the value "${r.value}"`);
    expect(r.name.trim().length > 0, 'the input has no name');
    return r.adorn.length ? `adornment "${r.adorn.join(', ')}"` : 'no adornment';
  });
}
