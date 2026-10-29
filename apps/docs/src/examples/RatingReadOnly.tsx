// @example A score shown in a review
import { Card, Flex, Rating, Text } from 'pane-react';

export default function RatingReadOnly() {
  return <Card as="div" className="demo-card"><Flex gap="sm"><Rating label="Average rating" value={4} readOnly /><Text size="label" tone="secondary">4.2 from 38 reviews</Text></Flex></Card>;
}
