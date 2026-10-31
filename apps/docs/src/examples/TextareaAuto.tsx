// @example Grows with the text, then scrolls, with a count
import { Card, FormField, Textarea } from 'pane-react';

export default function TextareaAuto() {
  return <Card as="div" className="demo-card"><FormField label="Message to the buyer"><Textarea autoResize rows={2} maxRows={6} maxLength={500} showCount /></FormField></Card>;
}
