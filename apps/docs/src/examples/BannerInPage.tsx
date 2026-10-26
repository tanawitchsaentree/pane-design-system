// @example A banner at the top of a section
import { Banner, Card, Stack } from 'pane-react';

export default function BannerInPage() {
  return (
    <Card as="section" aria-labelledby="bip-h" className="demo-card wide-card">
      <Stack gap="md">
        <h3 id="bip-h" className="flush">Billing</h3>
        <Banner tone="warning" title="Card expires next month">Update it to avoid a pause in your subscription.</Banner>
        <p className="flush muted">Plan: Pro · renews 1 Dec</p>
      </Stack>
    </Card>
  );
}
