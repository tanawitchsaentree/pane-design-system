// @example An action sheet drawn in place
import { ActionSheet } from 'pane-react';

export default function ActionSheetPreview() {
  return <ActionSheet preview title="Morning fog, Vestland" description="Deleting removes it from every album." actions={[{ label: 'Share', onSelect: () => {} }, { label: 'Delete photo', tone: 'critical', onSelect: () => {} }]} />;
}
