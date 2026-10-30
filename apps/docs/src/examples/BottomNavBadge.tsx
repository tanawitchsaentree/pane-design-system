// @example A count on one destination
import { BottomNav } from 'pane-react';
import { IconHome, IconSearch, IconUser, IconInbox, IconImage } from '../icons';

export default function BottomNavBadge() {
  return <div className="demo-phone"><BottomNav position="contained" current="#home" onNavigate={(_, e) => e.preventDefault()} items={[{ href: '#home', label: 'Home', icon: <IconHome /> }, { href: '#inbox', label: 'Inbox', icon: <IconInbox />, badge: 120 }, { href: '#me', label: 'Profile', icon: <IconUser /> }]} /></div>;
}
