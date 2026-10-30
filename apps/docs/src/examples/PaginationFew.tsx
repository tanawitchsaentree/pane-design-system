// @example A few pages
import { useState } from 'react';
import { Card, Pagination } from 'pane-react';

export default function PaginationFew() {
  const [page, setPage] = useState(1);
  return <Card as="div" className="demo-card"><Pagination page={page} total={3} onPageChange={setPage} /></Card>;
}
