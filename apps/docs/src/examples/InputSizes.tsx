// @example Two sizes
import { Card, FormField, Input } from 'pane-react';

export default function InputSizes() {
  return (
    <Card as="div" className="demo-card">
      <FormField label="Album name (md, 44px)"><Input defaultValue="Lysefjord" /></FormField>
      <FormField label="Filter (sm, 32px)"><Input size="sm" placeholder="Type to filter" /></FormField>
    </Card>
  );
}
