// @example A pager, Previous and Next joined
import { Button, ButtonGroup } from 'pane-react';

export default function ButtonGroupPager() {
  return <ButtonGroup label="Pages" attached><Button variant="glass">Previous</Button><Button variant="glass">Next</Button></ButtonGroup>;
}
