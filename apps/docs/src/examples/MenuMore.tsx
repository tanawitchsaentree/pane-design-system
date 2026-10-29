// @example Actions behind a More button
import { IconButton, Menu } from 'pane-react';
import { IconMore, IconPencil, IconShare } from '../icons';

export default function MenuMore() {
  return <Menu label="Photo actions" trigger={<IconButton aria-label="More actions" variant="glass"><IconMore /></IconButton>} items={[{ label: 'Edit', icon: <IconPencil />, onSelect: () => {} }, { label: 'Share', icon: <IconShare />, onSelect: () => {} }, 'separator', { label: 'Delete photo', tone: 'critical', onSelect: () => {} }]} />;
}
