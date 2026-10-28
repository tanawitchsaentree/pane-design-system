// @example Long text and right-to-left
import { Banner, Button, Card } from 'pane-react';

export default function BannerLong() {
  return (
    <Card as="div" className="demo-card wide-card">
      <Banner tone="warning" title="Your shared album “Summer in Lauterbrunnen, Grindelwald and the Jungfrau region” will stop syncing" action={<Button size="sm" variant="glass">Keep syncing</Button>}>
        Albums with more than 5,000 photos pause after 30 days without a visit. Open it once to keep it in sync on every device.
      </Banner>
      <div dir="rtl" lang="ar">
        <Banner tone="positive" title="تم نشر المنشور" action={<Button size="sm" variant="glass">عرض</Button>}>أصبح متاحًا الآن في ملفك الشخصي.</Banner>
      </div>
    </Card>
  );
}
