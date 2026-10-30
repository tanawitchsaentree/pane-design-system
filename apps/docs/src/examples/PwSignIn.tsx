// @example Signing in
import { Card, FormField, PasswordInput } from 'pane-react';

export default function PwSignIn() {
  return <Card as="div" className="demo-card"><FormField label="Password"><PasswordInput name="password" /></FormField></Card>;
}
