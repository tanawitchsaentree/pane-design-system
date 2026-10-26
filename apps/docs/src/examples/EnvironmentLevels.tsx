// @example One card per environment, each on the kind of scene it is for
import { Card, Environment } from 'pane-react';

const LEVELS = [
  ['dim', 'room'],
  ['mid', 'forest'],
  ['bright', 'city'],
] as const;

export default function EnvironmentLevels() {
  return (
    <div className="env-demo">
      {LEVELS.map(([brightness, scene]) => (
        <div key={brightness} className="env-tile" data-tile={scene}>
          <Environment brightness={brightness}>
            <Card as="div">
              <p className="flush"><b>{brightness}</b></p>
              <p className="flush muted">For scenes like {scene}.</p>
            </Card>
          </Environment>
        </div>
      ))}
    </div>
  );
}
