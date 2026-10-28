// @example Ghost icons in an action row
import { Card, IconButton } from 'pane-react';
import { IconHeart, IconReply, IconRepost, IconShare } from '../icons';

export default function IconButtonActionRow() {
  return (
    <Card as="div" className="demo-card">
      <div className="demo-row" role="group" aria-label="Post actions">
        <IconButton variant="ghost" size="sm" aria-label="Reply, 268"><IconReply /></IconButton>
        <IconButton variant="ghost" size="sm" aria-label="Repost, 839"><IconRepost /></IconButton>
        <IconButton variant="ghost" size="sm" aria-label="Like, 6,707"><IconHeart /></IconButton>
        <IconButton variant="ghost" size="sm" aria-label="Share post"><IconShare /></IconButton>
      </div>
    </Card>
  );
}
