// @example Below its control
import { IconButton, Tooltip } from 'pane-react';
import { IconHeart } from '../icons';

export default function TooltipSide() {
  return <Tooltip side="bottom" content="Like"><IconButton aria-label="Like" variant="glass"><IconHeart /></IconButton></Tooltip>;
}
