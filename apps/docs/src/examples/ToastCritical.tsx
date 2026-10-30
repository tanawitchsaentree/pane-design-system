// @example A failure
import { Toast } from 'pane-react';

export default function ToastCritical() {
  return <Toast preview open onOpenChange={() => {}} tone="critical" title="Upload failed" description="Check your connection and try again." />;
}
