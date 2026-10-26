// @example Removable input chips
import { useState } from 'react';
import { Card, Chip, Stack } from 'pane-react';

export default function ChipInput() {
  const [people, setPeople] = useState(['Ada Lovelace', 'Grace Hopper', 'Alan Kay']);
  return (
    <Card as="div" className="demo-card">
      <p className="flush muted">To:</p>
      <Stack direction="row" gap="sm">
        {people.map((p) => <Chip key={p} onRemove={() => setPeople(people.filter((x) => x !== p))}>{p}</Chip>)}
      </Stack>
      {people.length === 0 && <p className="flush muted">No recipients.</p>}
    </Card>
  );
}
