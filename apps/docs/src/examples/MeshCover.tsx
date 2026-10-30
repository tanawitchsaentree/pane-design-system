// @example A mesh as a cover, with glass over it
import { Card, Mesh } from 'pane-react';

export default function MeshCover() {
  return (
    <Card as="article" aria-labelledby="mc-h" className="demo-card">
      <Mesh className="mesh-demo-cover" label="Abstract cover in peach, coral and violet" />
      <h3 id="mc-h" className="flush">Morning set</h3>
      <p className="flush">Twelve tracks · 48 min</p>
    </Card>
  );
}
