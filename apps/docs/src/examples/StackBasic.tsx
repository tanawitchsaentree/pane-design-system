// @example A vertical stack, with the spacing set on the stack itself
import { Button, Card, Stack } from 'pane-react';

export default function StackBasic() {
  return (
    <Card as="div" className="demo-card">
      <Stack gap="md">
        <h3 className="flush">Invite people</h3>
        <p className="flush muted">They’ll get a link that works for 7 days.</p>
        <Stack direction="row" gap="sm"><Button>Copy link</Button><Button variant="glass">Email</Button></Stack>
      </Stack>
    </Card>
  );
}
