// @example On an ordinary reading surface
import { Banner } from 'pane-react';

export default function BannerPage() {
  return (
    <div className="solid-surface">
      <Banner tone="info" title="This page describes version 0.2">Version 0.1 notes are in the change history.</Banner>
      <h3 className="flush">Settings</h3>
      <p className="flush muted">The same line works on an opaque page, where there is no glass at all (P7).</p>
    </div>
  );
}
