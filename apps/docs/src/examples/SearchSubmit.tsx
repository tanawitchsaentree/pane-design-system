// @example Searching on Enter
import { useState } from 'react';
import { Card, Flex, SearchInput, Text } from 'pane-react';

export default function SearchSubmit() {
  const [q, setQ] = useState('');
  return (
    <Card as="div" className="demo-card">
      <Flex direction="column" gap="sm">
        <SearchInput aria-label="Search orders" placeholder="Order number or name" onSearch={setQ} />
        <Text size="label" tone="secondary">{q ? `Showing orders that match ${q}` : 'Press Enter to search'}</Text>
      </Flex>
    </Card>
  );
}
