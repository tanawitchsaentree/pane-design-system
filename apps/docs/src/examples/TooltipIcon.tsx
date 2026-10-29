// @example A name for an icon button
import { IconButton, Tooltip } from 'pane-react';
import { IconShare } from '../icons';

export default function TooltipIcon() {
  return <Tooltip content="Share"><IconButton aria-label="Share" variant="glass"><IconShare /></IconButton></Tooltip>;
}
