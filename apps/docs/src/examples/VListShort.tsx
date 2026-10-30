// @example A short list still scrolls the same
import { Card, VirtualList } from 'pane-react';

export default function VListShort() {
  return <Card as="div" className="demo-card demo-wide"><VirtualList label="Paper stock" blockSize="12rem" items={['Photo Rag 308', 'Baryta 315', 'Matt 230', 'Pearl 285', 'Bamboo 290', 'Cotton 300']} renderItem={(p) => <span>{p}</span>} /></Card>;
}
