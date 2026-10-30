// @example Off until a size is chosen
import { Card, RangeSlider } from 'pane-react';

export default function RangeDisabled() {
  return <Card as="div" className="demo-card"><RangeSlider label="Frame depth" min={1} max={6} defaultValue={[2, 4]} disabled format={(v) => `${v} cm`} /></Card>;
}
