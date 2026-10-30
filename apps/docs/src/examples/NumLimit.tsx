// @example At the top of its range
import { Card, FormField, NumberInput } from 'pane-react';

export default function NumLimit() {
  return <Card as="div" className="demo-card"><FormField label="Copies" help="Ten is the most one order can hold."><NumberInput label="Copies" defaultValue={10} min={1} max={10} /></FormField></Card>;
}
