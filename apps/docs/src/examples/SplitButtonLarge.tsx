// @example Large, the one action of a screen
import { SplitButton } from 'pane-react';

export default function SplitButtonLarge() {
  return <SplitButton size="lg" onClick={() => {}} menuLabel="More ways to check out" items={[{ label: 'Pay later', onSelect: () => {} }, { label: 'Pay with a gift card', onSelect: () => {} }]}>Check out</SplitButton>;
}
