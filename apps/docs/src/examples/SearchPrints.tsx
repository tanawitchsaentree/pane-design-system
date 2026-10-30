// @example Searching the shop
import { Card, SearchInput } from 'pane-react';

export default function SearchPrints() {
  return <Card as="div" className="demo-card"><SearchInput aria-label="Search prints" placeholder="Search prints" /></Card>;
}
