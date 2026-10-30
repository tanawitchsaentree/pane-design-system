// @example Moving through the steps
import { useState } from 'react';
import { Button, Card, Flex, Stepper } from 'pane-react';

export default function StepperMoving() {
  const [step, setStep] = useState(0);
  return <Card as="div" className="demo-card"><Flex direction="column" gap="lg"><Stepper label="Checkout" current={step} steps={[{ label: 'Cart' }, { label: 'Delivery' }, { label: 'Payment' }, { label: 'Review' }]} /><Flex gap="sm"><Button variant="glass" size="sm" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button><Button variant="light" size="sm" disabled={step === 3} onClick={() => setStep(step + 1)}>Continue</Button></Flex></Flex></Card>;
}
