// @example Nothing new
import { Card, NotificationCenter } from 'pane-react';

export default function NoticeEmpty() {
  return <Card as="div" className="demo-card demo-wide"><NotificationCenter preview notices={[]} /></Card>;
}
