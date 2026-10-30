// @example A tooltip drawn in place
import { IconButton, Tooltip } from 'pane-react';
import { IconShare } from '../icons';

export default function TooltipPreview() {
  return <Tooltip preview content="Share"><IconButton aria-label="Share" variant="glass"><IconShare /></IconButton></Tooltip>;
}
