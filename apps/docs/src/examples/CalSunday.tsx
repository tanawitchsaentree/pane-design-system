// @example A week that starts on Sunday
import { Calendar, Card } from 'pane-react';

export default function CalSunday() {
  return <Card as="div" className="demo-card"><Calendar label="Event date" locale="en-US" weekStartsOn={0} defaultValue={new Date(2026, 10, 20)} /></Card>;
}
