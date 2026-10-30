// @example Wrong, with the reason in words
import { Card, FormField, Select } from 'pane-react';

export default function SelectInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Pick-up point" error="Choose where to collect the print"><Select label="Pick-up point" hideLabel placeholder="Choose a place" options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }]} /></FormField></Card>;
}
