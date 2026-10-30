// @example Two decks over the same axes
import { Card, RadarChart } from 'pane-react';

export default function RadarTwo() {
  return <Card as="div" className="demo-card demo-wide"><RadarChart label="Two decks compared" max={5} axes={['Speed', 'Interaction', 'Late game', 'Consistency']} series={[{ name: 'Mono white tokens', values: [4.6, 2.2, 2.8, 3.9] }, { name: 'Blue control', values: [1.8, 4.7, 4.4, 3.1] }]} /></Card>;
}
