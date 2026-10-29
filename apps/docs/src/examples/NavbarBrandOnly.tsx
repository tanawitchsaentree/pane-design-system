// @example A brand and one action
import { Button, Navbar, Text } from 'pane-react';

export default function NavbarBrandOnly() {
  return <Navbar sticky={false} brand={<Text weight="semibold">North Light</Text>} actions={<Button size="sm" variant="glass">Share</Button>} />;
}
