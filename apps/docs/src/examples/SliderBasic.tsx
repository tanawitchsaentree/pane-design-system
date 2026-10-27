// @example A slider on a player
import { useState } from 'react';
import { Card, Slider } from 'pane-react';

export default function SliderBasic() {
  const [vol, setVol] = useState(60);
  return (
    <Card as="section" aria-labelledby="sl-h" className="demo-card">
      <h3 id="sl-h" className="flush">Northern Lights</h3>
      <Slider label="Volume" value={vol} onValueChange={setVol} format={(v) => `${v}%`} />
    </Card>
  );
}
