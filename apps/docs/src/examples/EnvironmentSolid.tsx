// @example Solid material over a live backdrop
import { Card, Environment } from 'pane-react';

export default function EnvironmentSolid() {
  return (
    // material="solid": panes inside use the opaque surface and no backdrop filter (D-021)
    <Environment material="solid">
      <Card as="div" className="demo-card">
        <p className="flush">Opaque over a live scene.</p>
        <p className="flush muted">Nothing behind me is re-blurred each frame.</p>
      </Card>
    </Environment>
  );
}
