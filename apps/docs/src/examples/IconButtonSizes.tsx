// @example Sizes — 36px disc, 32px for rows
import { Card, IconButton } from 'pane-react';
import { IconPencil } from '../icons';

export default function IconButtonSizes() {
  return (
    <Card as="div" className="demo-card">
      <div className="demo-row">
        <IconButton aria-label="Edit (medium)"><IconPencil /></IconButton>
        <IconButton size="sm" aria-label="Edit (small)"><IconPencil /></IconButton>
      </div>
    </Card>
  );
}
