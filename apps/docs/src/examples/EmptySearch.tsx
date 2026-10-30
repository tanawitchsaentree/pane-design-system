// @example A search with no results
import { Button, Card, EmptyState } from 'pane-react';
import { IconSearch } from '../icons';
export default function EmptySearch() {
  return <Card as="div" className="demo-card"><EmptyState title="No prints match “fjord sunset”" description="Check the spelling or try a shorter search, such as fjord." icon={<IconSearch />} actions={<Button variant="glass">Clear the search</Button>} /></Card>;
}
