// @example Saves the score it is given
import { useState } from 'react';
import { Card, Flex, Rating, Text } from 'pane-react';

export default function RatingSaved() {
  const [score, setScore] = useState(0);
  return (
    <Card as="div" className="demo-card">
      <Flex direction="column" gap="sm">
        <Rating label="Rate your stay" value={score} onValueChange={setScore} />
        <Text size="label" tone="secondary">{score ? `${score} out of 5, saved` : 'Not rated yet'}</Text>
      </Flex>
    </Card>
  );
}
