// @example Wrong, with the reason in words
import { Card, FormField, TagInput } from 'pane-react';

export default function TagInputInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Tags" error="Add at least one tag"><TagInput label="Tags" /></FormField></Card>;
}
