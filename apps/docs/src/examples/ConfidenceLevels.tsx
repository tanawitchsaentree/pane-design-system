// @example Every level from Very low to Very high
import { ConfidenceChip } from 'pane-react';

export default function ConfidenceLevels() {
  return <div className="demo-row">{[1, 2, 3, 4, 5].map((n) => <ConfidenceChip key={n} level={n} />)}</div>;
}
