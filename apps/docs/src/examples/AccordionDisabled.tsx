// @example A section that is not ready
import { Accordion, Card, Text } from 'pane-react';

export default function AccordionDisabled() {
  return <Card as="div" className="demo-card"><Accordion items={[{ value: 'order', title: 'Your order', content: <Text tone="secondary">Two prints, A3, matte.</Text> }, { value: 'track', title: 'Tracking, available once shipped', content: <Text tone="secondary">No tracking yet.</Text>, disabled: true }]} /></Card>;
}
