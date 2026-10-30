// @example Three steps with your own words
import { ConfidenceChip } from 'pane-react';

export default function ConfidenceThree() {
  const words = ['Guess', 'Likely', 'Confirmed'];
  return <div className="demo-row">{[1, 2, 3].map((n) => <ConfidenceChip key={n} level={n} steps={3} words={words} />)}</div>;
}
