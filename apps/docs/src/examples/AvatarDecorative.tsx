// @example Decorative avatar next to a visible name
import { Avatar, Card } from 'pane-react';

export default function AvatarDecorative() {
  return (
    <Card as="div" className="demo-card">
      <div className="demo-row">
        {/* The name is printed beside it, so the avatar is hidden from screen readers. */}
        <Avatar name="Max Fmz" size="md" decorative />
        <div>
          <p className="flush"><b>Max Fmz</b></p>
          <p className="flush muted">@bymxfmz</p>
        </div>
      </div>
    </Card>
  );
}
