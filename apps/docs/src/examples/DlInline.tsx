// @example Terms beside their details
import { Card, DescriptionList } from 'pane-react';

export default function DlInline() {
  return <Card as="div" className="demo-card"><DescriptionList layout="inline" items={[{ term: 'Paper', detail: 'Hahnemühle Photo Rag, 308 g' }, { term: 'Size', detail: '40 × 50 cm' }, { term: 'Edition', detail: '12 of 25' }, { term: 'Shipped from', detail: 'Tromsø, Norway' }]} /></Card>;
}
