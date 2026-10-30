// @example A number the order cannot take
import { Card, FormField, NumberInput } from 'pane-react';

export default function NumError() {
  return <Card as="div" className="demo-card"><FormField label="Edition size" error="An edition holds between 5 and 50 prints."><NumberInput label="Edition size" defaultValue={60} min={5} max={50} /></FormField></Card>;
}
