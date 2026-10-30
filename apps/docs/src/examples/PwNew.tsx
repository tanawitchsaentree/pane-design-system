// @example Choosing a new password
import { Card, FormField, PasswordInput } from 'pane-react';

export default function PwNew() {
  return <Card as="div" className="demo-card"><FormField label="New password" help="At least 12 characters. A short sentence works well."><PasswordInput name="new-password" autoComplete="new-password" /></FormField></Card>;
}
