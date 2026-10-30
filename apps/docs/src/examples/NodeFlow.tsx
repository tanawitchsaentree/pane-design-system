// @example Three steps of a pipeline
import { NodeCard } from 'pane-react';

export default function NodeFlow() {
  return (
    <div className="demo-row">
      <NodeCard title="Fetch prices" meta="HTTP" ports={{ out: 1 }} />
      <NodeCard title="Match cards" meta="Join on set code" ports={{ in: 1, out: 1 }} />
      <NodeCard title="Write deck" meta="Database" ports={{ in: 1 }} />
    </div>
  );
}
