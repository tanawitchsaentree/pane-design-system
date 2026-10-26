// @example Status at the end of each row
import { Badge, Card, Stack } from 'pane-react';

const BUILDS = [['main · 2b9ea2a', 'positive', 'Passed'], ['docs · 5b6b069', 'warning', 'Slow'], ['tokens · c48589d', 'critical', 'Failed']] as const;

export default function BadgeInList() {
  return (
    <Card as="section" aria-labelledby="bl-h" className="demo-card">
      <h3 id="bl-h" className="flush">Builds</h3>
      {BUILDS.map(([b, t, s]) => (
        <Stack key={b} direction="row" gap="md" align="center" className="split-row"><code>{b}</code><Badge tone={t}>{s}</Badge></Stack>
      ))}
    </Card>
  );
}
