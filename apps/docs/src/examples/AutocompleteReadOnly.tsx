// @example Read-only on a saved print
import { Autocomplete, Card } from 'pane-react';

export default function AutocompleteReadOnly() {
  return <Card as="div" className="demo-card"><Autocomplete label="Camera" readOnly defaultValue="Leica Q2" suggestions={['Leica Q2', 'Ricoh GR III']} /></Card>;
}
