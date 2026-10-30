// @example Dates in Norwegian
import { Card, DatePicker, FormField } from 'pane-react';

export default function DateLocale() {
  return <Card as="div" className="demo-card"><FormField label="Hentedato"><DatePicker locale="nb-NO" placeholder="Velg en dato" defaultValue={new Date(2026, 10, 12)} /></FormField></Card>;
}
