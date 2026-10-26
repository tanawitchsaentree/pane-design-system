import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:3000/examples/sign-in', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/verify_signin.png' });
const sidebarExists = await page.locator('text=Dial v0.1.0').count();
console.log('sidebar "Dial v0.1.0" found on /examples/sign-in:', sidebarExists);

await page.goto('http://localhost:3000/examples/dashboard', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/verify_dashboard.png' });
const sidebarExists2 = await page.locator('text=Dial v0.1.0').count();
console.log('sidebar "Dial v0.1.0" found on /examples/dashboard:', sidebarExists2);

await page.goto('http://localhost:3000/introduction', { waitUntil: 'networkidle' });
const sidebarExists3 = await page.locator('text=Dial v0.1.0').count();
console.log('sidebar "Dial v0.1.0" found on /introduction (should be 1):', sidebarExists3);
await browser.close();
