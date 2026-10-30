// @example Off while stock is checked
import { Card, Listbox } from 'pane-react';

export default function ListboxDisabled() {
  return <Card as="div" className="demo-card"><Listbox label="Frame" disabled defaultValue="senja" options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }]} /></Card>;
}
