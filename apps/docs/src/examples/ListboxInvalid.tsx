// @example Wrong, with the reason in words
import { Card, FormField, Listbox } from 'pane-react';

export default function ListboxInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Frame" error="Choose a frame to continue"><Listbox label="Frame" options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }]} /></FormField></Card>;
}
