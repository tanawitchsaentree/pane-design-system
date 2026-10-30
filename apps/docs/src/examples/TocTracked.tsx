// @example Follows the reader as they scroll
import { Card, Flex, Heading, TableOfContents, Text } from 'pane-react';

const SECTIONS = [{ id: 'tt-arrive', label: 'Arriving' }, { id: 'tt-stay', label: 'Where to stay' }, { id: 'tt-shoot', label: 'Where to shoot' }];

export default function TocTracked() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="xl" align="start">
        <TableOfContents items={SECTIONS} />
        <div>{SECTIONS.map((s) => <section key={s.id}><Heading level={3} id={s.id}>{s.label}</Heading><Text tone="secondary">The ferry from Bodø takes three hours and runs twice a day in winter, so plan the first night near the harbour.</Text></section>)}</div>
      </Flex>
    </Card>
  );
}
