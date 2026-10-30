// @example A mesh as the scene behind glass
import { Card, Environment, Mesh } from 'pane-react';

export default function MeshScene() {
  return (
    <Mesh preset="dusk" className="mesh-demo-scene">
      <Environment brightness="bright">
        <Card as="section" aria-labelledby="ms-h" className="demo-card">
          <h3 id="ms-h" className="flush">Tonight</h3>
          <p className="flush">Clear skies after nine. Low of 4°.</p>
        </Card>
      </Environment>
    </Mesh>
  );
}
