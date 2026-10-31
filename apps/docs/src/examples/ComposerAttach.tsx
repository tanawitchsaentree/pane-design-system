// @example With an attach button before the field
import { Card, ChatComposer, IconButton } from 'pane-react';

export default function ComposerAttach() {
  return <Card as="div" className="demo-card demo-wide"><ChatComposer placeholder="Write a message" onSend={() => {}} start={<IconButton variant="ghost" aria-label="Attach a file"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9.7 17a1.7 1.7 0 0 1-2.4-2.4L15 7" /></svg></IconButton>} /></Card>;
}
