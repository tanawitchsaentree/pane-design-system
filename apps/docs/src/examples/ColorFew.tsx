// @example A few colours for labels
import { Card, ColorPicker } from 'pane-react';

export default function ColorFew() {
  return <Card as="div" className="demo-card"><ColorPicker label="Label colour" defaultValue="#B5523B" swatches={[{ value: '#B5523B', name: 'Rust' }, { value: '#3A6EA5', name: 'Fjord blue' }, { value: '#E8E2D6', name: 'Paper' }]} /></Card>;
}
