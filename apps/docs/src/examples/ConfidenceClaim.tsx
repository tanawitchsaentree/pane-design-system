// @example Beside the claim it qualifies
import { Card, ConfidenceChip, Text } from 'pane-react';

export default function ConfidenceClaim() {
  return (
    <Card as="div" className="demo-card">
      <Text as="p">The transfer on 12 March went to the same account as the refund.</Text>
      <ConfidenceChip level={4} label="Confidence" />
    </Card>
  );
}
