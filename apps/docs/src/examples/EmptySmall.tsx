// @example Small, inside a card
import { Card, EmptyState, Heading } from 'pane-react';
import { IconInbox } from '../icons';
export default function EmptySmall() {
  return <Card as="div" className="demo-card"><Heading level={3} size="title">Messages</Heading><EmptyState size="sm" level={4} title="No messages" description="Buyers who write to you appear here." icon={<IconInbox />} /></Card>;
}
