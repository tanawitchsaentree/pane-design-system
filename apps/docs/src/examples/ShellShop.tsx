// @example A shop admin
import { AppShell, BottomNav, Card, Heading, Navbar, Sidebar, Text } from 'pane-react';
import { IconImage, IconInbox } from '../icons';

export default function ShellShop() {
  return <div className="demo-wide"><AppShell label="Orders" header={<Navbar brand="North Light" links={[{ href: '#orders', label: 'Orders' }, { href: '#prints', label: 'Prints' }]} current="#orders" />} sidebar={<Sidebar current="#orders" sections={[{ items: [{ href: '#orders', label: 'Orders' }, { href: '#prints', label: 'Prints' }, { href: '#settings', label: 'Settings' }] }]} />} bottomNav={<BottomNav position="contained" current="#orders" items={[{ href: '#orders', label: 'Orders', icon: <IconInbox /> }, { href: '#prints', label: 'Prints', icon: <IconImage /> }]} />}><Card as="div" className="demo-card"><Heading level={2}>Orders</Heading><Text>Three orders are waiting to ship.</Text></Card></AppShell></div>;
}
