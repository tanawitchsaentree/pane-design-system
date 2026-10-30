// @example Your own colours, turned, with an ambient glow
import { Card, Mesh } from 'pane-react';

export default function MeshBrand() {
  return (
    <Card as="article" aria-labelledby="mb-h" className="demo-card">
      <Mesh colors={['#7FE0D1', '#F5B04C', '#2B3A9E', '#F09AB3']} rotate={40} glow className="mesh-demo-icon" label="Happy Files folder art" />
      <h3 id="mb-h" className="flush">Happy Files</h3>
      <p className="flush">88 photos · 24 videos · 9 documents</p>
    </Card>
  );
}
