// @example An icon button on a cover photo
import { Card, CardCover, IconButton } from 'pane-react';
import { IconPencil } from '../icons';

export default function IconButtonOnCover() {
  return (
    <Card aria-label="Cover with edit action" className="demo-card">
      <div className="cover-wrap">
        <CardCover src="/scenes/room-sm.jpg" />
        <IconButton aria-label="Change cover" className="cover-action"><IconPencil /></IconButton>
      </div>
      <p className="flush muted">The disc sits on the photo, away from the text.</p>
    </Card>
  );
}
