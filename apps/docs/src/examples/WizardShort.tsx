// @example Two steps with a custom finish
import { Card, Text, Wizard } from 'pane-react';

export default function WizardShort() {
  return <Card as="div" className="demo-card demo-wide"><Wizard label="Export prints" finishLabel="Export" onFinish={() => {}} steps={[{ label: 'Choose', description: 'Which prints', content: <Text>All 24 prints in Lofoten, winter.</Text> }, { label: 'Format', description: 'File type', content: <Text>Full-size JPG, sRGB.</Text> }]} /></Card>;
}
