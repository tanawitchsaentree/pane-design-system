// @example Photo or initials — the same name drives both
import { Avatar } from 'pane-react';

export default function AvatarPhoto() {
  return (
    <div className="demo-row">
      <Avatar name="Forest Team" src="/scenes/forest.jpg" size="lg" />
      <Avatar name="Forest Team" size="lg" />
    </div>
  );
}
