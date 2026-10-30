// @example Names for a row of icons
import { Flex, IconButton, Tooltip } from 'pane-react';
import { IconHeart, IconReply, IconShare } from '../icons';

export default function TooltipRow() {
  return (
    <Flex gap="sm">
      <Tooltip content="Reply"><IconButton aria-label="Reply" variant="ghost"><IconReply /></IconButton></Tooltip>
      <Tooltip content="Like"><IconButton aria-label="Like" variant="ghost"><IconHeart /></IconButton></Tooltip>
      <Tooltip content="Share"><IconButton aria-label="Share" variant="ghost"><IconShare /></IconButton></Tooltip>
    </Flex>
  );
}
