// Barrel manifest — the ONLY file that decides what's in src/index.ts and in what order
// (see tooling/generate-barrel.mjs). Derived from anchor A (D-008/D-009).
export const BARREL_MANIFEST = [
  {
    header: `Anchor A — the parts of the profile card: Environment, Card, Avatar, Button, IconButton, Tabs, Tag.`,
    components: ['Environment', 'Card', 'Avatar', 'Button', 'IconButton', 'Tabs', 'Tag'],
  },
];
