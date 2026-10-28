// @example Photo or initials from the same name
import { Avatar } from 'pane-react';

export default function AvatarPhoto() {
  return (
    <div className="demo-row">
      <Avatar name="Forest Team" src="/scenes/forest-sm.jpg" size="lg" />
      <Avatar name="Forest Team" size="lg" />
    </div>
  );
}
