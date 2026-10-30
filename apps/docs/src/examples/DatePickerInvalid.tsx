// @example Wrong, with the reason in words
import { Card, DatePicker, FormField } from 'pane-react';

export default function DatePickerInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Collection date" error="Choose a date after today"><DatePicker /></FormField></Card>;
}
