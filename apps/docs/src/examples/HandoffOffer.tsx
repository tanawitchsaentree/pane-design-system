// @example The assistant offers a person, and says why
import { Card, HumanHandoff } from 'pane-react';

export default function HandoffOffer() {
  return <Card as="div" className="demo-card demo-wide"><HumanHandoff state="offer" who="a nurse" reason="This needs a clinician to look at." onAccept={() => {}} onDecline={() => {}} /></Card>;
}
