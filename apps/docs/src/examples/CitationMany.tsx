// @example Several sources in one answer
import { Card, Citation, Text } from 'pane-react';

export default function CitationMany() {
  return (
    <Card as="div" className="demo-card demo-wide">
      <Text as="p">Take it with food<Citation index={1} title="Patient leaflet" source="Medicines agency" /> and not with grapefruit juice<Citation index={2} title="Interaction checker" source="Pharmacy database" quote="Grapefruit raises the level of the drug in the blood." />.</Text>
    </Card>
  );
}
