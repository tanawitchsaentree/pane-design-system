// @example A query already typed
import { Card, SearchInput } from 'pane-react';

export default function SearchFilled() {
  return <Card as="div" className="demo-card"><SearchInput aria-label="Search prints" defaultValue="Lofoten" /></Card>;
}
