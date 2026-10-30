// @example Off for a shared album
import { Card, ColorPicker } from 'pane-react';

export default function ColorPickerDisabled() {
  return <Card as="div" className="demo-card"><ColorPicker label="Album colour" disabled defaultValue="#3A6EA5" swatches={[{ value: '#3A6EA5', name: 'Fjord blue' }, { value: '#C9A227', name: 'Ochre' }, { value: '#5E8C61', name: 'Moss' }]} /></Card>;
}
