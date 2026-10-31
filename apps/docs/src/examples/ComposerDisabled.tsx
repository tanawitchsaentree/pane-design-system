// @example Off while a person has taken over
import { Card, ChatComposer } from 'pane-react';

export default function ComposerDisabled() {
  return <Card as="div" className="demo-card demo-wide"><ChatComposer placeholder="A nurse is writing" disabled onSend={() => {}} /></Card>;
}
