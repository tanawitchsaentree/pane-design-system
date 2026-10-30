// @example A price from and to
import { Card, RangeSlider } from 'pane-react';

export default function RangePrice() {
  return <Card as="div" className="demo-card"><RangeSlider label="Price" min={0} max={400} step={10} defaultValue={[80, 240]} format={(v) => `€${v}`} /></Card>;
}
