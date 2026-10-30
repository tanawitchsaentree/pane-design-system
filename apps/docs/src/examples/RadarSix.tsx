// @example Six axes and five rings
import { Card, RadarChart } from 'pane-react';

export default function RadarSix() {
  return <Card as="div" className="demo-card demo-wide"><RadarChart label="Print scores" rings={5} max={10} axes={['Colour', 'Detail', 'Paper', 'Frame', 'Size', 'Price']} series={[{ name: 'Lofoten, March', values: [9, 8, 7, 6, 8, 5] }]} /></Card>;
}
