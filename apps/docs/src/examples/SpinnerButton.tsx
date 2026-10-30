// @example Inside a button while it saves
import { Button, Card, Flex, Spinner } from 'pane-react';

export default function SpinnerButton() {
  return (
    <Card as="div" className="demo-card">
      <Button variant="glass" aria-busy="true"><Flex gap="sm"><Spinner size="sm" label="Saving" />Saving</Flex></Button>
    </Card>
  );
}
