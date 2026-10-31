// @example A person has taken over
import { Avatar, Card, HumanHandoff } from 'pane-react';

export default function HandoffConnected() {
  return <Card as="div" className="demo-card demo-wide"><HumanHandoff state="connected" who="Nurse Ida Holm" avatar={<Avatar name="Ida Holm" size="sm" decorative />} /></Card>;
}
