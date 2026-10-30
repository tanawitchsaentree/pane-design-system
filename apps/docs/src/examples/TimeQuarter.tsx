// @example Every quarter hour
import { Card, TimePicker } from 'pane-react';

export default function TimeQuarter() {
  return <Card as="div" className="demo-card"><TimePicker label="Start" min="18:00" max="22:00" defaultValue="19:15" /></Card>;
}
