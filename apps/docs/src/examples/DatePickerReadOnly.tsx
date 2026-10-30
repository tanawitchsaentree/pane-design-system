// @example Read-only once booked
import { Card, DatePicker, FormField } from 'pane-react';

export default function DatePickerReadOnly() {
  return <Card as="div" className="demo-card"><FormField label="Collection date"><DatePicker readOnly defaultValue={new Date(2026, 10, 12)} /></FormField></Card>;
}
