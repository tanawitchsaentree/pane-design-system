// @example One deck's shape
import { Card, RadarChart } from 'pane-react';

export default function RadarDeck() {
  return <Card as="div" className="demo-card demo-wide"><RadarChart label="Deck profile" description="Each axis from 1 to 5" max={5} axes={['Speed', 'Interaction', 'Late game', 'Consistency', 'Removal']} series={[{ name: 'Mono white tokens', values: [4.6, 2.2, 2.8, 3.9, 2.4] }]} /></Card>;
}
