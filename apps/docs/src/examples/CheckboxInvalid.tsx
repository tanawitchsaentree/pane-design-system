// @example Wrong, with the reason in words
import { Card, Checkbox } from 'pane-react';

export default function CheckboxInvalid() {
  return <Card as="div" className="demo-card"><><Checkbox label="I accept the print terms" invalid /><p className="flush muted small">Accept the terms to place the order.</p></></Card>;
}
