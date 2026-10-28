// @example Disabled, with the reason beside it
import { Card, Slider } from 'pane-react';

export default function SliderDisabled() {
  return (
    <Card as="div" className="demo-card">
      <Slider label="Volume" disabled defaultValue={40} format={(v) => `${v}%`} />
      <p className="flush muted small">Volume follows the speaker while it is connected.</p>
    </Card>
  );
}
