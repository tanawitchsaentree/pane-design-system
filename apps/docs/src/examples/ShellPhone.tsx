// @example Narrow, with a bottom bar
import { AppShell, BottomNav, Card, Heading, Text } from 'pane-react';
import { IconHome, IconSearch, IconUser } from '../icons';

export default function ShellPhone() {
  return <div className="demo-narrow"><AppShell bottomNav={<BottomNav position="contained" current="#feed" items={[{ href: '#feed', label: 'Feed', icon: <IconHome /> }, { href: '#search', label: 'Search', icon: <IconSearch /> }, { href: '#me', label: 'You', icon: <IconUser /> }]} />}><Card as="div" className="demo-card"><Heading level={2}>Feed</Heading><Text>New prints from people you follow.</Text></Card></AppShell></div>;
}
