// @example Vertical, with a line under each step
import { Card, Stepper } from 'pane-react';

export default function StepperVertical() {
  return <Card as="div" className="demo-card"><Stepper label="Set up your shop" orientation="vertical" current={2} steps={[{ label: 'Create an account', description: 'Done on 12 March' }, { label: 'Add your first print', description: 'One photo and a price' }, { label: 'Choose a payout', description: 'A bank account or a card' }, { label: 'Open the shop' }]} /></Card>;
}
