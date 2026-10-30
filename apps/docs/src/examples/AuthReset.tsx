// @example Resetting a password
import { AuthForm, Card } from 'pane-react';

export default function AuthReset() {
  return <Card as="div" className="demo-card"><AuthForm mode="reset" description="We will email you a link to choose a new one." onSubmit={() => {}} onSwitch={() => {}} /></Card>;
}
