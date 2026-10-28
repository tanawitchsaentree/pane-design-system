// @example Tabs in a card header, content below
import { Card, Tabs, Tag } from 'pane-react';

export default function TabsInHeader() {
  return (
    <Card as="section" aria-labelledby="trend-h" className="demo-card">
      <Tabs.Root defaultValue="foryou">
        <div className="component-head">
          <h3 id="trend-h" className="flush">Home</h3>
          <Tabs.List aria-label="Feed">
            <Tabs.Trigger value="foryou">For you</Tabs.Trigger>
            <Tabs.Trigger value="following">Following</Tabs.Trigger>
          </Tabs.List>
        </div>
        <Tabs.Content value="foryou"><div className="demo-row tab-empty"><Tag>Tech · Trending</Tag><span>#VisionPro</span></div></Tabs.Content>
        <Tabs.Content value="following"><p className="flush muted tab-empty">3 new posts from people you follow.</p></Tabs.Content>
      </Tabs.Root>
    </Card>
  );
}
