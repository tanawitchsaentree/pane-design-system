// @example Enter sends, Shift+Enter starts a new line
import { useState } from 'react';
import { Card, ChatComposer, Text } from 'pane-react';

export default function ComposerBasic() {
  const [last, setLast] = useState('');
  return <Card as="div" className="demo-card demo-wide demo-stack"><ChatComposer placeholder="Ask about your results" onSend={setLast} /><Text as="p" size="label" tone="secondary" aria-live="polite">{last ? `Sent: ${last}` : 'Nothing sent yet'}</Text></Card>;
}
