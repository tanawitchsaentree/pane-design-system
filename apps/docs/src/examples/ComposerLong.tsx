// @example Grows with a long message, then scrolls
import { Card, ChatComposer } from 'pane-react';

export default function ComposerLong() {
  return <Card as="div" className="demo-card demo-wide"><ChatComposer placeholder="Describe your symptoms" maxRows={4} onSend={() => {}} /></Card>;
}
