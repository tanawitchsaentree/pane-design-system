// @example Text on an image: scrim on the text side, text kept inside it
import { Card, Tag } from 'pane-react';
import { IconArrow } from '../icons';

export default function TextOnImage() {
  return (
    <Card as="div" className="demo-card">
      <div className="media" data-group="media">
        <Tag className="media-tag">Visual asset 05</Tag>
        <span className="media-num">07</span>
        <span className="media-cap"><IconArrow />Designed for modern visual projects</span>
      </div>
    </Card>
  );
}
