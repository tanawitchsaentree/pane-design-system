// @example Read-only once verified
import { Card, PinInput } from 'pane-react';

export default function PinInputReadOnly() {
  return <Card as="div" className="demo-card"><PinInput aria-label="Verification code" length={6} readOnly defaultValue="381904" /></Card>;
}
