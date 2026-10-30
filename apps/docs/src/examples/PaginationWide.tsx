// @example More pages around the current one
import { useState } from 'react';
import { Card, Flex, Pagination, Text } from 'pane-react';

export default function PaginationWide() {
  const [page, setPage] = useState(10);
  return <Card as="div" className="demo-card"><Flex direction="column" gap="sm"><Text size="label" tone="secondary">{`Showing ${(page - 1) * 20 + 1} to ${page * 20} of 400 prints`}</Text><Pagination page={page} total={20} siblings={2} onPageChange={setPage} /></Flex></Card>;
}
