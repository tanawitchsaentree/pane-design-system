#!/usr/bin/env node
// Gate Proof Rule (ds-conventions/SKILL.md) applied to story-title-check.mjs.
//
// The check exists to stop a bug that already happened twice in one batch ('Layout/Card' filed under
// the wrong category, 'DataDisplay/Stat' missing a space and creating a second sidebar group). A new
// gate that has never been seen red is not proven to exist, and for this one that matters more than
// usual: the failure it guards is invisible in CI (component renders, tests pass, story works), so
// if the gate is toothless nobody finds out from any other signal.
//
// Each case writes a synthetic mini-repo in a temp dir, with its own category mapping, and points the
// real script at both via STORY_CHECK_ROOT / STORY_CHECK_CATEGORIES — so the mutations never touch
// packages/react or apps/storybook, and a fixture can declare a mapping that is deliberately wrong.
//
// This file is itself gate-proofed. story-title-check.mjs was mutated eleven ways — one per branch
// that can independently make the gate toothless — and the suite went red for every one, then
// reverted byte-identical (sha256 cbf5fbc7…). To repeat by hand, edit tooling/story-title-check.mjs,
// run this file, then restore the tool:
//   M1  `if (errors.length > 0)` -> `if (false)`      gate can never fail             → 5/26
//   M2  drop STORY_CATEGORIES.includes()              any category string passes      → 17/26
//   M3  drop `name !== expectedName`                  leaf need not match filename    → 25/26
//   M4  drop `declared !== category`                  wrong group for a real category → 25/26
//   M5  drop the `storyFiles.length === 0` guard      scanning nothing reads as pass  → 25/26
//   M6  drop the whole preview.ts block               the order can be forked again   → 23/26
//   M7  drop the reverse (stale list entry) check     mapping can hold dead names     → 25/26
//   M8  drop the duplicate-title check                two files, one sidebar entry    → 25/26
//   M9  META_TITLE `^ {2}` -> `^\s*`                  a story arg's title gets read   → 25/26
//   M10 drop only the `!orderMatch` branch            no order to compare = pass      → 25/26
//   M11 compare the order as a set, not a sequence    reordering stops being drift    → 25/26
// M1 dropping to 5/26 is the number worth reading: only the five cases that assert green stayed
// green, so the other twenty-one are reading the exit code rather than passing by coincidence. Each
// of M3-M5 and M7-M11 taking out exactly one case means no case is doing double duty — one branch,
// one proof. M6 takes three because it removes the entire preview.ts block at once; M10 and M11 exist
// precisely so each branch inside that block is also proved on its own.
//
// M11 is the one that would otherwise be easy to get wrong: a set comparison passes every fixture
// where the categories are all present and spelled correctly, which is exactly the state a silently
// reordered sidebar is in.
//
// ใช้: node tooling/story-title-check.selftest.mjs
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REAL_SCRIPT = fileURLToPath(new URL('./story-title-check.mjs', import.meta.url));

let failures = 0;
let total = 0;

// A story file is only its meta block for this check's purposes — the script reads `title:` and
// nothing else, so the fixtures stay minimal rather than importing React.
function storyFile(title, { indent = 2, quote = "'" } = {}) {
  const titleLine = title === null ? '' : `${' '.repeat(indent)}title: ${quote}${title}${quote},\n`;
  return `import type { Meta } from '@storybook/react';\n\nconst meta: Meta = {\n${titleLine}};\n\nexport default meta;\n`;
}

// `files` maps a repo-relative path to file content. A `preview.ts` whose storySort order matches the
// fixture's own category list is written by default, so the drift check is satisfied and cannot supply
// the red for unrelated cases.
//
// It has to be generated per-fixture rather than being one constant: preview.ts cannot import the
// shared list (Storybook's csf-tools parses that file statically and rejects an imported identifier
// outright, which is a build failure the real repo already hit), so the check compares literal strings
// — and each fixture declares its own map, hence its own expected order.
const previewFor = (map) =>
  `export default { parameters: { options: { storySort: { order: [${[...Object.keys(map), '*']
    .map((c) => `'${c}'`)
    .join(', ')}] } } } };\n`;

// The fixture's own category mapping, generated in the same shape as the real story-categories.mjs
// (including the duplicate-name guard, so a case can exercise that too). Fixtures declare a mapping
// rather than reusing the real one because the reverse check — a mapped component with no story — is
// impossible to test against a mapping that must stay in sync with the real repo.
const DEFAULT_MAP = { Foundations: ['Colors'], Layout: ['Box', 'Flex'], Atoms: ['Text'], 'Data Display': ['Card'] };

function categoriesModule(map) {
  return `export const STORY_CATEGORY_MAP = ${JSON.stringify(map, null, 2)};
export const STORY_CATEGORIES = Object.keys(STORY_CATEGORY_MAP);
export const STORY_SORT_ORDER = [...STORY_CATEGORIES, '*'];
export const CATEGORY_OF = (() => {
  const m = new Map();
  for (const [c, names] of Object.entries(STORY_CATEGORY_MAP)) {
    for (const n of names) {
      if (m.has(n)) throw new Error(\`duplicate "\${n}" in \${m.get(n)} and \${c}\`);
      m.set(n, c);
    }
  }
  return m;
})();
`;
}

function makeWorld(files, { preview, map = DEFAULT_MAP } = {}) {
  // `preview: null` means "write no preview.ts at all"; omitting it means "write a matching one".
  if (preview === undefined) preview = previewFor(map);
  const root = mkdtempSync(join(tmpdir(), 'story-title-selftest-'));
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(root, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content);
  }
  if (preview !== null) {
    const p = join(root, 'apps', 'storybook', '.storybook', 'preview.ts');
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, preview);
  }
  const categoriesPath = join(root, 'fixture-categories.mjs');
  writeFileSync(categoriesPath, categoriesModule(map));
  return { root, categoriesPath };
}

function run({ root, categoriesPath }) {
  const r = spawnSync('node', [REAL_SCRIPT], {
    encoding: 'utf8',
    env: { ...process.env, STORY_CHECK_ROOT: root, STORY_CHECK_CATEGORIES: categoriesPath },
  });
  return { exitCode: r.status ?? 1, out: (r.stdout ?? '') + (r.stderr ?? '') };
}

function assertCase(name, files, expect, opts) {
  total++;
  const world = makeWorld(files, opts);
  try {
    const result = run(world);
    const ok = expect(result, result.out);
    if (!ok) {
      failures++;
      console.error(`✗ FAIL: ${name}`);
      console.error(`  exit=${result.exitCode}\n  output:\n${result.out.split('\n').map((l) => '    ' + l).join('\n')}`);
    } else {
      console.log(`✓ ${name}`);
    }
  } finally {
    rmSync(world.root, { recursive: true, force: true });
  }
}

const P = (n) => `packages/react/src/components/${n}/${n}.stories.tsx`;

// ---------------------------------------------------------------------------
// REVERT side first. Without a green case every red below proves nothing, since a script that always
// exits 1 would pass the entire mutation set.
// ---------------------------------------------------------------------------
assertCase(
  'REVERT: title ถูกทุกไฟล์ → เขียว (พิสูจน์ว่าไม่ได้แดงทุกกรณี)',
  {
    [P('Card')]: storyFile('Data Display/Card'),
    [P('Box')]: storyFile('Layout/Box'),
    'apps/storybook/src/foundations/Colors.stories.tsx': storyFile('Foundations/Colors'),
  },
  (r, out) => r.exitCode === 0 && /3 story titles all use a declared category/.test(out),
  { map: { Foundations: ['Colors'], Layout: ['Box'], 'Data Display': ['Card'] } },
);

// ---------------------------------------------------------------------------
// The two real bugs, reproduced exactly. These are the cases that justify the file existing.
// ---------------------------------------------------------------------------
assertCase(
  "MUTATE: 'DataDisplay/Stat' ไม่มีเว้นวรรค (บั๊กจริงของ Stat) → ต้องแดง และบอกชื่อที่ถูก",
  { [P('Stat')]: storyFile('DataDisplay/Stat') },
  (r, out) => r.exitCode === 1 && /not in tooling\/story-categories\.mjs/.test(out) && /Did you mean 'Data Display'\?/.test(out),
  { map: { 'Data Display': ['Stat'] } },
);

assertCase(
  "MUTATE: 'Layout/Card' หมวดสะกดถูกแต่ผิดหมวด (บั๊กจริงของ Card) → ต้องแดง พร้อมบอกหมวดที่ถูก",
  // The half that a category-name-only check cannot decide: 'Layout' IS a real category and 'Card'
  // IS the filename, so nothing about the string is wrong — only which group Card belongs to. This
  // is why story-categories.mjs maps component -> category instead of listing category names. The
  // first draft of this file checked names only, and this exact case passed the gate.
  { [P('Card')]: storyFile('Layout/Card') },
  (r, out) =>
    r.exitCode === 1 &&
    /files Card under 'Layout'/.test(out) &&
    /puts it in 'Data Display'/.test(out),
  { map: { Layout: ['Box'], 'Data Display': ['Card'] } },
);

assertCase(
  'MUTATE: title ลงท้ายด้วยชื่อที่ไม่ตรงไฟล์ (Layout/Box ในไฟล์ Flex) → ต้องแดง',
  { [P('Flex')]: storyFile('Layout/Box') },
  (r, out) => r.exitCode === 1 && /but the file is Flex\.stories\.tsx/.test(out),
  { map: { Layout: ['Box', 'Flex'] } },
);

assertCase(
  'MUTATE: component ที่ไม่ได้อยู่ในลิสต์เลย → ต้องแดง (component ใหม่ต้องถูกจัดหมวดอย่างตั้งใจ)',
  { [P('NewThing')]: storyFile('Layout/NewThing') },
  (r, out) => r.exitCode === 1 && /'NewThing' is not listed in tooling\/story-categories\.mjs/.test(out),
  { map: { Layout: ['Box'] } },
);

// The reverse direction: the mapping is only a source of truth if it cannot quietly accumulate names
// that describe nothing (a deleted story, or a rename that left the old name behind).
assertCase(
  'MUTATE: ลิสต์มีชื่อ component ที่ไม่มี story จริง → ต้องแดง (ลิสต์ต้องไม่มีชื่อค้าง)',
  { [P('Box')]: storyFile('Layout/Box') },
  (r, out) => r.exitCode === 1 && /'Layout\/Deleted' is listed but no Deleted\.stories\.tsx/.test(out),
  { map: { Layout: ['Box', 'Deleted'] } },
);

assertCase(
  'GUARD: ลิสต์ใส่ชื่อเดียวกันสองหมวด → ต้องแดงตอนโหลดลิสต์ ไม่ใช่เลือกหมวดแรกเงียบๆ',
  { [P('Box')]: storyFile('Layout/Box') },
  (r, out) => r.exitCode !== 0 && /duplicate "Box"/.test(out),
  { map: { Layout: ['Box'], Atoms: ['Box'] } },
);

// ---------------------------------------------------------------------------
// Every other way a category string can drift. Each is a real typo shape, not a hypothetical.
// ---------------------------------------------------------------------------
for (const [label, bad] of [
  ['ตัวเล็ก', 'layout/Box'],
  ['เติม s', 'Layouts/Box'],
  ['ใช้ขีดกลาง', 'Data-Display/Box'],
  ['เว้นวรรคเกิน', 'Data  Display/Box'],
  ['ชื่อที่คิดขึ้นใหม่เอง', 'Primitives/Box'],
]) {
  assertCase(
    `MUTATE: category ${label} ('${bad.split('/')[0]}') → ต้องแดง`,
    { [P('Box')]: storyFile(bad) },
    (r, out) => r.exitCode === 1 && /not in tooling\/story-categories\.mjs/.test(out),
    { map: { Layout: ['Box'], 'Data Display': ['Card'] } },
  );
}

// ---------------------------------------------------------------------------
// Shape of the title itself. Storybook accepts arbitrary nesting depth, so nothing but this check
// stops 'Layout/Primitives/Box' from creating a sub-group one component deep.
// ---------------------------------------------------------------------------
assertCase(
  'MUTATE: title ซ้อนสามชั้น (Layout/Primitives/Box) → ต้องแดง (Storybook ยอมรับ แต่ระบบเราไม่)',
  { [P('Box')]: storyFile('Layout/Primitives/Box') },
  (r, out) => r.exitCode === 1 && /must be exactly '<Category>\/<Name>'/.test(out),
  { map: { Layout: ['Box'] } },
);

assertCase(
  'MUTATE: title ไม่มี category เลย (Box) → ต้องแดง',
  { [P('Box')]: storyFile('Box') },
  (r, out) => r.exitCode === 1 && /found 0 slashes/.test(out),
  { map: { Layout: ['Box'] } },
);

assertCase(
  'MUTATE: ไม่มี title เลย → ต้องแดง (Storybook จะเดาจาก path ให้เอง = drift เงียบๆ)',
  { [P('Box')]: storyFile(null) },
  (r, out) => r.exitCode === 1 && /no top-level `title:`/.test(out),
  { map: { Layout: ['Box'] } },
);

assertCase(
  'สอง component ใช้ title เดียวกัน → ต้องแดงว่าซ้ำ (Storybook merge เป็น entry เดียว)',
  {
    [P('Box')]: storyFile('Layout/Box'),
    [P('Flex')]: storyFile('Layout/Box'),
  },
  (r, out) => r.exitCode === 1 && /already used by/.test(out),
  { map: { Layout: ['Box', 'Flex'] } },
);

// ---------------------------------------------------------------------------
// Quote style and indentation. Prettier and hand-editing both produce double quotes sometimes, and a
// regex that only matches one style would skip those files silently — a pass by not looking.
// ---------------------------------------------------------------------------
assertCase(
  'title ใช้ double quote → ยังต้องถูกอ่าน (แดงเพราะหมวดผิด ไม่ใช่เขียวเพราะ regex ไม่ match)',
  { [P('Box')]: storyFile('Nonsense/Box', { quote: '"' }) },
  (r, out) => r.exitCode === 1 && /not in tooling\/story-categories\.mjs/.test(out),
  { map: { Layout: ['Box'] } },
);

assertCase(
  'title ใช้ backtick → ยังต้องถูกอ่าน',
  { [P('Box')]: storyFile('Nonsense/Box', { quote: '`' }) },
  (r, out) => r.exitCode === 1 && /not in tooling\/story-categories\.mjs/.test(out),
  { map: { Layout: ['Box'] } },
);

assertCase(
  'MUTATE: title ที่ indent ลึกกว่า meta ระดับบน (อยู่ใน args/parameters) ไม่ถูกนับเป็น title ของ meta',
  // A story arg named `title` (Alert and Toast both have one) must not be mistaken for the meta's
  // title. Here the meta has no top-level title at all, so the correct verdict is "no title", NOT
  // "category 'Heads up' is invalid" — the latter would mean the regex is reading the wrong line.
  {
    [P('Alert')]: `import type { Meta } from '@storybook/react';\n\nconst meta: Meta = {\n};\n\nexport default meta;\n\nexport const Default = {\n  args: {\n    title: 'Heads up',\n  },\n};\n`,
  },
  (r, out) => r.exitCode === 1 && /no top-level `title:`/.test(out) && !/Heads up/.test(out),
  { map: { 'Data Display': ['Alert'] } },
);

// ---------------------------------------------------------------------------
// Coverage guards. A gate that checks nothing, or that guards half a forked list, reads exactly like
// a gate that passes.
// ---------------------------------------------------------------------------
assertCase(
  'GUARD: ไม่มี story file เลย → ต้องแดง ไม่ใช่ "ผ่าน 0 ไฟล์" (คลาสเดียวกับ lint ที่ scan 0 ไฟล์แล้วบอกสะอาด)',
  { 'README.md': '# nothing here\n' },
  (r, out) => r.exitCode === 1 && /nothing was checked/.test(out),
  { map: {} },
);

// preview.ts's storySort order is a hand-typed copy of STORY_SORT_ORDER — duplication forced by
// Storybook's static parser, which rejects an imported identifier there ("Unexpected
// 'STORY_SORT_ORDER'", a hard `storybook build` failure that `tsc` does not catch). The four cases
// below are what makes that copy safe to keep: matching is green, and each way it can drift is red.
assertCase(
  'REVERT: preview.ts storySort ตรงกับ STORY_SORT_ORDER → เขียว (ลิสต์ที่พิมพ์มือถูกต้องต้องไม่แดง)',
  { [P('Box')]: storyFile('Layout/Box') },
  (r, out) => r.exitCode === 0 && /1 story titles/.test(out),
  {
    preview: `export default { parameters: { options: { storySort: { order: ['Layout', 'Atoms', '*'] } } } };\n`,
    map: { Layout: ['Box'], Atoms: [] },
  },
);

assertCase(
  'MUTATE: preview.ts มีหมวดไม่ครบ (fork ลิสต์กลับไปพิมพ์มือ) → ต้องแดง',
  { [P('Box')]: storyFile('Layout/Box') },
  (r, out) => r.exitCode === 1 && /storySort order has drifted/.test(out),
  {
    preview: `export default { parameters: { options: { storySort: { order: ['Layout', '*'] } } } };\n`,
    map: { Layout: ['Box'], Atoms: [] },
  },
);

assertCase(
  "MUTATE: preview.ts สลับลำดับหมวด (sidebar เรียงผิดแบบไม่มีใครรู้) → ต้องแดง",
  // Order is the whole point of the list — every entry is present and spelled right here, so a
  // set-comparison would call this green while the sidebar silently reorders itself.
  { [P('Box')]: storyFile('Layout/Box') },
  (r, out) => r.exitCode === 1 && /storySort order has drifted/.test(out),
  {
    preview: `export default { parameters: { options: { storySort: { order: ['Atoms', 'Layout', '*'] } } } };\n`,
    map: { Layout: ['Box'], Atoms: [] },
  },
);

assertCase(
  'GUARD: preview.ts ไม่มี storySort inline เลย (เช่นกลับไป import หรือลบทิ้ง) → ต้องแดง ไม่ใช่ผ่านเพราะไม่มีอะไรให้เทียบ',
  // The silent-skip shape: a check that finds nothing to compare must not report success. Importing
  // the constant is the specific way this happens, and it is also a Storybook build failure.
  { [P('Box')]: storyFile('Layout/Box') },
  (r, out) => r.exitCode === 1 && /could not find an inline `storySort/.test(out),
  {
    preview: `import { STORY_SORT_ORDER } from '../../../tooling/story-categories.mjs';\nexport default { parameters: { options: { storySort: { order: STORY_SORT_ORDER } } } };\n`,
    map: { Layout: ['Box'] },
  },
);

assertCase(
  'story file ใน apps/storybook (ไม่ใช่แค่ packages/react) ก็ถูกตรวจด้วย',
  { 'apps/storybook/src/foundations/Colors.stories.tsx': storyFile('Nonsense/Colors') },
  (r, out) => r.exitCode === 1 && /not in tooling\/story-categories\.mjs/.test(out),
  { map: { Foundations: ['Colors'] } },
);

assertCase(
  'ไฟล์ใน node_modules/dist/build ต้องถูกข้าม (ไม่งั้น dependency ของคนอื่นทำ gate เราแดง)',
  {
    [P('Box')]: storyFile('Layout/Box'),
    'node_modules/some-dep/Bad.stories.tsx': storyFile('Nonsense/Bad'),
    'packages/react/dist/Bad.stories.tsx': storyFile('Nonsense/Bad'),
    'apps/storybook/storybook-static/Bad.stories.tsx': storyFile('Nonsense/Bad'),
  },
  (r, out) => r.exitCode === 0 && /1 story titles/.test(out),
  { map: { Layout: ['Box'] } },
);

console.log(`\n${total - failures}/${total} gate-proof cases passed`);
if (failures) {
  console.error(`✗ ${failures} gate-proof case(s) FAILED — story-title-check.mjs ไม่ผ่าน Gate Proof Rule ของตัวเอง`);
  process.exit(1);
}
console.log('✓ story-title-check.mjs ผ่าน Gate Proof Rule (mutate→confirm-red→revert แบบ automated)');
