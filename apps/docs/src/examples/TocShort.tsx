// @example Two levels
import { Card, TableOfContents } from 'pane-react';

export default function TocShort() {
  return <Card as="div" className="demo-card"><TableOfContents label="In this guide" track={false} items={[{ id: 'ts-a', label: 'Before you go' }, { id: 'ts-b', label: 'Visas', level: 3 }, { id: 'ts-c', label: 'On the road' }]} /></Card>;
}
