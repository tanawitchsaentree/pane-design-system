// @example Wrong, with the reason in words
import { Card, Switch } from 'pane-react';

export default function SwitchInvalid() {
  return <Card as="div" className="demo-card"><><Switch label="Share location with the courier" invalid /><p className="flush muted small">Turn this on for doorstep delivery.</p></></Card>;
}
