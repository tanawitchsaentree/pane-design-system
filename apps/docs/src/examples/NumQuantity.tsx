// @example How many prints
import { Card, FormField, NumberInput } from 'pane-react';

export default function NumQuantity() {
  return <Card as="div" className="demo-card"><FormField label="Quantity"><NumberInput label="Quantity" defaultValue={1} min={1} max={10} /></FormField></Card>;
}
