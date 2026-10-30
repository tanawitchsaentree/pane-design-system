// @example Errors after a submit
import { AuthForm, Card } from 'pane-react';

export default function AuthErrors() {
  return <Card as="div" className="demo-card"><AuthForm onSubmit={() => {}} errors={{ email: 'Enter an email address, such as mara@lind.no', password: 'Enter your password' }} /></Card>;
}
