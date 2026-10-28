// @example A region over a different backdrop gets its own Environment
import { Card, Environment } from 'pane-react';

export default function EnvironmentNested() {
  return (
    <Environment brightness="bright">
      <div className="env-tile" data-tile="city">
        <Card as="div">
          <p className="flush"><b>Gallery</b></p>
          <p className="flush muted">A sunlit photo behind. The region declares bright.</p>
        </Card>
      </div>
    </Environment>
  );
}
