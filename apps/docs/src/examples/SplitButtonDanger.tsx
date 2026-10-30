// @example Danger, for a destructive action with options
import { SplitButton } from 'pane-react';

export default function SplitButtonDanger() {
  return <SplitButton variant="danger" onClick={() => {}} menuLabel="Other ways to delete" items={[{ label: 'Delete and keep a copy', onSelect: () => {} }, { label: 'Delete every version', onSelect: () => {}, tone: 'critical' }]}>Delete</SplitButton>;
}
