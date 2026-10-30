// @example A range that never closes
import { Card, RangeSlider } from 'pane-react';

export default function RangeGap() {
  return <Card as="div" className="demo-card"><RangeSlider label="Print width" min={20} max={120} step={5} minGap={4} defaultValue={[40, 60]} format={(v) => `${v} cm`} /></Card>;
}
