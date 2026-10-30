// Wave 10 patterns. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;
  // examples only: the header's live demo stage renders the component first on every tab
  const ex = () => main().locator('figure.example');
  const active = () => page.evaluate(() => ({ id: document.activeElement?.id ?? '', text: document.activeElement?.textContent ?? '', label: document.activeElement?.getAttribute('aria-label') ?? '' }));

  await go('/components/form/code');
  await check('Form', 'nothing in a form takes focus when the page opens', async () => {
    expect(await page.evaluate(() => !document.activeElement?.closest('[data-component="Form"]')), 'a form took focus on load');
  });
  await check('Form', 'a failed submit shows a summary that takes focus and links to each field', async () => {
    const form = ex().locator('[data-component="Form"]').nth(1);
    await form.getByRole('button', { name: 'Continue' }).click(); await page.waitForTimeout(100);
    const summary = form.locator('[role="alert"]');
    expect(await summary.evaluate((e) => e === document.activeElement), 'the summary did not take focus');
    expect(await summary.locator('a').count() === 2, 'not every error is listed');
    await summary.locator('a').first().click();
    expect((await active()).id === 'fe-email', 'the link did not move focus to its field');
  });
  await go('/components/wizard/code');
  await check('Wizard', 'Next moves on and the step heading takes focus', async () => {
    const w = ex().locator('[data-component="Wizard"]').first();
    await w.getByRole('button', { name: 'Next' }).click(); await page.waitForTimeout(100);
    const a = await active();
    expect(a.text.includes('Address') && a.text.includes('Step 2 of 3'), `focus is on ${a.text}`);
  });
  await check('Wizard', 'Back keeps what was typed', async () => {
    const w = ex().locator('[data-component="Wizard"]').first();
    await w.locator('input:visible').fill('Torget 1');
    await w.getByRole('button', { name: 'Back' }).click(); await w.getByRole('button', { name: 'Next' }).click();
    expect(await w.locator('input:visible').inputValue() === 'Torget 1', 'the typed address was lost');
  });
  await check('Wizard', 'a step that fails its check stays', async () => {
    const w = ex().locator('[data-component="Wizard"]').nth(1);
    await w.getByRole('button', { name: 'Next' }).click(); await page.waitForTimeout(100);
    expect((await w.textContent())?.includes('Give the shop a name'), 'no error');
    expect((await w.textContent())?.includes('Step 1 of 2'), 'it moved on');
  });

  await go('/components/auth-form/code');
  await check('AuthForm', 'it carries the autocomplete names password managers need', async () => {
    const a = ex().locator('[data-component="AuthForm"]');
    expect(await a.first().locator('input[type="email"]').getAttribute('autocomplete') === 'username', 'sign-in email is not username');
    expect(await a.first().locator('input[name="password"]').getAttribute('autocomplete') === 'current-password', 'no current-password');
    expect(await a.nth(1).locator('input[name="password"]').getAttribute('autocomplete') === 'new-password', 'sign-up is not new-password');
  });
  await check('AuthForm', 'errors are in the summary and under each field', async () => {
    const a = ex().locator('[data-component="AuthForm"]').nth(3);
    expect(await a.locator('[role="alert"] a').count() === 2, 'the summary does not list both');
    expect(await a.locator('input[aria-invalid="true"]').count() === 2, 'the fields are not marked');
  });

  await go('/components/command-palette/code');
  await check('CommandPalette', 'typing filters and focus stays in the field', async () => {
    const p = ex().locator('[data-component="CommandPalette"]').first();
    const input = p.locator('input[role="combobox"]');
    await input.fill('ship');
    expect(await p.locator('[role="option"]').count() === 1, `${await p.locator('[role="option"]').count()} commands`);
    expect(await input.evaluate((e) => e === document.activeElement), 'focus left the field');
    expect(!!(await input.getAttribute('aria-activedescendant')), 'nothing is highlighted');
  });
  await check('CommandPalette', 'arrow keys move the highlight', async () => {
    const p = ex().locator('[data-component="CommandPalette"]').first();
    const input = p.locator('input[role="combobox"]');
    await input.fill(''); const before = await input.getAttribute('aria-activedescendant');
    await page.keyboard.press('ArrowDown');
    expect(await input.getAttribute('aria-activedescendant') !== before, 'the highlight did not move');
  });
  await check('CommandPalette', 'Ctrl+K opens it and Esc closes it', async () => {
    // the previews on the page are dialogs too, drawn in place; the opened one is the extra modal over the scrim
    const dlg = page.locator('[role="dialog"][data-component="CommandPalette"]');
    const before = await dlg.count();
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.keyboard.press('Control+k'); await page.waitForTimeout(200);
    expect(await dlg.count() === before + 1, 'Ctrl+K did not open it');
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    expect(await dlg.count() === before, 'Esc did not close it');
  });

  await go('/components/notification-center/code');
  await check('NotificationCenter', 'unread notices say New and the bell gives the count', async () => {
    const panel = ex().locator('[data-component="NotificationCenter"]').first();
    expect((await panel.textContent())?.includes('New ·'), 'unread does not say New');
    const bell = ex().getByRole('button', { name: /Notifications, 2 unread/ });
    expect(await bell.count() >= 1, 'the bell does not give the count');
    await bell.first().click(); await page.waitForTimeout(150);
    expect(await page.locator('[data-radix-popper-content-wrapper] [data-component="NotificationCenter"]').count() === 1, 'the bell does not open the notices');
    await page.keyboard.press('Escape');
  });

  await go('/components/coach-mark/code');
  await check('CoachMark', 'the card says its step, with Skip tour and Next', async () => {
    const c = ex().locator('[data-component="CoachMark"]').first();
    expect((await c.textContent())?.includes('1 of 3'), 'no step');
    expect(await c.getByRole('button', { name: 'Skip tour' }).count() === 1 && await c.getByRole('button', { name: 'Next' }).count() === 1, 'no Skip tour and Next');
  });
  await check('CoachMark', 'Esc skips the tour', async () => {
    await ex().getByRole('button', { name: 'Start the tour' }).click(); await page.waitForTimeout(250);
    const card = page.locator('[data-radix-popper-content-wrapper] [data-component="CoachMark"]');
    expect(await card.count() === 1, 'the tour did not start');
    await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    expect(await card.count() === 0, 'Esc did not skip');
  });

  await go('/components/kanban-board/code');
  await check('KanbanBoard', 'Space picks a card up, arrows carry it and Space drops it, said aloud', async () => {
    const b = ex().locator('[data-component="KanbanBoard"]').first();
    const live = b.locator('[aria-live="assertive"]');
    await b.locator('[data-card="a"]').focus(); await page.keyboard.press('Space');
    expect((await live.textContent())?.includes('picked up'), 'pick up is not said');
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100);
    expect((await live.textContent())?.startsWith('Printing'), `said ${await live.textContent()}`);
    await page.keyboard.press('Space');
    expect(await b.locator('section').nth(1).locator('[data-card="a"]').count() === 1, 'the card did not move');
  });
  await check('KanbanBoard', 'Esc puts a moved card back', async () => {
    const b = ex().locator('[data-component="KanbanBoard"]').nth(1);
    await b.locator('[data-card="x"]').focus(); await page.keyboard.press('Space'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100); await page.keyboard.press('Escape');
    expect(await b.locator('section').first().locator('[data-card="x"]').count() === 1, 'the card did not go back');
  });

  await go('/components/feed/code');
  await check('Feed', 'articles are in a feed and Page Down moves between them', async () => {
    const f = ex().locator('[data-component="Feed"] [role="feed"]').first();
    await f.locator('article').first().focus(); await page.keyboard.press('PageDown');
    expect(await f.locator('article').nth(1).evaluate((e) => e === document.activeElement), 'Page Down did not move on');
  });
  await check('Feed', 'the end of a feed is said in words', async () => {
    expect((await ex().locator('[data-component="Feed"]').nth(1).textContent())?.includes('You are all caught up'), 'no end');
  });

  await go('/components/app-shell/code');
  await check('AppShell', 'the skip link moves focus to the main content', async () => {
    const s = ex().locator('[data-component="AppShell"]').first();
    await s.getByRole('link', { name: 'Skip to content' }).focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(100);
    expect(await page.evaluate(() => document.activeElement?.tagName) === 'MAIN', 'focus did not reach the main content');
  });
  await check('AppShell', 'either the sidebar or the bottom bar shows, never both', async () => {
    const s = ex().locator('[data-component="AppShell"]').first();
    const side = await s.locator('[data-component="Sidebar"]').isVisible(); const bottom = await s.locator('[data-component="BottomNav"]').isVisible();
    expect(side !== bottom, `sidebar ${side}, bottom bar ${bottom}`);
  });

  await go('/components/settings-layout/code');
  await check('SettingsLayout', 'each row names its control', async () => {
    const sw = ex().locator('[data-component="SettingsLayout"]').first().getByRole('switch', { name: 'Order emails' });
    expect(await sw.count() === 1, 'the switch has no name');
  });

  await go('/components/rich-text-editor/code');
  await check('RichTextEditor', 'the toolbar is one tab stop with arrow keys between tools', async () => {
    const tb = ex().locator('[data-component="RichTextEditor"]').first().locator('[role="toolbar"]');
    expect(await tb.locator('button[tabindex="0"]').count() === 1, 'more than one tab stop');
    await tb.locator('button[tabindex="0"]').focus(); await page.keyboard.press('ArrowRight');
    expect((await active()).label === 'Italic', 'the arrow did not move to Italic');
  });
  await check('RichTextEditor', 'a mark says when it is on', async () => {
    const ed = ex().locator('[data-component="RichTextEditor"]').first();
    await ed.locator('strong').click(); await page.waitForTimeout(100);
    expect(await ed.getByRole('button', { name: 'Bold' }).getAttribute('aria-pressed') === 'true', 'Bold does not say it is on');
  });
}
