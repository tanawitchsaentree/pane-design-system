// @example A deck's profile, four axes with their words
import { Card, Flex, Scale } from 'pane-react';

const LEVEL = ['Very low', 'Low', 'Medium', 'High', 'Very high'];
export default function ScaleProfile() {
  return (
    <Card as="div" className="demo-card demo-wide">
      <Flex direction="column" gap="sm">
        <Scale label="Speed" value={4.2} words={['Slow', 'Steady', 'Medium', 'Fast', 'Very fast']} />
        <Scale label="Interaction" value={3} words={LEVEL} />
        <Scale label="Late game" value={2.4} words={LEVEL} />
        <Scale label="Consistency" value={1.6} words={LEVEL} />
      </Flex>
    </Card>
  );
}
