// @example A query that cannot be searched
import { Card, FormField, SearchInput } from 'pane-react';

export default function SearchInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Order number" error="Order numbers are 6 digits, such as 104 233."><SearchInput defaultValue="10A" invalid /></FormField></Card>;
}
