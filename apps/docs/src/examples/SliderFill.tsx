// @example Fill sliders in a quick-settings pane
import { useState } from 'react';
import { Card, Slider, Stack } from 'pane-react';

export default function SliderFill() {
  const [brightness, setBrightness] = useState(50);
  const [timer, setTimer] = useState(8);
  return (
    <Card as="section" aria-labelledby="slf-h" className="demo-card">
      <h3 id="slf-h" className="flush">Reading lamp</h3>
      <Stack gap="sm">
        <Slider variant="fill" label="Brightness" value={brightness} onValueChange={setBrightness} format={(v) => `${v}%`} />
        <Slider variant="fill" label="Timer" min={0} max={12} value={timer} onValueChange={setTimer} format={(v) => (v === 0 ? 'Off' : `${v}h`)} />
      </Stack>
    </Card>
  );
}
