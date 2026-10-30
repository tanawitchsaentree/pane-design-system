// @example Options with a second line
import { Card, Listbox } from 'pane-react';

export default function ListboxDescriptions() {
  return <Card as="div" className="demo-card"><Listbox label="Paper" defaultValue="matte" options={[{ value: 'matte', label: 'Matte', description: 'No glare, deep blacks' }, { value: 'gloss', label: 'Gloss', description: 'Vivid colour, some glare' }]} /></Card>;
}
