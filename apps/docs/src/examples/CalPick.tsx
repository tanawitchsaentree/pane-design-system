// @example Choosing a day
import { Calendar, Card } from 'pane-react';

export default function CalPick() {
  return <Card as="div" className="demo-card"><Calendar label="Pick-up date" defaultValue={new Date(2026, 10, 12)} /></Card>;
}
