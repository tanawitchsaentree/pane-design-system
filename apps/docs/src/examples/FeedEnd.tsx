// @example The end of a feed
import { Card, Feed, Text } from 'pane-react';

export default function FeedEnd() {
  return <Feed label="Your activity" hasMore={false} items={[{ id: 1, t: 'You sold Lofoten, March' }, { id: 2, t: 'You added Reine bridge' }]} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={(x) => <Card as="div" className="demo-card"><Text>{x.t}</Text></Card>} />;
}
