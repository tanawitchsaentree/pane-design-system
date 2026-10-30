// @example Actions for one photo
import { ActionSheet, Button } from 'pane-react';

export default function ActionSheetShare() {
  return (
    <ActionSheet trigger={<Button variant="glass">Photo options</Button>} title="Morning fog, Vestland"
      actions={[{ label: 'Share', onSelect: () => {} }, { label: 'Save to Files', onSelect: () => {} }, { label: 'Delete photo', tone: 'critical', onSelect: () => {} }]} />
  );
}
