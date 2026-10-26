import type { EnvironmentBrightness } from 'pane-react';

// Each scene declares the brightness of its brightest spot (D-009), which picks the glass tint.
export const SCENES: Array<{ id: string; label: string; brightness: EnvironmentBrightness }> = [
  { id: 'room', label: 'Room', brightness: 'mid' },
  { id: 'blobs', label: 'Soft blobs', brightness: 'bright' },
  { id: 'night', label: 'Night', brightness: 'dim' },
  { id: 'daylight', label: 'Daylight', brightness: 'bright' },
];
export const sceneById = (id: string) => SCENES.find((s) => s.id === id) ?? SCENES[0];
