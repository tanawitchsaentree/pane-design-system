// @example Controlled chips with a live count
import { useState } from 'react';
import { Card, Chip, Stack } from 'pane-react';

const TOPICS = ['Design', 'Spatial', 'Motion', 'Tokens'];

export default function ChipControlled() {
  const [on, setOn] = useState<string[]>(['Spatial']);
  return (
    <Card as="div" className="demo-card">
      <Stack direction="row" gap="sm" role="group" aria-label="Topics">
        {TOPICS.map((t) => (
          <Chip key={t} selected={on.includes(t)} onSelectedChange={(s) => setOn(s ? [...on, t] : on.filter((x) => x !== t))}>{t}</Chip>
        ))}
      </Stack>
      <p className="flush muted" aria-live="polite">{on.length} of {TOPICS.length} topics selected</p>
    </Card>
  );
}
