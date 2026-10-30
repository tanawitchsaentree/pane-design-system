// @example Three destinations
import { BottomNav } from 'pane-react';
import { IconHome, IconSearch, IconUser, IconInbox, IconImage } from '../icons';

export default function BottomNavThree() {
  return <div className="demo-phone"><BottomNav position="contained" current="#photos" onNavigate={(_, e) => e.preventDefault()} items={[{ href: '#photos', label: 'Photos', icon: <IconImage /> }, { href: '#search', label: 'Search', icon: <IconSearch /> }, { href: '#me', label: 'Profile', icon: <IconUser /> }]} /></div>;
}
