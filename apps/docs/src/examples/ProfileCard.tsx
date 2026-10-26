// @example The anchor profile card
import { Avatar, Button, Card, CardCover, IconButton, Tabs, Tag } from 'pane-react';
import { IconArrow, IconCalendar, IconHeart, IconLink, IconMore, IconPencil, IconPin, IconReply, IconRepost, IconShare, IconVerified, IconViews } from '../icons';

export default function ProfileCard({ idPrefix = "anchor" }: { idPrefix?: string }) {
  return (
    <Card className="anchor" aria-label="Max Fmz profile">
      <CardCover />
      <div className="anchor-id">
        <Avatar name="Max Fmz" size="lg" decorative />
        <div className="anchor-who">
          <h3 className="flush anchor-name">Max Fmz <IconVerified className="verified" /></h3>
          <span className="muted">@bymxfmz</span>
        </div>
        <IconButton aria-label="Edit profile" className="anchor-edit"><IconPencil /></IconButton>
      </div>
      <p className="flush">UX/UI Designer. Outdoor enthusiast. Coffee lover.</p>
      <ul className="anchor-meta flush">
        <li><IconPin />Switzerland</li>
        <li><IconLink />mfz.framer.website</li>
        <li><IconCalendar />Joined June 2023</li>
      </ul>
      <p className="flush muted anchor-stats"><b>1.6M</b> Following <span aria-hidden="true">·</span> <b>99</b> Followers</p>
      <Tabs.Root defaultValue="tweets">
        <Tabs.List aria-label="Profile sections">
          <Tabs.Trigger value="tweets" id={`${idPrefix}-t-tweets`}>Tweets</Tabs.Trigger>
          <Tabs.Trigger value="replies" id={`${idPrefix}-t-replies`}>Replies</Tabs.Trigger>
          <Tabs.Trigger value="media" id={`${idPrefix}-t-media`}>Media</Tabs.Trigger>
          <Tabs.Trigger value="likes" id={`${idPrefix}-t-likes`}>Likes</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tweets">
          <Card variant="inset">
            <header className="post-head">
              <Avatar name="Visual Flow" size="sm" decorative />
              <b>Visual Flow</b><IconVerified className="verified sm" />
              <span className="muted ellipsis">@visualflow · 9h</span>
              <IconButton variant="ghost" size="sm" aria-label="More options" className="push"><IconMore /></IconButton>
            </header>
            <p className="flush">Say goodbye to flat feeds. Asset 05 is live. Designed for modern visual projects.</p>
            <div className="media" data-group="media" data-theme="dark">
              <Tag className="media-tag">Visual asset 05</Tag>
              <span className="media-num">07</span>
              <span className="media-cap"><IconArrow />Designed for modern visual projects</span>
            </div>
            <footer className="actions muted">
              <span><IconReply />268</span>
              <span><IconRepost />839</span>
              <span><IconHeart />6,707</span>
              <span><IconViews />1.7M</span>
              <IconButton variant="ghost" size="sm" aria-label="Share" className="push"><IconShare /></IconButton>
            </footer>
          </Card>
        </Tabs.Content>
        <Tabs.Content value="replies"><p className="flush muted tab-empty">No replies yet.</p></Tabs.Content>
        <Tabs.Content value="media"><p className="flush muted tab-empty">No media yet.</p></Tabs.Content>
        <Tabs.Content value="likes"><p className="flush muted tab-empty">No likes yet.</p></Tabs.Content>
      </Tabs.Root>
      <Button className="anchor-cta">Follow</Button>
    </Card>
  );
}
