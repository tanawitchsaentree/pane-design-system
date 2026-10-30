// @example Wrong, with the reason in words
import { Card, Combobox, FormField } from 'pane-react';

export default function ComboboxInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Destination" error="Choose a destination from the list"><Combobox label="Destination" options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }]} /></FormField></Card>;
}
