// @example Hover, press and a view change
import { useState } from 'react';
import { Button, Card, Tabs } from 'pane-react';

export default function MotionDemo() {
  const [n, setN] = useState(0);
  return (
    <Card as="div" className="demo-card">
      <p className="flush">Hover the buttons, press one, then switch tabs. Every move settles over 420–640ms.</p>
      <div className="demo-row">
        <Button onClick={() => setN(n + 1)}>Pressed {n}×</Button>
        <Button variant="glass">Hover me</Button>
      </div>
      <Tabs.Root defaultValue="a">
        <Tabs.List aria-label="Motion demo">
          <Tabs.Trigger value="a">First</Tabs.Trigger>
          <Tabs.Trigger value="b">Second</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a"><p className="flush tab-empty">The panel rises 8px and fades in.</p></Tabs.Content>
        <Tabs.Content value="b"><p className="flush tab-empty">Same entrance every time, because every duration comes from a token.</p></Tabs.Content>
      </Tabs.Root>
    </Card>
  );
}
