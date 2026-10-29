// @example A skip link that appears on focus
import { Card, VisuallyHidden } from 'pane-react';

export default function VHSkip() {
  return (
    <Card as="div" className="demo-card">
      <VisuallyHidden focusable><a href="#vh-main" className="demo-skip">Skip to the photos</a></VisuallyHidden>
      <p className="flush">Press Tab here: the skip link shows itself while it has focus.</p>
      <p className="flush" id="vh-main">Photos</p>
    </Card>
  );
}
