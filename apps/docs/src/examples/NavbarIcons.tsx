// @example Icon actions at the end
import { IconButton, Navbar, Text } from 'pane-react';
import { IconHome, IconSearch, IconUser, IconInbox, IconImage } from '../icons';

export default function NavbarIcons() {
  return <Navbar sticky={false} brand={<Text weight="semibold">North Light</Text>} links={[{ href: '#prints', label: 'Prints' }, { href: '#journal', label: 'Journal' }, { href: '#about', label: 'About' }]} current="#journal" actions={<IconButton aria-label="Search" variant="glass"><IconSearch /></IconButton>} />;
}
