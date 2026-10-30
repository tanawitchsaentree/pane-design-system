// @example What was dropped, listed under it
import { useState } from 'react';
import { Card, Dropzone, Flex, Text } from 'pane-react';

export default function DropList() {
  const [names, setNames] = useState<string[]>([]);
  const [refused, setRefused] = useState<string[]>([]);
  return (
    <Card as="div" className="demo-card">
      <Flex direction="column" gap="md">
        <Dropzone label="Drop prints to price" hint="JPG up to 20 MB" accept="image/jpeg" multiple onFiles={(f, r) => { setNames(f.map((x) => x.name)); setRefused(r); }} />
        <Text size="label" tone="secondary">{names.length ? `Ready to price ${names.join(', ')}` : 'Nothing chosen yet'}</Text>
        {refused.map((r) => <Text key={r} size="label">{r}</Text>)}
      </Flex>
    </Card>
  );
}
