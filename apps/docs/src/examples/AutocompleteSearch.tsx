// @example A search with recent terms
import { Autocomplete, Card } from 'pane-react';

export default function AutocompleteSearch() {
  return <Card as="div" className="demo-card"><Autocomplete label="Search photos" suggestions={['northern lights', 'fjords at dawn', 'harbour at night']} /></Card>;
}
