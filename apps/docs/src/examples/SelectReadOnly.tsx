// @example Read-only, settled but readable
import { Card, Select } from 'pane-react';

export default function SelectReadOnly() {
  return <Card as="div" className="demo-card"><Select label="Shipping country" readOnly defaultValue="senja" options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }]} /></Card>;
}
