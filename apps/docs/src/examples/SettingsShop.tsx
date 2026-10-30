// @example Shop settings
import { Card, SegmentedControl, SettingsGroup, SettingsLayout, SettingsRow, Switch, VisuallyHidden } from 'pane-react';

export default function SettingsShop() {
  return <Card as="div" className="demo-card"><SettingsLayout title="Settings"><SettingsGroup title="Notifications"><SettingsRow label="Order emails" description="An email for every new order." control={<Switch label={<VisuallyHidden>Order emails</VisuallyHidden>} defaultChecked />} /><SettingsRow label="Comments" control={<Switch label={<VisuallyHidden>Comments</VisuallyHidden>} />} /></SettingsGroup><SettingsGroup title="Appearance"><SettingsRow label="Theme" control={<SegmentedControl label="Theme" defaultValue="auto" options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'auto', label: 'Auto' }]} />} /></SettingsGroup></SettingsLayout></Card>;
}
