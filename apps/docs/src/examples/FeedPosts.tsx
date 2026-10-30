// @example Posts from people you follow
import { useState } from 'react';
import { Card, Feed, Text } from 'pane-react';

export default function FeedPosts() {
  const [items, setItems] = useState(Array.from({ length: 3 }, (_, i) => ({ id: i, who: ['Mara Lind', 'Jon Berg', 'Ida Holm'][i % 3], what: ['posted Lofoten, March', 'saved Senja at night', 'shared Höfn harbour'][i % 3] })));
  const more = () => setItems((xs) => [...xs, ...Array.from({ length: 3 }, (_, i) => ({ id: xs.length + i, who: ['Mara Lind', 'Jon Berg', 'Ida Holm'][i % 3], what: 'posted a new print' }))]);
  return <Feed label="Latest from people you follow" items={items} getKey={(x) => x.id} getLabel={(x) => `${x.who} ${x.what}`} hasMore={items.length < 9} onLoadMore={more} renderItem={(x) => <Card as="div" className="demo-card"><Text weight="semibold">{x.who}</Text><Text size="label" tone="secondary">{x.what}</Text></Card>} />;
}
