// @example Frosted disc and bare icon
import { Card, IconButton } from 'pane-react';
import { IconMore, IconPencil, IconShare } from '../icons';

export default function IconButtonVariants() {
  return (
    <Card as="div" className="demo-card">
      <div className="demo-row">
        <IconButton aria-label="Edit profile"><IconPencil /></IconButton>
        <IconButton variant="ghost" aria-label="More options"><IconMore /></IconButton>
        <IconButton variant="ghost" size="sm" aria-label="Share post"><IconShare /></IconButton>
      </div>
    </Card>
  );
}
