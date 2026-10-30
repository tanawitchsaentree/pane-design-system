// @example Wrong, with the reason in words
import { Card, FormField, RadioCards } from 'pane-react';

export default function RadioCardsInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Size" error="Choose a size for the print"><RadioCards label="Size" options={[{ value: 's', title: 'Small', description: '20 × 25 cm' }, { value: 'm', title: 'Medium', description: '30 × 40 cm' }]} /></FormField></Card>;
}
