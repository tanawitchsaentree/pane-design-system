// @example A quoted post as an inset card
import { Avatar, Card } from 'pane-react';

export default function CardInset() {
  return (
    <Card aria-label="Repost by Max Fmz" className="demo-card">
      <p className="flush">Worth reading before the launch.</p>
      <Card variant="inset" as="div">
        <div className="post-head"><Avatar name="Visual Flow" size="sm" decorative /><b>Visual Flow</b><span className="muted">· 9h</span></div>
        <p className="flush muted">Asset 05 is live. Designed for modern visual projects.</p>
      </Card>
    </Card>
  );
}
