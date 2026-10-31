import type { EnvironmentBrightness } from 'pane-react';

// Each scene declares the brightness of its brightest spot (D-009/D-010), which picks how much the
// glass dims what is behind it. Measured by tooling/glass-sweep.mjs, not eyeballed: all four photos
// have a bright spot somewhere in frame, so all four need the bright setting.
export const SCENES: Array<{ id: string; label: string; brightness: EnvironmentBrightness }> = [
  // no photo: a dark studio sweep with one soft light from the top left, the default for showing components
  { id: 'studio', label: 'Studio (no photo)', brightness: 'bright' },
  { id: 'room', label: 'Room', brightness: 'bright' },
  { id: 'forest', label: 'Forest', brightness: 'bright' },
  { id: 'night', label: 'Night café', brightness: 'bright' },
  { id: 'city', label: 'City', brightness: 'bright' },
  // no photo: a plain field for diagrams and layout demos, where structure is the subject
  { id: 'field', label: 'Field (no photo)', brightness: 'bright' },
];
export const sceneById = (id: string) => SCENES.find((s) => s.id === id) ?? SCENES[0];
