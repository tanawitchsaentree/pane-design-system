// @example A pick-up time
import { Card, TimePicker } from 'pane-react';

export default function TimePick() {
  return <Card as="div" className="demo-card"><TimePicker label="Pick-up time" min="09:00" max="17:00" step={30} defaultValue="11:30" /></Card>;
}
