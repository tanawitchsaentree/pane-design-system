// @example A settings group with rows in a column and each label beside its value
import { Badge, Card, Stack } from 'pane-react';

export default function StackForm() {
  return (
    <Card as="section" aria-labelledby="sf-h" className="demo-card">
      <Stack gap="md">
        <h3 id="sf-h" className="flush">Notifications</h3>
        {[['Mentions', 'On'], ['New followers', 'Off']].map(([k, v]) => (
          <Stack key={k} direction="row" gap="md" align="center" className="split-row"><span>{k}</span><Badge tone={v === 'On' ? 'positive' : 'neutral'}>{v}</Badge></Stack>
        ))}
      </Stack>
    </Card>
  );
}
