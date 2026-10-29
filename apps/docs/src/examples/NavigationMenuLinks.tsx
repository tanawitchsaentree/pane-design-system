// @example Plain links, no panels
import { Card, NavigationMenu } from 'pane-react';

export default function NavigationMenuLinks() {
  return <Card as="div" className="demo-card"><NavigationMenu items={[{ label: 'Prints', href: '#prints' }, { label: 'Journal', href: '#journal' }, { label: 'About', href: '#about' }]} /></Card>;
}
