// @example Wrong, with the reason in words
import { Card, FormField, MultiSelect } from 'pane-react';

export default function MultiSelectInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Places" error="Choose at least one place"><MultiSelect label="Places" options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }]} /></FormField></Card>;
}
