// @example While it is dragged it lifts
import { NodeCard } from 'pane-react';

export default function NodeDragging() {
  return <div className="demo-row"><NodeCard title="Resting" meta="On the canvas" /><NodeCard title="Dragging" meta="Lifted one level" dragging selected /></div>;
}
