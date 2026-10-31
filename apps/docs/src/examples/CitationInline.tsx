// @example A claim with its source a press away
import { Card, Citation, ConfidenceChip, Text } from 'pane-react';

export default function CitationInline() {
  return (
    <Card as="div" className="demo-card demo-wide">
      <Text as="p">Your LDL cholesterol fell from 4.2 to 3.4 mmol/L<Citation index={1} title="Blood test, 12 March" source="Lab results" quote="LDL cholesterol 3.4 mmol/L (ref. below 3.0)" href="#lab-12-march" confidence={<ConfidenceChip level={5} />} /> since your last test.</Text>
    </Card>
  );
}
