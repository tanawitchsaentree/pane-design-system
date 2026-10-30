// @example Right to left
import { BottomNav } from 'pane-react';
import { IconHome, IconSearch, IconUser, IconInbox, IconImage } from '../icons';

export default function BottomNavRtl() {
  return <div className="demo-phone" dir="rtl" lang="ar"><BottomNav label="الرئيسية" position="contained" current="#home" onNavigate={(_, e) => e.preventDefault()} items={[{ href: '#home', label: 'الرئيسية', icon: <IconHome /> }, { href: '#search', label: 'بحث', icon: <IconSearch /> }, { href: '#me', label: 'حسابي', icon: <IconUser /> }]} /></div>;
}
