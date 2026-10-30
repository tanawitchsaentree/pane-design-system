// @example Off until a country is chosen
import { Card, Combobox } from 'pane-react';

export default function ComboboxDisabled() {
  return <Card as="div" className="demo-card"><Combobox label="Destination" disabled options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }]} /></Card>;
}
