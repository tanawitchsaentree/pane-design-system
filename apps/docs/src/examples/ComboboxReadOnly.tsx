// @example Read-only after the order is placed
import { Card, Combobox } from 'pane-react';

export default function ComboboxReadOnly() {
  return <Card as="div" className="demo-card"><Combobox label="Destination" readOnly defaultValue="senja" options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }]} /></Card>;
}
