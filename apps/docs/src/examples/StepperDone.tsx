// @example Every step done
import { Card, Stepper } from 'pane-react';

export default function StepperDone() {
  return <Card as="div" className="demo-card"><Stepper label="Checkout" current={4} steps={[{ label: 'Cart' }, { label: 'Delivery' }, { label: 'Payment' }, { label: 'Review' }]} /></Card>;
}
