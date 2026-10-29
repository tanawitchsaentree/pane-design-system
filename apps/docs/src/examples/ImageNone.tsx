// @example An image at the edge with no corner
import { Image } from 'pane-react';

export default function ImageNone() {
  return <Image src="/scenes/room-sm.jpg" alt="A shop wall with prints and a coat" radius="none" className="demo-img" />;
}
