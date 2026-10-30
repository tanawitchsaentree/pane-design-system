// Language: the Thai catalog reaches the components, th-TH gives the Buddhist year, and English stays the
// default. Run by tooling/kiln/conformance.mjs on the built book.
export default async function (t) {
  const { check, expect, go, main } = t;
  const demo = () => main().locator('.lang-demo');

  await go('/getting-started/language');
  await check('PaneProvider', 'under the Thai catalog the components speak Thai', async () => {
    const prev = await demo().locator('[data-component="Calendar"] button[aria-label="เดือนก่อนหน้า"]').count();
    expect(prev === 1, 'Calendar previous-month button is not Thai');
    const next = await demo().locator('[data-component="Pagination"]').innerText();
    expect(next.includes('ถัดไป') && next.includes('ก่อนหน้า'), `Pagination reads "${next.replace(/\s+/g, ' ').slice(0, 60)}"`);
    const all = await demo().locator('[data-component="DataGrid"] [role="checkbox"]').first().getAttribute('aria-label');
    expect(all === 'เลือกทุกแถว', `select-all is "${all}"`);
    const otp = await demo().locator('[data-component="OTPFlow"]').innerText();
    expect(otp.includes('ส่งรหัสใหม่') && otp.includes('กรอกรหัส 6 หลัก'), 'OTPFlow is not Thai');
  });
  await check('PaneProvider', 'th-TH writes the month in Thai and the year in the Buddhist era', async () => {
    const title = (await demo().locator('[data-component="Calendar"] h2').innerText()).trim();
    expect(/พฤศจิกายน/.test(title) && /2569/.test(title), `the calendar title is "${title}"`);
  });
  await go('/components/calendar/code');
  await check('PaneProvider', 'without a provider the components speak English, as before', async () => {
    const prev = await main().locator('figure.example [data-component="Calendar"] button[aria-label="Previous month"]').count();
    expect(prev >= 1, 'English Calendar lost its previous-month name');
  });
}
