// @example Grows with the text, then scrolls, with a count
import { FormField, Textarea } from 'pane-react';

export default function TextareaAuto() {
  return <FormField label="Message to the buyer"><Textarea autoResize rows={2} maxRows={6} maxLength={500} showCount /></FormField>;
}
