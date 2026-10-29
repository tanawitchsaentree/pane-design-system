// @example Delivery speed
import { Card, RadioCards } from 'pane-react';

export default function RadioCardsShipping() {
  return <Card as="div" className="demo-card"><RadioCards label="Delivery" defaultValue="standard" options={[{ value: 'standard', title: 'Standard', description: '3 to 5 days · free' }, { value: 'express', title: 'Express', description: 'Tomorrow · 90 NOK' }]} /></Card>;
}
