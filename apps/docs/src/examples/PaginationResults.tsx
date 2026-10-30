// @example Pages of search results
import { useState } from 'react';
import { Card, Pagination } from 'pane-react';

export default function PaginationResults() {
  const [page, setPage] = useState(4);
  return <Card as="div" className="demo-card"><Pagination page={page} total={12} onPageChange={setPage} /></Card>;
}
