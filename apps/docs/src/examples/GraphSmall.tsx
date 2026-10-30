// @example A small graph of three nodes
import { NetworkGraph } from 'pane-react';

export default function GraphSmall() {
  return <NetworkGraph label="Three services" blockSize={200} nodes={[{ id: 'w', label: 'Web' }, { id: 'a', label: 'API' }, { id: 'd', label: 'Database' }]} edges={[{ from: 'w', to: 'a' }, { from: 'a', to: 'd' }]} />;
}
