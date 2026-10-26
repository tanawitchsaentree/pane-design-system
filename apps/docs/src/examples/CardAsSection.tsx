// @example as="section" — a titled region, labelled by its heading
import { Card } from 'pane-react';

export default function CardAsSection() {
  return (
    <Card as="section" aria-labelledby="usage-h" className="demo-card">
      <h3 id="usage-h" className="flush">Storage</h3>
      <p className="flush muted">41.2 GB of 64 GB used. Photos take the most space.</p>
    </Card>
  );
}
