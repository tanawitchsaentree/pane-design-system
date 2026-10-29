// @example Text rows without icons
import { Sidebar } from 'pane-react';

export default function SidebarPlain() {
  return <div className="demo-tall"><Sidebar label="Settings" current="#privacy" sections={[{ title: 'Settings', items: [{ href: '#account', label: 'Account' }, { href: '#privacy', label: 'Privacy' }, { href: '#billing', label: 'Billing' }] }]} /></div>;
}
