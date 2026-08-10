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
// Adding a component means adding its name here, in its category. That is a deliberate one-line
// decision at the point where the sidebar layout is decided, rather than a string an agent invents
// while writing a story header. tooling/story-title-check.mjs fails the build when a title and this
// file disagree, in either direction: a title outside the mapping, and a component in the mapping
// with no story of its own.
//
// Key order is the sidebar order. Foundations first (it documents the tokens, not a component), then
// the component waves in build order, which is also roughly simple-to-complex for someone reading
// the sidebar top to bottom.

export const STORY_CATEGORY_MAP = {
  // Not dial-react components — token documentation pages under apps/storybook/src/foundations.
  Foundations: ['Colors', 'Typography', 'Spacing', 'Motion'],

  // Wave 1 (W1 Layout+Primitives, D-012)
  Layout: [
    'Box',
    'Flex',
    'Stack',
    'Grid',
    'Container',
    'Center',
    'Spacer',
    'Divider',
    'AspectRatio',
    'VisuallyHidden',
  ],

  // Wave 2 (W2 Atoms-Core, D-013)
  Atoms: [
    'Text',
    'Heading',
    'Icon',
    'Kbd',
    'Badge',
    'Spinner',
    'Button',
    'IconButton',
    'Link',
    'Avatar',
    'Skeleton',
    'Image',
  ],

  // Wave 3 (W3 Forms-Core, D-015)
  Forms: [
    'Label',
    'HelperText',
    'Input',
    'Textarea',
    'Checkbox',
    'Radio',
    'Switch',
    'Fieldset',
    'InputGroup',
    'FormField',
    'PinInput',
  ],

  // Wave 4 (W4 Web Overlays, D-018/D-017)
  Overlays: ['Popover', 'Tooltip', 'Dialog', 'Drawer', 'Toast', 'Snackbar'],

  // Wave 5 (W5 Selection, D-022/D-023)
  Selection: ['Listbox', 'RadioCards', 'Rating'],

  // Wave 7 (W7 Data Display). Card was pulled ahead of its catalog wave for demo-app GAP #1 and
  // belongs here, not in Layout — the mistake this file exists to make undecidable-by-typo.
  'Data Display': ['Card', 'Alert', 'Table', 'Stat'],
};

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
