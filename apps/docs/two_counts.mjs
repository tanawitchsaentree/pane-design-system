import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const appRoot = path.join(process.cwd(), 'src/app');

function findMdxFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) results.push(...findMdxFiles(full));
    else if (entry === 'page.mdx') results.push(full);
  }
  return results;
}

const mdxFiles = findMdxFiles(appRoot);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const mismatches = [];

for (const file of mdxFiles) {
  const src = readFileSync(file, 'utf8');
  const fenceCount = (src.match(/^```/gm) || []).length / 2;
  const relUrl = file
    .replace(appRoot, '')
    .replace('/(docs)', '')
    .replace('/page.mdx', '') || '/';

  await page.goto(`http://localhost:3000${relUrl}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => null);
  const renderedPreCount = await page.locator('pre').count().catch(() => -1);

  if (fenceCount !== renderedPreCount) {
    mismatches.push({ file: relUrl, fenceCount, renderedPreCount });
  }
}

console.log(JSON.stringify(mismatches, null, 2));
console.log(`checked ${mdxFiles.length} mdx files, ${mismatches.length} mismatches`);
await browser.close();
