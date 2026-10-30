// @example Stacked, for a side toolbar
import { Button, ButtonGroup } from 'pane-react';

export default function ButtonGroupVertical() {
  return <ButtonGroup label="Zoom" attached orientation="vertical"><Button variant="glass" size="sm">Zoom in</Button><Button variant="glass" size="sm">Fit</Button><Button variant="glass" size="sm">Zoom out</Button></ButtonGroup>;
}
