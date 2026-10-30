// @example Fixed once the order ships
import { Card, DatePicker, FormField } from 'pane-react';

export default function DateDisabled() {
  return <Card as="div" className="demo-card"><FormField label="Ship date" disabled><DatePicker defaultValue={new Date(2026, 10, 3)} /></FormField></Card>;
}
