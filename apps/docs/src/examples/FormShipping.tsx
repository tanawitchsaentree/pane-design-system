// @example A shipping form
import { Button, Card, Form, FormField, Input } from 'pane-react';

export default function FormShipping() {
  return <Card as="div" className="demo-card"><Form actions={<><Button type="submit">Save address</Button><Button variant="glass">Cancel</Button></>}><FormField label="Full name"><Input name="name" autoComplete="name" /></FormField><FormField label="Street address"><Input name="street" autoComplete="street-address" /></FormField><FormField label="Postcode"><Input name="postcode" autoComplete="postal-code" inputMode="numeric" /></FormField></Form></Card>;
}
