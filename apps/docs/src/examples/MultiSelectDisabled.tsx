// @example Off while the album syncs
import { Card, MultiSelect } from 'pane-react';

export default function MultiSelectDisabled() {
  return <Card as="div" className="demo-card"><MultiSelect label="Places" disabled defaultValue={['lofoten']} options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }]} /></Card>;
}
