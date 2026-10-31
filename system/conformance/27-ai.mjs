// J4: patterns for working with an AI. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main, page } = t;
  const ex = () => main().locator('figure.example');
  const eventually = async (fn, ms = 2000) => { const end = Date.now() + ms; for (;;) { try { return await fn(); } catch (e) { if (Date.now() > end) throw e; await new Promise((r) => setTimeout(r, 50)); } } };

  await go('/components/chat-message/code');
  await check('ChatMessage', 'a turn says who wrote it', async () => {
    const turns = await ex().locator('[data-component="ChatMessage"]').evaluateAll((l) => l.map((e) => `${e.tagName}:${e.getAttribute('aria-label')}`));
    expect(turns.some((x) => x === 'ARTICLE:Message from You') && turns.some((x) => x === 'ARTICLE:Message from Lumen'), `turns ${turns.slice(0, 3).join(' ')}`);
    const busy = ex().locator('[data-component="ChatMessage"][aria-busy="true"]');
    expect(await busy.count() >= 1, 'a streaming answer is not marked busy');
  });
  await check('ChatMessage', 'a step opens with Enter', async () => {
    const step = ex().locator('[data-component="ChatToolCall"]').first();
    const sum = step.locator('summary');
    await sum.focus(); await page.keyboard.press('Enter');
    await eventually(async () => expect(await step.evaluate((e) => e.open), 'Enter did not open the step'));
    const word = (await sum.textContent()) ?? '';
    expect(/^(Done|Working|Failed): /.test(word), `the step does not say its state first ("${word.slice(0, 40)}")`);
  });

  await go('/components/chat-composer/code');
  await check('ChatComposer', 'Enter sends and Shift+Enter starts a new line', async () => {
    const fig = ex().filter({ hasText: 'Enter sends' }).first();
    const f = fig.locator('textarea');
    await f.focus(); await page.keyboard.type('first'); await page.keyboard.press('Shift+Enter'); await page.keyboard.type('second');
    expect((await f.inputValue()) === 'first\nsecond', `Shift+Enter gave "${await f.inputValue()}"`);
    await page.keyboard.press('Enter');
    await eventually(async () => { expect((await f.inputValue()) === '', 'Enter did not send'); expect(((await fig.textContent()) ?? '').includes('Sent: first'), 'onSend did not get the text'); });
    expect(await f.evaluate((e) => e === document.activeElement), 'focus left the field after sending');
  });

  await go('/components/agent-status/code');
  await check('AgentStatus', 'a change of state is announced once', async () => {
    const rows = ex().locator('[data-component="AgentStatus"]');
    const roles = await rows.evaluateAll((l) => l.map((e) => e.getAttribute('role')));
    expect(roles.length && roles.every((r) => r === 'status'), `roles ${roles.join(',')}`);
    const words = await rows.evaluateAll((l) => l.map((e) => e.querySelector('p')?.textContent ?? ''));
    expect(words.some((w) => w.startsWith('Working')) && words.some((w) => w.startsWith('Waiting for you')) && words.some((w) => w.startsWith('Failed')), `words ${words.join(' | ').slice(0, 160)}`);
    const cur = ex().locator('[data-component="AgentStatus"] [aria-current="step"]');
    expect(await cur.count() >= 1, 'no current step is marked');
  });

  await go('/components/human-handoff/code');
  await check('HumanHandoff', 'each change is announced once', async () => {
    const said = await ex().locator('[data-component="HumanHandoff"]').evaluateAll((l) => l.map((e) => `${e.getAttribute('role')}:${e.querySelector('p')?.textContent}`));
    expect(said.some((s) => s === 'status:Talk to a nurse?') && said.some((s) => s.startsWith('status:Nurse Ida Holm has joined')), `said ${said.join(' | ').slice(0, 200)}`);
  });

  await go('/components/citation/code');
  await check('Citation', 'Enter opens the source', async () => {
    const m = ex().locator('[data-component="Citation"]').first();
    expect(((await m.getAttribute('aria-label')) ?? '').startsWith('Source 1, Blood test'), `the mark is named "${await m.getAttribute('aria-label')}"`);
    await m.focus(); await page.keyboard.press('Enter');
    await eventually(async () => expect(await page.getByRole('dialog', { name: /Source 1, Blood test/ }).isVisible(), 'no source card'));
    await page.keyboard.press('Escape');
    await eventually(async () => expect(await m.evaluate((e) => e === document.activeElement), 'focus did not return to the mark'));
  });
}
