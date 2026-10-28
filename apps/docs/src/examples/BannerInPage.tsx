// @example A message written as the first line of the pane it is about
import { Banner, Button, Card, Stack } from 'pane-react';

export default function BannerInPage() {
  return (
    <Card as="section" aria-labelledby="bip-h" className="demo-card wide-card">
      <Banner tone="warning" title="Card expires next month" action={<Button size="sm" variant="glass">Update</Button>}>Update it to avoid a pause in your subscription.</Banner>
      <Stack gap="sm">
        <h3 id="bip-h" className="flush">Billing</h3>
        <p className="flush muted">Plan: Pro · renews 1 Dec</p>
      </Stack>
    </Card>
  );
}
