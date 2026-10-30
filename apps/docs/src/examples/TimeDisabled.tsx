// @example Off until a date is chosen
import { Card, TimePicker } from 'pane-react';

export default function TimeDisabled() {
  return <Card as="div" className="demo-card"><TimePicker label="Pick-up time" disabled placeholder="Choose a date first" /></Card>;
}
