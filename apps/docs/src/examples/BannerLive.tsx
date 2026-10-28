// @example Banners announced as they appear
import { useState } from 'react';
import { Banner, Button, Card, Stack } from 'pane-react';

export default function BannerLive() {
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <Card as="div" className="demo-card wide-card">
      <Stack direction="row" gap="sm"><Button size="sm" onClick={() => setSaved(true)}>Save</Button><Button size="sm" variant="glass" onClick={() => setFailed(true)}>Simulate error</Button></Stack>
      {saved && <Banner tone="positive" live="polite" title="Saved" onDismiss={() => setSaved(false)} />}
      {failed && <Banner tone="critical" live="assertive" title="Couldn’t save. You’re offline" onDismiss={() => setFailed(false)} />}
    </Card>
  );
}
