// @example A count under the field when there is a limit
import { Card, FormField, Input } from 'pane-react';

export default function InputCount() {
  return <Card as="div" className="demo-card"><FormField label="Print title"><Input maxLength={40} showCount defaultValue="Lofoten, March" /></FormField></Card>;
}
