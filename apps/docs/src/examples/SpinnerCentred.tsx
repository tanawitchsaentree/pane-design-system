// @example A spinner centred in an empty pane
import { Card, Center, Spinner } from 'pane-react';

export default function SpinnerCentred() {
  return (
    <Card as="div" className="demo-card">
      <Center className="demo-center"><Spinner label="Loading the map" /></Center>
    </Card>
  );
}
