// @example One panel among links
import { Card, NavigationMenu } from 'pane-react';

export default function NavigationMenuMixed() {
  return <Card as="div" className="demo-card demo-tall"><NavigationMenu items={[{ label: 'Prints', href: '#prints' }, { label: 'Learn', links: [{ href: '#workshops', label: 'Workshops', description: 'Two days in Lofoten' }, { href: '#guides', label: 'Guides', description: 'Reading winter light' }] }, { label: 'Contact', href: '#contact' }]} /></Card>;
}
