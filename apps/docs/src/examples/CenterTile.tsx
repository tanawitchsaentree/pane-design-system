// @example An icon centred in a tile
import { Card, Center } from 'pane-react';
import { IconPin } from '../icons';

export default function CenterTile() {
  return (
    <Card as="div" className="demo-card">
      <Center className="demo-tile"><IconPin aria-hidden="true" /></Center>
      <p className="flush">Saved places</p>
    </Card>
  );
}
