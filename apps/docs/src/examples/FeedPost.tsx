// @example A feed post
import { Avatar, Card, IconButton } from 'pane-react';
import { IconHeart, IconMore, IconReply, IconRepost, IconShare, IconVerified, IconViews } from '../icons';

export default function FeedPost() {
  return (
    <Card aria-label="Post by Apple" className="demo-card">
      <header className="post-head">
        <Avatar name="Apple" size="md" decorative />
        <b>Apple</b><IconVerified className="verified sm" />
        <span className="muted ellipsis">@Apple · 8h</span>
        <IconButton variant="ghost" size="sm" aria-label="More options" className="push"><IconMore /></IconButton>
      </header>
      <p className="flush">The era of spatial computing is here. Digital content that blends with your physical space.</p>
      <div className="feed-media" role="img" aria-label="Product photo: headset on a white background" />
      <footer className="actions muted">
        <span><IconReply />268</span>
        <span><IconRepost />839</span>
        <span><IconHeart />6,707</span>
        <span><IconViews />1.7M</span>
        <IconButton variant="ghost" size="sm" aria-label="Share post" className="push"><IconShare /></IconButton>
      </footer>
    </Card>
  );
}
