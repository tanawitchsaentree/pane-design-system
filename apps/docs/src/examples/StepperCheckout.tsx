// @example Checkout in four steps
import { Card, Stepper } from 'pane-react';

export default function StepperCheckout() {
  return <Card as="div" className="demo-card"><Stepper label="Checkout" current={1} steps={[{ label: 'Cart' }, { label: 'Delivery' }, { label: 'Payment' }, { label: 'Review' }]} /></Card>;
}
