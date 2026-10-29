// @example Where this page sits
import { Breadcrumb, Card } from 'pane-react';

export default function BreadcrumbPath() {
  return <Card as="div" className="demo-card"><Breadcrumb items={[{ href: '#home', label: 'Home' }, { href: '#albums', label: 'Albums' }, { href: '#lofoten', label: 'Lofoten, March' }]} /></Card>;
}
