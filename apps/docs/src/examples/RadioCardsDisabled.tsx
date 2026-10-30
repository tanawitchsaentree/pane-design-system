// @example An option that cannot be chosen
import { Card, RadioCards } from 'pane-react';

export default function RadioCardsDisabled() {
  return <Card as="div" className="demo-card"><RadioCards label="Size" defaultValue="a3" options={[{ value: 'a4', title: 'A4' }, { value: 'a3', title: 'A3' }, { value: 'a2', title: 'A2', description: 'Sold out', disabled: true }]} /></Card>;
}
