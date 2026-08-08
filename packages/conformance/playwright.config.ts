import { defineConfig, devices } from '@playwright/test';
// Conformance = ข้อสอบที่ jsdom ทำแทนไม่ได้ (roving focus, focus trap, positioning, forced-colors, ขนาดจริง)
export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:6006', trace: 'on-first-retry' },
  webServer: { command: 'pnpm storybook --ci', url: 'http://localhost:6006', reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'forced-colors', use: { ...devices['Desktop Chrome'], forcedColors: 'active' } },
    { name: 'reduced-motion', use: { ...devices['Desktop Chrome'], reducedMotion: 'reduce' } },
  ],
});
