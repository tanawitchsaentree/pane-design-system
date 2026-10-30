// @example While the main action runs, the menu stays usable
import { SplitButton } from 'pane-react';

export default function SplitButtonBusy() {
  return <SplitButton loading onClick={() => {}} menuLabel="More ways to publish" items={[{ label: 'Schedule…', onSelect: () => {} }]}>Publish</SplitButton>;
}
