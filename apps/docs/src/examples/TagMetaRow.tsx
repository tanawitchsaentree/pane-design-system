// @example Tags in a trends list
import { Card, Tag } from 'pane-react';

const TRENDS = [['Tech · Trending', '#VisionPro', '1.97M posts'], ['Design · Trending', '#UXUI', '412K posts']] as const;

export default function TagMetaRow() {
  return (
    <Card as="section" aria-labelledby="trends-h" className="demo-card">
      <h3 id="trends-h" className="flush">Trends for you</h3>
      <ul className="trend-list">
        {TRENDS.map(([cat, tag, n]) => (
          <li key={tag}><Tag>{cat}</Tag><b>{tag}</b><span className="muted">{n}</span></li>
        ))}
      </ul>
    </Card>
  );
}
