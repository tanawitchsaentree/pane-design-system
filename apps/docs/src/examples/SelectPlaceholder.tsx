// @example A placeholder until something is chosen
import { Card, Select } from 'pane-react';

export default function SelectPlaceholder() {
  return (
    <Card as="div" className="demo-card">
      <Select label="Print size" placeholder="Choose a size" options={[
        { value: 'a4', label: 'A4' },
        { value: 'a3', label: 'A3' },
        { value: 'a2', label: 'A2 (sold out)', disabled: true },
      ]} />
    </Card>
  );
}
