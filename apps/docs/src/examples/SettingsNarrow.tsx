// @example Rows that stack when narrow
import { Card, Select, SettingsGroup, SettingsLayout, SettingsRow } from 'pane-react';

export default function SettingsNarrow() {
  return <div className="demo-narrow"><Card as="div" className="demo-card"><SettingsLayout title="Shipping"><SettingsGroup title="Defaults"><SettingsRow label="Default paper" description="Used when an order does not say." control={<Select label="Default paper" hideLabel defaultValue="rag" options={[{ value: 'rag', label: 'Photo Rag' }, { value: 'baryta', label: 'Baryta' }]} />} /></SettingsGroup></SettingsLayout></Card></div>;
}
