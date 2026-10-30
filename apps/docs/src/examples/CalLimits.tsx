// @example Only the next few weeks
import { Calendar, Card } from 'pane-react';

export default function CalLimits() {
  return <Card as="div" className="demo-card"><Calendar label="Delivery date" defaultMonth={new Date(2026, 10, 1)} min={new Date(2026, 10, 4)} max={new Date(2026, 10, 27)} isUnavailable={(d) => d.getDay() === 0} /></Card>;
}
