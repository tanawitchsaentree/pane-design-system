// @example Account rows with buttons
import { Button, Card, SettingsGroup, SettingsLayout, SettingsRow } from 'pane-react';

export default function SettingsAccount() {
  return <Card as="div" className="demo-card"><SettingsLayout title="Account"><SettingsGroup title="Sign-in" description="How you get into the shop."><SettingsRow label="Email" description="mara@lind.no" control={<Button variant="glass" size="sm">Change</Button>} /><SettingsRow label="Password" description="Changed 3 months ago" control={<Button variant="glass" size="sm">Change</Button>} /></SettingsGroup></SettingsLayout></Card>;
}
