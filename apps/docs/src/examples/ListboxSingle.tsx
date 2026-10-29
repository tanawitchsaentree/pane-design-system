// @example One choice from a short list
import { Card, Listbox } from 'pane-react';

export default function ListboxSingle() {
  return <Card as="div" className="demo-card"><Listbox label="Home airport" defaultValue="osl" options={[{ value: 'osl', label: 'Oslo', description: 'OSL · Gardermoen' }, { value: 'bgo', label: 'Bergen', description: 'BGO · Flesland' }, { value: 'trd', label: 'Trondheim', description: 'TRD · Værnes' }]} /></Card>;
}
