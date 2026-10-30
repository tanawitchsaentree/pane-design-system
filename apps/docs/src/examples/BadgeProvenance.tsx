// @example Where the data came from, on a chart or a table
import { Badge, Card, Stack } from 'pane-react';

// Live data is good news, so it takes the check. Sample and synthetic data are facts about the source
// with no good or bad in them, so they stay neutral with a dot. Stale data asks the reader to be careful.
const SOURCES = [['Prices', 'positive', 'Live'], ['Win rates', 'neutral', 'Sample data'], ['Matchups', 'neutral', 'Synthetic'], ['Card pool', 'warning', 'Stale, 3 days old']] as const;

export default function BadgeProvenance() {
  return (
    <Card as="section" aria-labelledby="bp-h" className="demo-card">
      <h3 id="bp-h" className="flush">Data sources</h3>
      {SOURCES.map(([what, tone, said]) => (
        <Stack key={what} direction="row" gap="md" align="center" className="split-row"><span>{what}</span><Badge tone={tone} dot={tone === 'neutral'}>{said}</Badge></Stack>
      ))}
    </Card>
  );
}
