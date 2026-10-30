// @example Locked while the account is checked
import { Card, FormField, PasswordInput } from 'pane-react';

export default function PwDisabled() {
  return <Card as="div" className="demo-card"><FormField label="Password" disabled help="You can change it once your email is confirmed."><PasswordInput name="password" defaultValue="north-light-prints" /></FormField></Card>;
}
