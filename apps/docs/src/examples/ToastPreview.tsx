// @example A toast drawn in place
import { Toast } from 'pane-react';

export default function ToastPreview() {
  return <Toast preview open onOpenChange={() => {}} tone="positive" title="Print ordered" description="It ships within a week." />;
}
