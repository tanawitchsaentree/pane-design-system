// @example The show button in another language
import { Card, FormField, PasswordInput } from 'pane-react';

export default function PwLabel() {
  return <Card as="div" className="demo-card" lang="nb"><FormField label="Passord"><PasswordInput name="password" showLabel="Vis passord" /></FormField></Card>;
}
