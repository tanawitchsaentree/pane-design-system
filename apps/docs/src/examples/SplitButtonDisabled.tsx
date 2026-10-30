// @example Off, both halves together
import { SplitButton } from 'pane-react';

export default function SplitButtonDisabled() {
  return <SplitButton disabled onClick={() => {}} menuLabel="More ways to send" items={[{ label: 'Schedule…', onSelect: () => {} }]}>Send</SplitButton>;
}
