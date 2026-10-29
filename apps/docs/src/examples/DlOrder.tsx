// @example An order summary with dividers
import { Card, DescriptionList } from 'pane-react';

export default function DlOrder() {
  return <Card as="div" className="demo-card"><DescriptionList layout="inline" dividers items={[{ term: 'Prints', detail: '€ 240' }, { term: 'Frames', detail: '€ 90' }, { term: 'Delivery', detail: '€ 12' }, { term: 'Total', detail: '€ 342' }]} /></Card>;
}
