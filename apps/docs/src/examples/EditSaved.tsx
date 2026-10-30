// @example Saving as it changes
import { useState } from 'react';
import { Card, Editable, Flex, Text } from 'pane-react';

export default function EditSaved() {
  const [saved, setSaved] = useState('North Light Prints');
  return (
    <Card as="div" className="demo-card">
      <Flex direction="column" gap="sm">
        <Editable label="Shop name" defaultValue={saved} onSave={setSaved} />
        <Text size="label" tone="secondary">The shop is called {saved}.</Text>
      </Flex>
    </Card>
  );
}
