// @example Small, in a toolbar
import { SplitButton } from 'pane-react';

export default function SplitButtonSmall() {
  return <SplitButton size="sm" variant="glass" onClick={() => {}} menuLabel="More export formats" items={[{ label: 'CSV', onSelect: () => {} }, { label: 'PDF', onSelect: () => {} }]}>Export</SplitButton>;
}
