// @example A small h2 at the top of a card
import { Card, Heading, Text } from 'pane-react';

export default function HeadingCard() {
  return (
    <Card as="section" aria-labelledby="hc-h" className="demo-card">
      <Heading id="hc-h" level={2} size="title">Shipping</Heading>
      <Text tone="secondary">Prints ship within a week.</Text>
    </Card>
  );
}
