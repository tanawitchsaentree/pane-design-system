// Barrel manifest — the ONLY file that decides what's in src/index.ts and in what order
// (see tooling/generate-barrel.mjs).
export const BARREL_MANIFEST = [
  {
    header: `Layout (D-014): Container, Grid/GridItem, Stack — columns, gutters, margins and breakpoints from tokens.`,
    components: ['Container', 'Grid', 'Stack'],
  },
  {
    header: `Anchor A — the parts of the profile card: Environment, Card, Avatar, Button, IconButton, Tabs, Tag.`,
    components: ['Environment', 'Card', 'Avatar', 'Button', 'IconButton', 'Tabs', 'Tag'],
  },
  {
    header: `Status (D-014): Badge, Chip, Banner.`,
    components: ['Badge', 'Chip', 'Banner'],
  },
  {
    header: `Form controls (D-017): Select, Slider — Radix behaviour, Pane look, never the OS menu.`,
    components: ['Select', 'Slider'],
  },
];
