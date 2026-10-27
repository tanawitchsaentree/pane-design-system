// @example Avatar sizes, with and without a photo
import { Avatar } from 'pane-react';

export default function AvatarSizes() {
  return (
    <div className="demo-row">
      <Avatar name="Max Fmz" size="lg" />
      <Avatar name="Visual Flow" size="md" />
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Grace Hopper" size="md" src="/scenes/forest-sm.jpg" />
    </div>
  );
}
