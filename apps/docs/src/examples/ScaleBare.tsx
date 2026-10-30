// @example Bare, inside a table row that names it
import { Card, Scale, Table } from 'pane-react';

const ROWS = [{ id: 1, deck: 'Mono white tokens', speed: 4.6 }, { id: 2, deck: 'Blue control', speed: 1.8 }];
export default function ScaleBare() {
  return <Card as="div" className="demo-card demo-wide"><Table caption="Decks by speed" columns={[{ key: 'deck', header: 'Deck' }, { key: 'speed', header: 'Speed', render: (r) => <Scale label={`Speed of ${r.deck}`} value={r.speed as number} bare /> }]} rows={ROWS} /></Card>;
}
