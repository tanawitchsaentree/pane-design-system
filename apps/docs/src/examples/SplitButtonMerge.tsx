// @example Glass, for a second action beside the main one
import { SplitButton } from 'pane-react';

export default function SplitButtonMerge() {
  return <SplitButton variant="glass" onClick={() => {}} menuLabel="Other ways to merge" items={[{ label: 'Squash and merge', onSelect: () => {} }, { label: 'Rebase and merge', onSelect: () => {} }]}>Merge</SplitButton>;
}
