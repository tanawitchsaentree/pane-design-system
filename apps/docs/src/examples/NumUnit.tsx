// @example A weight in half steps
import { Card, FormField, NumberInput } from 'pane-react';

export default function NumUnit() {
  return <Card as="div" className="demo-card"><FormField label="Parcel weight" help="Round up to the next half kilogram."><NumberInput label="Parcel weight" defaultValue={2.5} min={0.5} max={30} step={0.5} unit="kg" /></FormField></Card>;
}
