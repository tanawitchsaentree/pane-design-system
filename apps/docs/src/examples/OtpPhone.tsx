// @example A code sent to a phone
import { Card, OTPFlow } from 'pane-react';

export default function OtpPhone() {
  return <Card as="div" className="demo-card"><OTPFlow destination="•••• 4821" onVerify={(c) => c === '123456'} onResend={() => {}} /></Card>;
}
