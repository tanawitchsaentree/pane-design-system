// @example Counted in prints instead of per cent
import { Card, Progress } from 'pane-react';

export default function ProgressSteps() {
  return <Card as="div" className="demo-card"><Progress label="Printing your order" value={2} max={3} valueText="2 of 3 prints" showValue /></Card>;
}
