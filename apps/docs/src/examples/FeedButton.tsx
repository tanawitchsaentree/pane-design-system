// @example Load more by button
import { Card, Feed, Text } from 'pane-react';

export default function FeedButton() {
  return <Feed label="Comments" onLoadMore={() => {}} items={[{ id: 1, t: 'Mara: the blue is perfect' }, { id: 2, t: 'Jon: is there a larger size?' }]} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={(x) => <Card as="div" className="demo-card"><Text>{x.t}</Text></Card>} />;
}
