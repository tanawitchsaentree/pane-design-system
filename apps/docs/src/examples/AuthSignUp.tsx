// @example Creating an account
import { AuthForm, Card } from 'pane-react';

export default function AuthSignUp() {
  return <Card as="div" className="demo-card"><AuthForm mode="sign-up" onSubmit={() => {}} passwordHint="At least 12 characters. A short sentence works well." onSwitch={() => {}} /></Card>;
}
