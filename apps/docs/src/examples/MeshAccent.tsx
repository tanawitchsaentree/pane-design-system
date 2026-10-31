// @example A mesh as a small accent in a list row
import { Card, Mesh } from 'pane-react';

export default function MeshAccent() {
  return (
    <Card as="section" aria-labelledby="ma-h" className="demo-card">
      <h3 id="ma-h" className="flush">Playlists</h3>
      {([['dusk', 'Night drive', '18 tracks'], ['tide', 'Morning swim', '12 tracks']] as const).map(([p, t, d]) => (
        <div key={p} className="mesh-demo-accent">
          <Mesh preset={p} className="mesh-demo-tile" />
          <div><p className="flush">{t}</p><p className="flush">{d}</p></div>
        </div>
      ))}
    </Card>
  );
}
