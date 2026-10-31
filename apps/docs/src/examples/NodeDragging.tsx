// @example While it is dragged it lifts
import { Card, NodeCard } from 'pane-react';

export default function NodeDragging() {
  return <Card as="div" className="demo-card demo-wide"><div className="demo-flow"><NodeCard title="Resting" meta="On the canvas" /><NodeCard title="Dragging" meta="Lifted one level" dragging selected /></div></Card>;
}
