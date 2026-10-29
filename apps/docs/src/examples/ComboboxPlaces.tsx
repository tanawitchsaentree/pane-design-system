// @example Choose a place from a long list
import { Card, Combobox } from 'pane-react';

export default function ComboboxPlaces() {
  return <Card as="div" className="demo-card"><Combobox label="Destination" placeholder="Type a place" options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }, { value: 'hofn', label: 'Höfn' }, { value: 'skye', label: 'Isle of Skye' }, { value: 'faroe', label: 'Faroe Islands' }]} /></Card>;
}
