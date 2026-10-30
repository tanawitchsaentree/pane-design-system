// @example Several choices
import { Card, Listbox } from 'pane-react';

export default function ListboxMultiple() {
  return <Card as="div" className="demo-card"><Listbox label="Show in feed" multiple defaultValue={['photos', 'prints']} options={[{ value: 'photos', label: 'Photos' }, { value: 'prints', label: 'Prints' }, { value: 'notes', label: 'Field notes' }, { value: 'audio', label: 'Recordings', disabled: true }]} /></Card>;
}
