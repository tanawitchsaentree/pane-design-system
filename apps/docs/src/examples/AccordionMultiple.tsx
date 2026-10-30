// @example Several open at once
import { Accordion, Card, Text } from 'pane-react';

export default function AccordionMultiple() {
  return <Card as="div" className="demo-card"><Accordion type="multiple" defaultValue={['ship', 'paper']} items={[{ value: 'ship', title: 'How long does delivery take?', content: <Text tone="secondary">Prints leave the studio in three working days and arrive in two to five more.</Text> }, { value: 'paper', title: 'Which paper do you print on?', content: <Text tone="secondary">A 310 gsm cotton rag with a matte finish.</Text> }, { value: 'return', title: 'Can I return a print?', content: <Text tone="secondary">Yes, within 30 days, in its tube.</Text> }]} /></Card>;
}
