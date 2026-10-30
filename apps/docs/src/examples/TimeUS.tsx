// @example Times on a 12 hour clock
import { Card, TimePicker } from 'pane-react';

export default function TimeUS() {
  return <Card as="div" className="demo-card"><TimePicker label="Call time" locale="en-US" min="08:00" max="18:00" step={60} /></Card>;
}
