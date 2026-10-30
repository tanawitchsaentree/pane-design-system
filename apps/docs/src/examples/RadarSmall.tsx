// @example Small, on a card
import { Card, RadarChart } from 'pane-react';

export default function RadarSmall() {
  return <Card as="div" className="demo-card"><RadarChart label="Shape" blockSize={180} max={5} axes={['Speed', 'Interaction', 'Late game']} series={[{ name: 'Deck', values: [4, 2, 3] }]} /></Card>;
}
