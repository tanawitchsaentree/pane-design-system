// @example A custom cancel label
import { ActionSheet } from 'pane-react';

export default function ActionSheetCancel() {
  return <ActionSheet preview title="Leave the group?" cancelLabel="Stay" actions={[{ label: 'Leave group', tone: 'critical', onSelect: () => {} }]} />;
}
