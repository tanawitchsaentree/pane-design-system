#!/usr/bin/env node
// story-title-check — every story's `title:` must be `<Category>/<Name>`, where Category comes from
// tooling/story-categories.mjs and Name is the component the file belongs to.
//
// WHY (the class, not the instance): the first parallel batch produced `'Layout/Card'` (wrong
// category) and `'DataDisplay/Stat'` (no space — a separate sidebar group from Alert/Table's
// `'Data Display/…'`), because four agents each hand-typed a category string with no list to copy
// from. Both were corrected by hand. Correcting the two strings leaves the next batch in the exact
// same position, so this file makes the category list a closed set and fails the build on anything
// outside it. Same bug class as a hand-typed count in a README: it drifts, and nothing notices.
//
// A wrong category is invisible in CI and cheap to miss in review — the component renders, the
// tests pass, the story works. It shows up as a component filed under the wrong heading in the
// sidebar, or as a duplicate heading differing only in a space, which is the kind of thing a
// consumer sees before the team does.
//
// Run: node tooling/story-title-check.mjs
// Gate-proofed by tooling/story-title-check.selftest.mjs (see its header for the mutation list).

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const TOOLING_DIR = dirname(fileURLToPath(import.meta.url));

// STORY_CHECK_ROOT / STORY_CHECK_CATEGORIES exist so the selftest can point the real script at a
// synthetic mini-repo with its own category mapping. Without the second one, every fixture would
// have to name real components in real categories, which makes the reverse check (a mapped component
// with no story) impossible to exercise at all.
const REPO_ROOT = process.env.STORY_CHECK_ROOT
  ? resolve(process.env.STORY_CHECK_ROOT)
  : resolve(TOOLING_DIR, '..');
const CATEGORIES_MODULE = process.env.STORY_CHECK_CATEGORIES
  ? pathToFileURL(resolve(process.env.STORY_CHECK_CATEGORIES)).href
  : './story-categories.mjs';

const { STORY_CATEGORIES, CATEGORY_OF, STORY_SORT_ORDER } = await import(CATEGORIES_MODULE);

// Scan the whole repo rather than reusing .storybook/main.ts's globs. If the globs and this check
// each carry their own idea of where stories live, a story in a third location passes this check by
// never being seen — the silent-skip failure the no-hardcode lint already hit once (it ran from the
// wrong cwd, scanned 0 files, and reported clean).
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.turbo', 'storybook-static', '.next']);

function findStoryFiles(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.storybook') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      findStoryFiles(full, found);
    } else if (/\.stories\.(ts|tsx)$/.test(entry.name)) {
      found.push(full);
    }
  }
  return found;
}

// The `title:` of the default-exported meta object. Matched at the start of a line with exactly two
// spaces of indent, which is where a top-level meta property sits; a `title:` nested deeper belongs
// to something else (a story's args, a docs description) and must not be picked up instead.
const META_TITLE = /^ {2}title: (['"`])(.*?)\1,?$/m;

const errors = [];
const seenTitles = new Map();
const storyFiles = findStoryFiles(REPO_ROOT).sort();

for (const file of storyFiles) {
  const rel = relative(REPO_ROOT, file);
  const source = readFileSync(file, 'utf8');
  const match = META_TITLE.exec(source);

  // No title at all is not a neutral default: Storybook derives one from the file path, so the
  // component lands in a group named after a directory and drifts out of the sidebar silently.
  if (!match) {
    errors.push(`${rel}\n    no top-level \`title:\` in the meta object — Storybook would derive one from the file path`);
    continue;
  }

  const title = match[2];
  const slashCount = (title.match(/\//g) ?? []).length;
  if (slashCount !== 1) {
    errors.push(`${rel}\n    title '${title}' must be exactly '<Category>/<Name>' (found ${slashCount} slash${slashCount === 1 ? '' : 'es'})`);
    continue;
  }

  const [category, name] = title.split('/');

  if (!STORY_CATEGORIES.includes(category)) {
    // Name the near-miss explicitly. 'DataDisplay' vs 'Data Display' is one space, and reading
    // "not in the list" without seeing the intended neighbour is how the first one got shipped.
    const squashed = category.replace(/[\s-]/g, '').toLowerCase();
    const near = STORY_CATEGORIES.find((c) => c.replace(/[\s-]/g, '').toLowerCase() === squashed);
    const hint = near ? ` Did you mean '${near}'?` : '';
    errors.push(
      `${rel}\n    category '${category}' is not in tooling/story-categories.mjs.${hint}\n    allowed: ${STORY_CATEGORIES.map((c) => `'${c}'`).join(', ')}`,
    );
    continue;
  }

  // Two files claiming one title merges them into a single sidebar entry, and the second file's
  // stories appear under the first one's name. Checked before the name/category comparisons below so
  // the duplicate is reported as a duplicate rather than as whichever of the two happens to
  // disagree with its filename.
  if (seenTitles.has(title)) {
    errors.push(`${rel}\n    title '${title}' is already used by ${seenTitles.get(title)} — Storybook would merge them into one sidebar entry`);
    continue;
  }
  seenTitles.set(title, rel);

  // The leaf has to name the thing the file is about.
  const expectedName = basename(file).replace(/\.stories\.(ts|tsx)$/, '');
  if (name !== expectedName) {
    errors.push(`${rel}\n    title '${title}' ends in '${name}' but the file is ${basename(file)} — expected '${category}/${expectedName}'`);
    continue;
  }

  // And the category has to be the one the mapping records for that component. This is the half a
  // category-only check cannot decide: 'Layout/Card' has a real category and a leaf matching its own
  // filename, so the only thing wrong with it is which group Card belongs to. Without the mapping,
  // the exact bug that shipped passes the gate written to catch it.
  const declared = CATEGORY_OF.get(expectedName);
  if (declared === undefined) {
    errors.push(
      `${rel}\n    '${expectedName}' is not listed in tooling/story-categories.mjs — add it under the category it belongs to (a new component is a deliberate sidebar decision, not a typed string)`,
    );
    continue;
  }
  if (declared !== category) {
    errors.push(`${rel}\n    title '${title}' files ${expectedName} under '${category}', but story-categories.mjs puts it in '${declared}' — expected '${declared}/${expectedName}'`);
    continue;
  }
}

// The reverse direction. A component listed in the mapping with no story file is either a story that
// was deleted or never written, or a name left behind by a rename — and the mapping is only a source
// of truth if it cannot silently accumulate entries that describe nothing.
const withStories = new Set([...seenTitles.keys()].map((t) => t.split('/')[1]));
for (const [name, category] of CATEGORY_OF) {
  if (!withStories.has(name)) {
    errors.push(`tooling/story-categories.mjs\n    '${category}/${name}' is listed but no ${name}.stories.tsx has that title — delete the entry or write the story`);
  }
}

// preview.ts's storySort order must match STORY_SORT_ORDER exactly.
//
// It cannot import the constant: Storybook's csf-tools parses preview.ts statically instead of
// executing it, and an imported identifier under `options.storySort` fails the build outright
// ("Unexpected 'STORY_SORT_ORDER'"). Importing it is what a first attempt did — `tsc` passed and
// `storybook build` broke, which is why this check compares the literal list instead of looking for
// an import. The duplication is forced by the tool; this check is what keeps it honest, since a
// silently forked order is how 'DataDisplay' and 'Data Display' became two sidebar groups.
const PREVIEW_PATH = join(REPO_ROOT, 'apps', 'storybook', '.storybook', 'preview.ts');
if (existsSync(PREVIEW_PATH)) {
  const preview = readFileSync(PREVIEW_PATH, 'utf8');
  const orderMatch = /storySort:\s*\{\s*order:\s*\[([^\]]*)\]/.exec(preview);
  if (!orderMatch) {
    errors.push(
      `apps/storybook/.storybook/preview.ts\n    could not find an inline \`storySort: { order: [...] }\` — it must be an inline array literal (Storybook parses this file statically) and must match STORY_SORT_ORDER in tooling/story-categories.mjs`,
    );
  } else {
    const inlined = [...orderMatch[1].matchAll(/'([^']*)'|"([^"]*)"/g)].map((m) => m[1] ?? m[2]);
    const expected = STORY_SORT_ORDER;
    if (inlined.length !== expected.length || inlined.some((v, i) => v !== expected[i])) {
      errors.push(
        `apps/storybook/.storybook/preview.ts\n    storySort order has drifted from tooling/story-categories.mjs` +
          `\n      preview.ts:            [${inlined.map((c) => `'${c}'`).join(', ')}]` +
          `\n      story-categories.mjs:  [${expected.map((c) => `'${c}'`).join(', ')}]`,
      );
    }
  }
}

// Scanning zero files and printing a pass is worse than failing: the no-hardcode lint did exactly
// that from the wrong cwd for weeks and read as clean the whole time.
if (storyFiles.length === 0) {
  console.error(`✗ story-title-check found no *.stories.tsx under ${REPO_ROOT} — nothing was checked, so nothing is proven.`);
  process.exit(1);
}

if (errors.length > 0) {
  console.error(`✗ ${errors.length} story title problem(s) in ${storyFiles.length} story file(s):\n`);
  for (const e of errors) console.error(`  ${e}\n`);
  console.error('Categories are a closed set. Fix the title, or add the category to tooling/story-categories.mjs deliberately.');
  process.exit(1);
}

const perCategory = STORY_CATEGORIES.map((c) => {
  const n = [...seenTitles.keys()].filter((t) => t.startsWith(`${c}/`)).length;
  return `${c} ${n}`;
}).join(' · ');
console.log(`✓ ${storyFiles.length} story titles all use a declared category (${perCategory})`);
