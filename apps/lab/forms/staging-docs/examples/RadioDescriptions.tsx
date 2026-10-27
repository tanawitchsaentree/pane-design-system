// @example Options with a line of detail
import { Card, Radio, RadioGroup } from 'pane-react';

export default function RadioDescriptions() {
  return (
    <Card as="div" className="demo-card">
      <RadioGroup label="Print paper" defaultValue="rag">
        <Radio value="rag" label="Cotton rag" description="Matte, deep blacks. Best for landscapes." />
        <Radio value="gloss" label="Gloss" description="Bright colour, visible reflections." />
        <Radio value="metal" label="Aluminium" description="Sold out until December." disabled />
      </RadioGroup>
    </Card>
  );
}
