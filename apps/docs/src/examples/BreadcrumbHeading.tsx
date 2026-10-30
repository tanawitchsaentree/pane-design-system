// @example Above the page heading
import { Breadcrumb, Card, Flex, Heading } from 'pane-react';

export default function BreadcrumbHeading() {
  return <Card as="div" className="demo-card"><Flex direction="column" gap="sm"><Breadcrumb items={[{ href: '#albums', label: 'Albums' }, { href: '#senja', label: 'Senja' }]} /><Heading level={2}>Senja</Heading></Flex></Card>;
}
