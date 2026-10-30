// @example Inset to the text
import { Card, Divider } from 'pane-react';

export default function DividerInset() {
  return (
    <Card as="div" className="demo-card demo-flush">
      <p className="demo-row-pad flush">Lofoten · March</p>
      <Divider inset decorative />
      <p className="demo-row-pad flush">Senja · June</p>
    </Card>
  );
}
