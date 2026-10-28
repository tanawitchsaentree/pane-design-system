// @example A slider in steps
import { useState } from 'react';
import { Card, Slider } from 'pane-react';

export default function SliderSteps() {
  const [blur, setBlur] = useState(40);
  return (
    <Card as="section" aria-label="Photo" className="demo-card">
      <Slider label="Background blur" min={0} max={100} step={10} value={blur} onValueChange={setBlur} format={(v) => `${v}%`} />
    </Card>
  );
}
