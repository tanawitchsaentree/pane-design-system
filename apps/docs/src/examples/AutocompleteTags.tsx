// @example Suggestions with free text
import { Autocomplete, Card } from 'pane-react';

export default function AutocompleteTags() {
  return <Card as="div" className="demo-card"><Autocomplete label="Camera" placeholder="Any camera" suggestions={['Fujifilm X100V', 'Leica Q2', 'Ricoh GR III', 'Sony A7 IV']} /></Card>;
}
