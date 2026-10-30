// @example A step that checks itself
import { useState } from 'react';
import { Card, FormField, Input, Wizard } from 'pane-react';

export default function WizardCheck() {
  const [name, setName] = useState('');
  const [err, setErr] = useState<string>();
  return (
    <Card as="div" className="demo-card demo-wide">
      <Wizard label="Open a shop" onFinish={() => {}} steps={[
        { label: 'Name', content: <FormField label="Shop name" error={err}><Input value={name} onChange={(e) => setName(e.target.value)} /></FormField>, validate: () => { setErr(name ? undefined : 'Give the shop a name'); return !!name; } },
        { label: 'Done', content: <p>Your shop is ready.</p> },
      ]} />
    </Card>
  );
}
