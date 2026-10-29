// @example Filter groups in a side panel
import { Accordion, Card, Checkbox, Flex } from 'pane-react';

export default function AccordionFilters() {
  return <Card as="div" className="demo-card"><Accordion type="multiple" defaultValue={['size']} items={[{ value: 'size', title: 'Size', content: <Flex direction="column" gap="sm"><Checkbox label="A4" /><Checkbox label="A3" /></Flex> }, { value: 'paper', title: 'Paper', content: <Flex direction="column" gap="sm"><Checkbox label="Matte" /><Checkbox label="Gloss" /></Flex> }]} /></Card>;
}
