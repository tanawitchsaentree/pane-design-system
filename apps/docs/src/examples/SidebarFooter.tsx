// @example A footer under the sections
import { Button, Sidebar } from 'pane-react';
import { IconHome, IconSearch, IconUser, IconInbox, IconImage } from '../icons';

export default function SidebarFooter() {
  return <div className="demo-tall"><Sidebar current="#inbox" sections={[{ items: [{ href: '#inbox', label: 'Inbox', icon: <IconInbox /> }, { href: '#search', label: 'Search', icon: <IconSearch /> }] }]} footer={<Button size="sm" variant="glass">Sign out</Button>} /></div>;
}
