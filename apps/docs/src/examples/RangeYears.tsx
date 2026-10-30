// @example Years taken
import { Card, RangeSlider } from 'pane-react';

export default function RangeYears() {
  return <Card as="div" className="demo-card"><RangeSlider label="Year taken" min={2010} max={2026} defaultValue={[2018, 2024]} /></Card>;
}
