// @example Nothing chosen yet
import { Card, DatePicker, FormField } from 'pane-react';

export default function DateEmpty() {
  return <Card as="div" className="demo-card"><FormField label="Delivery date" help="Weekdays only."><DatePicker placeholder="Choose a weekday" isUnavailable={(d) => d.getDay() === 0 || d.getDay() === 6} /></FormField></Card>;
}
