// @example Controlled tabs that report the current view
import { useState } from 'react';
import { Card, Tabs } from 'pane-react';

export default function TabsControlled() {
  const [view, setView] = useState('week');
  return (
    <Card as="div" className="demo-card">
      <Tabs.Root value={view} onValueChange={setView}>
        <Tabs.List aria-label="Range">
          <Tabs.Trigger value="day">Day</Tabs.Trigger>
          <Tabs.Trigger value="week">Week</Tabs.Trigger>
          <Tabs.Trigger value="month">Month</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value={view}><p className="flush muted tab-empty">Showing the {view}.</p></Tabs.Content>
      </Tabs.Root>
    </Card>
  );
}
