// @example A site menu with two panels
import { Card, NavigationMenu } from 'pane-react';

export default function NavigationMenuSite() {
  return <Card as="div" className="demo-card demo-tall"><NavigationMenu items={[{ label: 'Shop', links: [{ href: '#prints', label: 'Prints', description: 'Framed and unframed photographs' }, { href: '#books', label: 'Books', description: 'Three photo books from the north' }] }, { label: 'Journal', links: [{ href: '#stories', label: 'Stories', description: 'Notes from each trip' }, { href: '#gear', label: 'Gear', description: 'What goes in the bag' }] }, { label: 'About', href: '#about' }]} /></Card>;
}
