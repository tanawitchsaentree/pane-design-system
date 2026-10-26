/**
 * Sidebar nav data. Component list and category grouping are read from
 * packages/react/src/barrel.manifest.mjs (the same file that generates the package's own public
 * barrel — the authoritative list of what's shipped) and cross-checked against each component's
 * own Storybook story `title` category. Never hand-typed as a separate, driftable list.
 */
export interface NavComponent {
  name: string;
  slug: string;
}

export interface NavCategory {
  title: string;
  components: NavComponent[];
}

// Mirrors apps/storybook/.storybook/preview.ts's storySort order exactly (Foundations excluded
// here since it's a separate top-level nav section, not a component category).
export const COMPONENT_CATEGORIES: NavCategory[] = [
  {
    title: 'Layout',
    components: [
      'Box', 'Flex', 'Stack', 'Center', 'Grid', 'Container', 'Spacer', 'Divider', 'AspectRatio', 'VisuallyHidden',
    ].map(toNavComponent),
  },
  {
    title: 'Atoms',
    components: [
      'Text', 'Heading', 'Icon', 'Kbd', 'Badge', 'Spinner', 'Button', 'IconButton', 'Link', 'Avatar', 'Skeleton', 'Image',
    ].map(toNavComponent),
  },
  {
    title: 'Forms',
    components: [
      'Label', 'HelperText', 'Input', 'Textarea', 'Checkbox', 'Radio', 'Switch', 'Fieldset', 'InputGroup', 'FormField', 'PinInput',
    ].map(toNavComponent),
  },
  {
    title: 'Overlays',
    components: ['Popover', 'Tooltip', 'Dialog', 'Drawer', 'Toast', 'Snackbar'].map(toNavComponent),
  },
  {
    title: 'Selection',
    components: ['Listbox', 'RadioCards', 'Rating'].map(toNavComponent),
  },
  {
    title: 'Data Display',
    components: ['Table', 'Stat', 'Alert', 'Card'].map(toNavComponent),
  },
];

export const FOUNDATIONS_PAGES = ['Colors', 'Typography', 'Spacing', 'Motion', 'Icons'];

export const OVERVIEW_PAGES = [
  'Introduction',
  'Installation',
  'Theming',
  'Dark mode',
  'Compared to alternatives',
];

function toNavComponent(name: string): NavComponent {
  return { name, slug: kebab(name) };
}

function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Kebab-casing convention shared with src/lib/pageTree.ts (Overview/Foundations page URLs). */
export function kebabCase(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-');
}
