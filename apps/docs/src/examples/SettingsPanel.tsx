// @example A settings panel
import { Button, Card, Tabs, Tag } from 'pane-react';

const ROWS = [
  ['Encrypted messages', 'On for verified contacts'],
  ['Who can reply', 'People you follow'],
  ['Data sharing', 'Off'],
] as const;

export default function SettingsPanel() {
  return (
    <Card as="section" aria-labelledby="settings-h" className="demo-card wide-card">
      <div className="component-head">
        <h3 id="settings-h" className="flush">Privacy</h3>
        <Tag>Beta</Tag>
      </div>
      <Tabs.Root defaultValue="privacy">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Trigger value="privacy">Privacy</Tabs.Trigger>
          <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
          <Tabs.Trigger value="display">Display</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="privacy">
          <dl className="settings-list">
            {ROWS.map(([k, v]) => (
              <div key={k} className="settings-row"><dt>{k}</dt><dd className="muted">{v}</dd></div>
            ))}
          </dl>
        </Tabs.Content>
        <Tabs.Content value="notifications"><p className="flush muted tab-empty">Push, email and in-app. Set per channel.</p></Tabs.Content>
        <Tabs.Content value="display"><p className="flush muted tab-empty">Text size follows your system setting.</p></Tabs.Content>
      </Tabs.Root>
      <div className="demo-row">
        <Button>Save changes</Button>
        <Button variant="glass">Cancel</Button>
      </div>
    </Card>
  );
}
