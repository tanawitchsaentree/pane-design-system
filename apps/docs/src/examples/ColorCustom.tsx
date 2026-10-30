// @example Any colour by its hex value
import { Card, ColorPicker } from 'pane-react';

export default function ColorCustom() {
  return <Card as="div" className="demo-card"><ColorPicker label="Tag colour" custom defaultValue="#5E8C61" swatches={[{ value: '#3A6EA5', name: 'Fjord blue' }, { value: '#C9A227', name: 'Birch gold' }, { value: '#5E8C61', name: 'Moss' }, { value: '#B5523B', name: 'Rust' }]} /></Card>;
}
