// @example With a details panel
import { AppShell, Card, Heading, Sidebar, Text } from 'pane-react';

export default function ShellAside() {
  return <div className="demo-wide"><AppShell sidebar={<Sidebar current="#prints" sections={[{ items: [{ href: '#orders', label: 'Orders' }, { href: '#prints', label: 'Prints' }] }]} />} aside={<Card as="div" className="demo-card"><Text weight="semibold">Lofoten, March</Text><Text size="label" tone="secondary">18 sold</Text></Card>}><Card as="div" className="demo-card"><Heading level={2}>Prints</Heading><Text>24 prints in the shop.</Text></Card></AppShell></div>;
}
