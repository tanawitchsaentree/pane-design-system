// @example A deep path
import { Breadcrumb, Card } from 'pane-react';

export default function BreadcrumbLong() {
  return <Card as="div" className="demo-card"><Breadcrumb items={[{ href: '#home', label: 'Home' }, { href: '#shop', label: 'Shop' }, { href: '#prints', label: 'Prints' }, { href: '#landscape', label: 'Landscape' }, { href: '#north', label: 'The north coast series' }]} /></Card>;
}
