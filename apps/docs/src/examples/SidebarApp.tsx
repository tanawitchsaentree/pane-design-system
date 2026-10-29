// @example Sections in an app
import { Sidebar, Text } from 'pane-react';
import { IconHome, IconSearch, IconUser, IconInbox, IconImage } from '../icons';

export default function SidebarApp() {
  return <div className="demo-tall"><Sidebar current="#photos" header={<Text weight="semibold">North Light</Text>} sections={[{ items: [{ href: '#inbox', label: 'Inbox', icon: <IconInbox />, badge: '12' }, { href: '#photos', label: 'Photos', icon: <IconImage /> }] }, { title: 'Albums', items: [{ href: '#lofoten', label: 'Lofoten' }, { href: '#senja', label: 'Senja' }] }]} /></div>;
}
