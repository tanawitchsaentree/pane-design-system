// @example With a starting value
import { Autocomplete, Card } from 'pane-react';

export default function AutocompleteValue() {
  return <Card as="div" className="demo-card"><Autocomplete label="Lens" defaultValue="35mm" suggestions={['23mm', '35mm', '50mm', '85mm']} /></Card>;
}
