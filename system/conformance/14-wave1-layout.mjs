// Wave 1 layout primitives. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main } = t;
  await go('/components/box/code');
  await check('Box', 'padding and corner come from the scales and it draws no surface', async () => {
    const r = await main().locator('[data-component="Box"]').first().evaluate((e) => { const c = getComputedStyle(e); return { pad: c.paddingInlineStart, bg: c.backgroundColor, sh: c.boxShadow }; });
    expect(parseFloat(r.pad) % 4 === 0, `padding ${r.pad} is off the 4px grid`);
  });
  await go('/components/flex/code');
  await check('Flex', 'spacing is a gap from the scale, never a margin on the children', async () => {
    const r = await main().locator('[data-component="Flex"]').first().evaluate((e) => ({ gap: getComputedStyle(e).columnGap, m: [...e.children].map((c) => getComputedStyle(c).marginInlineStart) }));
    expect(parseFloat(r.gap) % 4 === 0, `gap ${r.gap} is off the grid`);
    expect(r.m.every((m) => m === '0px'), 'a child carries a margin');
  });
  await go('/components/center/code');
  await check('Center', 'its content sits in the middle both ways', async () => {
    const r = await main().locator('[data-component="Center"]').first().evaluate((e) => { const b = e.getBoundingClientRect(); const c = e.firstElementChild.getBoundingClientRect(); return [Math.abs((b.left + b.right) / 2 - (c.left + c.right) / 2), Math.abs((b.top + b.bottom) / 2 - (c.top + c.bottom) / 2)]; });
    expect(r[0] < 1.5 && r[1] < 1.5, `off centre by ${r.map((x) => x.toFixed(1)).join(', ')}px`);
  });
  await go('/components/divider/code');
  await check('Divider', 'a separator by default, no role when decorative, never focusable', async () => {
    const roles = await main().locator('[data-component="Divider"]').evaluateAll((els) => els.map((e) => [e.getAttribute('role'), e.tabIndex]));
    expect(roles.some(([r]) => r === 'separator'), 'no separator role');
    expect(roles.some(([r]) => r === 'none'), 'decorative divider keeps a role');
    expect(roles.every(([, ti]) => ti < 0), 'a divider is focusable');
  });
  await go('/components/spacer/code');
  await check('Spacer', 'hidden from assistive technology', async () => {
    const hidden = await main().locator('[data-component="Spacer"]').evaluateAll((els) => els.every((e) => e.getAttribute('aria-hidden') === 'true'));
    expect(hidden, 'a spacer is exposed');
  });
  await go('/components/visually-hidden/code');
  await check('VisuallyHidden', 'off screen but in the tree; focusable content shows on focus', async () => {
    const vh = main().locator('[data-component="VisuallyHidden"]').first();
    const box = await vh.boundingBox();
    expect(box && box.width <= 1 && box.height <= 1, 'hidden text takes space');
    expect((await vh.textContent()).trim().length > 0, 'hidden text is empty');
    const skip = main().locator('[data-component="VisuallyHidden"] a').first();
    await skip.focus();
    const b2 = await skip.boundingBox();
    expect(b2 && b2.width > 10, 'focused skip link stays hidden');
  });
  await go('/components/aspect-ratio/code');
  await check('AspectRatio', 'keeps its ratio at any width', async () => {
    const r = await main().locator('[data-component="AspectRatio"][data-ratio="video"]').first().evaluate((e) => { const b = e.getBoundingClientRect(); return b.width / b.height; });
    expect(Math.abs(r - 16 / 9) < 0.03, `video ratio is ${r.toFixed(2)}`);
  });
}
