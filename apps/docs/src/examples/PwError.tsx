// @example A wrong password
import { Card, FormField, PasswordInput } from 'pane-react';

export default function PwError() {
  return <Card as="div" className="demo-card"><FormField label="Password" error="That password is not right. Check it and try again, or reset it."><PasswordInput name="password" defaultValue="hunter2" /></FormField></Card>;
}
