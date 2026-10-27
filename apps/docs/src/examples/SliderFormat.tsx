// @example Range, step and a formatted value
import { Card, Slider } from 'pane-react';

export default function SliderFormat() {
  return (
    <Card as="div" className="demo-card">
      <Slider label="Corner radius" min={0} max={40} step={2} defaultValue={18} format={(v) => `${v}px`} />
      <Slider label="Sleep timer" min={5} max={60} step={5} defaultValue={30} format={(v) => `${v} min`} />
    </Card>
  );
}
