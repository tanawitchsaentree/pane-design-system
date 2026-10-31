// @example The person hands the chat back
import { Card, HumanHandoff } from 'pane-react';

export default function HandoffReturned() {
  return <Card as="div" className="demo-card demo-wide"><HumanHandoff state="returned" who="Nurse Ida Holm" /></Card>;
}
