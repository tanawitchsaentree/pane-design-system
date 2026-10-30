// @example Other ways in
import { AuthForm, Button, Card } from 'pane-react';

export default function AuthProviders() {
  return <Card as="div" className="demo-card"><AuthForm onSubmit={() => {}} pending providers={<><Button variant="glass">Continue with Apple</Button><Button variant="glass">Continue with Google</Button></>} /></Card>;
}
