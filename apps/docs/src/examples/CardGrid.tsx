// @example A grid of panes
import { Card } from 'pane-react';

const STATS = [['Followers', '1.6M'], ['Posts', '1,284'], ['Saved', '96']] as const;

export default function CardGrid() {
  return (
    <div className="card-grid">
      {STATS.map(([k, v]) => (
        <Card key={k} as="div">
          <p className="flush muted">{k}</p>
          <p className="flush stat-num">{v}</p>
        </Card>
      ))}
    </div>
  );
}
