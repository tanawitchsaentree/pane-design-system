// @example A stack of participants with a count
import { Avatar, Card } from 'pane-react';

const PEOPLE = ['Ada Lovelace', 'Grace Hopper', 'Alan Kay', 'Max Fmz'];

export default function AvatarGroup() {
  return (
    <Card as="div" className="demo-card">
      <div className="avatar-stack" role="group" aria-label={`${PEOPLE.length} people going: ${PEOPLE.join(', ')}`}>
        {PEOPLE.map((p) => <Avatar key={p} name={p} size="md" decorative />)}
      </div>
      <p className="flush muted">{PEOPLE.length} people going</p>
    </Card>
  );
}
