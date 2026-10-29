// @example Items that wrap when the row is full
import { Card, Chip, Flex } from 'pane-react';

export default function FlexWrap() {
  return (
    <Card as="div" className="demo-card">
      <Flex wrap gap="sm" role="group" aria-label="Topics">
        {['Fjords', 'Coast', 'Cities', 'Night', 'Forest', 'Snow'].map((t, i) => <Chip key={t} defaultSelected={i === 0}>{t}</Chip>)}
      </Flex>
    </Card>
  );
}
