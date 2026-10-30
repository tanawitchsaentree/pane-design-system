// @example The dock at the foot of a phone screen
import { useState } from 'react';
import { BottomNav, Flex, Text } from 'pane-react';
import { IconHome, IconSearch, IconUser, IconInbox, IconImage } from '../icons';

export default function BottomNavPhone() {
  const [current, setCurrent] = useState('#home');
  return <div className="demo-phone"><Flex direction="column" justify="between" gap="md" className="demo-fill"><Text weight="semibold">Home</Text><BottomNav position="contained" current={current} onNavigate={(href, e) => { e.preventDefault(); setCurrent(href); }} items={[{ href: '#home', label: 'Home', icon: <IconHome /> }, { href: '#search', label: 'Search', icon: <IconSearch /> }, { href: '#inbox', label: 'Inbox', icon: <IconInbox />, badge: 3 }, { href: '#me', label: 'Profile', icon: <IconUser /> }]} /></Flex></div>;
}
