// @example A list that refreshes when pulled
import { Card, PullToRefresh, Stack, Text } from 'pane-react';

export default function PTRInbox() {
  return (
    <Card as="div" className="demo-card">
      <PullToRefresh className="demo-ptr" label="Refresh messages" onRefresh={() => new Promise((r) => setTimeout(r, 900))}>
        <Stack gap="sm">{['Mara: the prints arrived', 'Jonas: ferry at 15:00', 'Ola: photos uploaded'].map((m) => <Text key={m}>{m}</Text>)}</Stack>
      </PullToRefresh>
    </Card>
  );
}
