// @example Starting empty
import { Card, MultiSelect } from 'pane-react';

export default function MultiSelectEmpty() {
  return <Card as="div" className="demo-card"><MultiSelect label="Places" placeholder="Add places" options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }, { value: 'hofn', label: 'Höfn' }, { value: 'skye', label: 'Isle of Skye' }, { value: 'faroe', label: 'Faroe Islands' }]} /></Card>;
}
