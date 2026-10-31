// @example The four presets
import { Card, Mesh, Stack } from 'pane-react';

export default function MeshPresets() {
  return (
    <Card as="section" aria-label="Mesh presets" className="demo-card">
    <p className="flush">Four presets ship. Each is a small accent, about a tenth of the space it sits in.</p>
    <Stack direction="row" gap="md" className="mesh-demo-row">
      {(['aurora', 'ember', 'tide', 'dusk'] as const).map((p) => (
        <figure key={p} className="mesh-demo-swatch"><Mesh preset={p} className="mesh-demo-tile" /><figcaption>{p}</figcaption></figure>
      ))}
    </Stack>
    </Card>
  );
}
