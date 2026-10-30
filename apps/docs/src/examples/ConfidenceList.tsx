// @example A list of findings, each with its confidence
import { ConfidenceChip, List, ListItem } from 'pane-react';

const FINDINGS: [string, number][] = [['Same device on both accounts', 5], ['Shared billing address', 3], ['Similar name', 1]];

export default function ConfidenceList() {
  return (
    <List className="demo-card">
      {FINDINGS.map(([text, level]) => <ListItem key={text} title={text} trailing={<ConfidenceChip level={level} />} />)}
    </List>
  );
}
