// @example Waiting in line, with a way out
import { Card, HumanHandoff } from 'pane-react';

export default function HandoffConnecting() {
  return <Card as="div" className="demo-card demo-wide"><HumanHandoff state="connecting" who="a nurse" wait="2nd in line, about 3 min" onDecline={() => {}} /></Card>;
}
