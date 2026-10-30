// @example Off for a scanned film print
import { Autocomplete, Card } from 'pane-react';

export default function AutocompleteDisabled() {
  return <Card as="div" className="demo-card"><Autocomplete label="Camera" disabled suggestions={['Leica Q2', 'Ricoh GR III']} /></Card>;
}
