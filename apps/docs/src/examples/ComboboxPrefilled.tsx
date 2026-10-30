// @example With a value already chosen
import { Card, Combobox } from 'pane-react';

export default function ComboboxPrefilled() {
  return <Card as="div" className="demo-card"><Combobox label="Destination" defaultValue="senja" options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }, { value: 'hofn', label: 'Höfn' }, { value: 'skye', label: 'Isle of Skye' }, { value: 'faroe', label: 'Faroe Islands' }]} /></Card>;
}
