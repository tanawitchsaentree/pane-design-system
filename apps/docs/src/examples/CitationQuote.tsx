// @example A source with only a title
import { Card, Citation, Text } from 'pane-react';

export default function CitationQuote() {
  return <Card as="div" className="demo-card demo-wide"><Text as="p">The clinic opens at 07:30 on weekdays<Citation index={1} title="Bryggen clinic, opening hours" href="#hours" />.</Text></Card>;
}
