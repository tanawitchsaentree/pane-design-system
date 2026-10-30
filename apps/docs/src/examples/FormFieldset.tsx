// @example Fields grouped in sections
import { Button, Card, Fieldset, Form, FormField, Input, Switch } from 'pane-react';

export default function FormFieldset() {
  return <Card as="div" className="demo-card"><Form actions={<Button type="submit">Save</Button>}><Fieldset legend="Shop"><FormField label="Shop name"><Input name="shop" defaultValue="North Light Prints" /></FormField></Fieldset><Fieldset legend="Email"><Switch label="Send me order emails" defaultChecked /></Fieldset></Form></Card>;
}
