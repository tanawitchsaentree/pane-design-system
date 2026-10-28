// @example Four tones, four glyph shapes
import { Banner, Card } from 'pane-react';

export default function BannerTones() {
  return (
    <Card as="div" className="demo-card wide-card">
      <Banner tone="info" title="Encrypted messages are rolling out">Verified accounts get it first.</Banner>
      <Banner tone="positive" title="Post published">It’s live on your profile.</Banner>
      <Banner tone="warning" title="Your session expires in 5 minutes">Save your draft to keep it.</Banner>
      <Banner tone="critical" title="Upload failed">The file is larger than 25 MB.</Banner>
    </Card>
  );
}
