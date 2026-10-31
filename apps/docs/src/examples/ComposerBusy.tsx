// @example While an answer arrives, the button stops it
import { Card, ChatComposer } from 'pane-react';

export default function ComposerBusy() {
  return <Card as="div" className="demo-card demo-wide"><ChatComposer placeholder="Ask a follow-up" busy onSend={() => {}} onStop={() => {}} /></Card>;
}
