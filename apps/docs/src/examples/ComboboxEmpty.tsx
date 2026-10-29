// @example A custom empty message
import { Card, Combobox } from 'pane-react';

export default function ComboboxEmpty() {
  return <Card as="div" className="demo-card"><Combobox label="Destination" emptyText="No trips go there yet" options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }, { value: 'hofn', label: 'Höfn' }, { value: 'skye', label: 'Isle of Skye' }, { value: 'faroe', label: 'Faroe Islands' }]} /></Card>;
}
