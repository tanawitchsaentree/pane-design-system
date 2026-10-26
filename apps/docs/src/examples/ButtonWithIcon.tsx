// @example Buttons with a leading icon
import { Button, Card } from 'pane-react';
import { IconShare } from '../icons';

export default function ButtonWithIcon() {
  return (
    <Card as="div" className="demo-card">
      <div className="demo-row">
        <Button variant="glass"><IconShare className="btn-icon" />Share</Button>
        <Button variant="accent"><IconShare className="btn-icon" />Share to story</Button>
      </div>
    </Card>
  );
}
