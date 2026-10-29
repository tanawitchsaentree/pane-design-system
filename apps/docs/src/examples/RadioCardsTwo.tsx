// @example Two columns
import { Card, RadioCards } from 'pane-react';

export default function RadioCardsTwo() {
  return <Card as="div" className="demo-card"><RadioCards label="Frame" columns={2} defaultValue="oak" options={[{ value: 'oak', title: 'Oak' }, { value: 'black', title: 'Black' }, { value: 'white', title: 'White' }, { value: 'none', title: 'No frame', disabled: true }]} /></Card>;
}
