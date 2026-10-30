// @example A code sent by email
import { Card, OTPFlow } from 'pane-react';

export default function OtpEmail() {
  return <Card as="div" className="demo-card"><OTPFlow destination="m•••@lind.no" onVerify={(c) => new Promise((r) => setTimeout(() => r(c === '123456'), 600))} onResend={() => {}} resendAfter={60} /></Card>;
}
