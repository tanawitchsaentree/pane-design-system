// @example A search field with a clear button
import { useState } from 'react';
import { Card, FormField, IconButton, Input, InputGroup } from 'pane-react';

const Search = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></svg>;
const Clear = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>;

export default function InputGroupSearch() {
  const [q, setQ] = useState('fjord');
  return (
    <Card as="section" role="search" aria-label="Albums" className="demo-card">
      <FormField label="Search albums">
        <InputGroup start={<Search />} end={q ? <IconButton aria-label="Clear search" variant="ghost" size="sm" onClick={() => setQ('')}><Clear /></IconButton> : null}>
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} />
        </InputGroup>
      </FormField>
    </Card>
  );
}
