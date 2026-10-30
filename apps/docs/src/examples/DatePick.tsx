// @example A pick-up date
import { Card, DatePicker, FormField } from 'pane-react';

export default function DatePick() {
  return <Card as="div" className="demo-card"><FormField label="Pick-up date"><DatePicker defaultValue={new Date(2026, 10, 12)} /></FormField></Card>;
}
