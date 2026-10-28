// The ONLY place the Storybook sidebar categories, and which component belongs to which, are
// written down.
//
// WHY this file exists (structural fix, not a "be more careful" one): the category used to be
// hand-typed into each story's `title:` by whichever agent built that component, with no list to
// copy from. Two of them drifted in the very first parallel batch — Card shipped as `'Layout/Card'`
// (a real category, wrong component) and Stat as `'DataDisplay/Stat'` (no space, which Storybook
// treats as a different sidebar group from Alert/Table's `'Data Display/…'`). Both were fixed by
// hand, which fixes the instance and leaves the class alone: the next batch has exactly the same
// nothing to copy from. Same bug class as a README with a hand-typed component count in it.
//
// WHY it lists components and not just category names: a list of names alone catches
// 'DataDisplay/Stat' and misses 'Layout/Card' entirely, because 'Layout' is a real category and
// 'Card' is the real filename — nothing about the string is wrong except which component it is
// attached to. The mapping below is what makes that decidable, so both of the two bugs that actually
// happened are caught rather than one.
//
// Adding a component means adding its name to system/kiln.config.json, in its category. That is a deliberate one-line
// decision at the point where the sidebar layout is decided, rather than a string an agent invents
// while writing a story header. tooling/story-title-check.mjs fails the build when a title and this
// file disagree, in either direction: a title outside the mapping, and a component in the mapping
// with no story of its own.
//
// Key order is the sidebar order. Foundations first (it documents the tokens, not a component), then
// the component waves in build order, which is also roughly simple-to-complex for someone reading
// the sidebar top to bottom.

// The mapping itself is system data, so it lives in system/kiln.config.json (`storyCategories`),
// not here — this file only loads it and keeps the one-category-per-component invariant.
import { loadSystemConfig } from './system-config.mjs';

export const STORY_CATEGORY_MAP = loadSystemConfig().storyCategories ?? {};

export const STORY_CATEGORIES = Object.keys(STORY_CATEGORY_MAP);

// storySort wants the categories followed by a catch-all, so anything not yet categorised sorts to
// the bottom instead of silently landing in the middle of the list.
export const STORY_SORT_ORDER = [...STORY_CATEGORIES, '*'];

// name -> category, for the check to answer "which category does this component belong to" in one
// lookup. Built here rather than in the check so a name listed under two categories is a startup
// error in one place instead of a subtle first-match-wins.
export const CATEGORY_OF = (() => {
  const map = new Map();
  for (const [category, names] of Object.entries(STORY_CATEGORY_MAP)) {
    for (const name of names) {
      if (map.has(name)) {
        throw new Error(
          `story-categories.mjs lists "${name}" under both '${map.get(name)}' and '${category}' — a component belongs to exactly one sidebar group`,
        );
      }
      map.set(name, category);
    }
  }
  return map;
})();
