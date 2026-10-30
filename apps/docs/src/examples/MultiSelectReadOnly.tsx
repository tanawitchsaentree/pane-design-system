// @example Read-only, chips without remove
import { Card, MultiSelect } from 'pane-react';

export default function MultiSelectReadOnly() {
  return <Card as="div" className="demo-card"><MultiSelect label="Places" readOnly defaultValue={['lofoten', 'senja']} options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }]} /></Card>;
}
