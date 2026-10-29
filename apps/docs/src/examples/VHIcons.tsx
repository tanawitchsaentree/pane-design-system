// @example A word for an icon that has none
import { Card, Flex, VisuallyHidden } from 'pane-react';
import { IconPin } from '../icons';

export default function VHIcons() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="sm"><IconPin aria-hidden="true" /><VisuallyHidden>Location:</VisuallyHidden><span>Bergen</span></Flex>
    </Card>
  );
}
