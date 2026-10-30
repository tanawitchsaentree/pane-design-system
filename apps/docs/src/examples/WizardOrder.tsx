// @example Ordering a print in three steps
import { Card, FormField, Input, RadioCards, Text, Wizard } from 'pane-react';

export default function WizardOrder() {
  return <Card as="div" className="demo-card demo-wide"><Wizard label="Order a print" onFinish={() => {}} onCancel={() => {}} steps={[{ label: 'Size', content: <RadioCards label="Size" defaultValue="m" options={[{ value: 's', title: '30 × 40 cm', description: '€95' }, { value: 'm', title: '40 × 50 cm', description: '€120' }]} /> }, { label: 'Address', content: <FormField label="Street address"><Input autoComplete="street-address" /></FormField> }, { label: 'Pay', content: <Text>You will pay on the next screen.</Text> }]} /></Card>;
}
