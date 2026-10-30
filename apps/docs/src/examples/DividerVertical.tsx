// @example Between items in a row
import { Card, Divider, Flex, IconButton } from 'pane-react';
import { IconHeart, IconReply, IconShare } from '../icons';

export default function DividerVertical() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="sm">
        <IconButton aria-label="Reply" variant="ghost" size="sm"><IconReply /></IconButton>
        <IconButton aria-label="Like" variant="ghost" size="sm"><IconHeart /></IconButton>
        <Divider orientation="vertical" />
        <IconButton aria-label="Share" variant="ghost" size="sm"><IconShare /></IconButton>
      </Flex>
    </Card>
  );
}
