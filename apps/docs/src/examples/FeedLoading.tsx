// @example Loading more
import { Card, Feed, Text } from 'pane-react';

export default function FeedLoading() {
  return <Feed label="Latest" loading items={[{ id: 1, t: 'Mara posted Lofoten, March' }]} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={(x) => <Card as="div" className="demo-card"><Text>{x.t}</Text></Card>} />;
}
