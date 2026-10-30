// The stack of glass, shown and measured: a pane with surfaces inside it, and an overlay on a scrim with a
// popover above it. Gate G-EL1 reads the pixels of every [data-level] against what is under it.
import { Button, Card, Chip } from 'pane-react';
import { Stage } from './kit';

export function ElevationDemo() {
  return (
    <div className="elev-grid" data-elevation-demo="">
      <Stage>
        <Card as="div" className="demo-card" data-level-sample="1">
          <p className="eyebrow flush">Level 1 · a pane</p>
          <div className="elev-tiles">
            <Card as="div" data-level-sample="2"><p className="flush"><b>Level 2</b></p><p className="flush muted">A surface inside the pane</p></Card>
            <Card as="div" data-level-sample="2"><p className="flush"><b>Level 2</b></p><p className="flush muted">No second blur</p></Card>
          </div>
        </Card>
      </Stage>
      <Stage>
        <div className="elev-under" aria-hidden="true">
          <Card as="div" className="demo-card"><p className="flush">A pane under the overlay</p><p className="flush muted">Dimmed by the scrim</p></Card>
        </div>
        <div className="elev-scrim" data-scrim="" />
        <Card as="div" level={3} className="elev-dialog" data-level-sample="3" role="group" aria-label="Level 3, an overlay">
          <p className="eyebrow flush">Level 3 · an overlay</p>
          <Card as="div" data-level-sample="2"><p className="flush">A surface inside the overlay</p></Card>
          <div className="elev-actions"><Button size="sm">Save</Button><Button size="sm" variant="glass">Cancel</Button></div>
          <Card as="div" level={4} className="elev-popover" data-level-sample="4"><Chip>Level 4 · a popover</Chip></Card>
        </Card>
      </Stage>
    </div>
  );
}
