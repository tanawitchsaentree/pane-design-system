// @example Read-only once booked
import { Card, TimePicker } from 'pane-react';

export default function TimePickerReadOnly() {
  return <Card as="div" className="demo-card"><TimePicker label="Pick-up time" readOnly defaultValue="10:30" /></Card>;
}
