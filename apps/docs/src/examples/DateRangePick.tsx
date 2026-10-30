// @example A stay from and to
import { Card, DatePicker, FormField } from 'pane-react';

export default function DateRangePick() {
  return <Card as="div" className="demo-card"><FormField label="Stay"><DatePicker mode="range" defaultValue={{ start: new Date(2026, 10, 9), end: new Date(2026, 10, 13) }} /></FormField></Card>;
}
