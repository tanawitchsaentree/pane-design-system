// Barrel manifest — the ONLY file that decides what's in src/index.ts and in what order
// (see tooling/generate-barrel.mjs). Pilot scope per D-006.
export const BARREL_MANIFEST = [
  {
    header: `Pilot (D-006): Button, Badge, Panel, TextField, Switch.`,
    components: ['Button', 'Badge', 'Panel', 'TextField', 'Switch'],
  },
];
