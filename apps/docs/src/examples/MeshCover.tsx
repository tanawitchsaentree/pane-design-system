// @example A mesh as album art beside the title
import { Card, Mesh } from 'pane-react';

export default function MeshCover() {
  return (
    <Card as="article" aria-labelledby="mc-h" className="demo-card">
      <div className="mesh-demo-accent">
        <Mesh className="mesh-demo-cover" label="Album art in peach, coral and violet" />
        <div>
          <h3 id="mc-h" className="flush">Morning set</h3>
          <p className="flush">Twelve tracks · 48 min</p>
        </div>
      </div>
      <p className="flush">Recorded live at the harbour, one take per song, with the windows open.</p>
    </Card>
  );
}
