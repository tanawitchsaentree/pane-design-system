// @example Tabs switching three views
import { Card, Tabs } from 'pane-react';

export default function TabsBasic() {
  return (
    <Card as="div" className="demo-card">
      <Tabs.Root defaultValue="tweets">
        <Tabs.List aria-label="Profile sections">
          <Tabs.Trigger value="tweets">Tweets</Tabs.Trigger>
          <Tabs.Trigger value="replies">Replies</Tabs.Trigger>
          <Tabs.Trigger value="media">Media</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tweets"><p className="flush muted tab-empty">128 tweets this month.</p></Tabs.Content>
        <Tabs.Content value="replies"><p className="flush muted tab-empty">No replies yet.</p></Tabs.Content>
        <Tabs.Content value="media"><p className="flush muted tab-empty">12 photos, 2 videos.</p></Tabs.Content>
      </Tabs.Root>
    </Card>
  );
}
