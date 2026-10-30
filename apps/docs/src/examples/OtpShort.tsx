// @example A four digit code with no resend
import { Card, OTPFlow } from 'pane-react';

export default function OtpShort() {
  return <Card as="div" className="demo-card"><OTPFlow destination="the card reader" length={4} onVerify={(c) => c === '1234'} /></Card>;
}
