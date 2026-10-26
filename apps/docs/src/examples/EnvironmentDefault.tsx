// @example No declaration — glass falls back to the bright level
import { Card } from 'pane-react';

export default function EnvironmentDefault() {
  return (
    // Outside any <Environment>, --ds-glass-brightness resolves to the bright value: the safe end.
    <Card as="div" className="demo-card">
      <p className="flush">No Environment around me.</p>
      <p className="flush muted">I dim my backdrop as if it were bright.</p>
    </Card>
  );
}
