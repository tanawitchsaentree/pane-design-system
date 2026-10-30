// @example A colour for an album
import { Card, ColorPicker } from 'pane-react';

export default function ColorAlbum() {
  return <Card as="div" className="demo-card"><ColorPicker label="Album colour" swatches={[{ value: '#3A6EA5', name: 'Fjord blue' }, { value: '#C9A227', name: 'Birch gold' }, { value: '#5E8C61', name: 'Moss' }, { value: '#B5523B', name: 'Rust' }, { value: '#7A6C9D', name: 'Dusk' }, { value: '#E8E2D6', name: 'Paper' }]} /></Card>;
}
