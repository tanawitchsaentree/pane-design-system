// @example A site header with three sections
import { Button, Navbar, Text } from 'pane-react';

export default function NavbarSite() {
  return <Navbar sticky={false} brand={<Text weight="semibold">North Light</Text>} links={[{ href: '#prints', label: 'Prints' }, { href: '#journal', label: 'Journal' }, { href: '#about', label: 'About' }]} current="#prints" actions={<Button size="sm" variant="light">Sign in</Button>} />;
}
