// @example Wrong, with the reason in words
import { Autocomplete, Card, FormField } from 'pane-react';

export default function AutocompleteInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Camera" error="Enter the camera the photo was taken with"><Autocomplete label="Camera" suggestions={['Leica Q2', 'Ricoh GR III']} /></FormField></Card>;
}
