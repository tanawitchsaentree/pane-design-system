// @example Actions that belong together, apart at the small gap
import { Button, ButtonGroup } from 'pane-react';

export default function ButtonGroupSpaced() {
  return <ButtonGroup label="Order actions"><Button variant="glass">Print label</Button><Button variant="glass">Refund</Button><Button>Mark as sent</Button></ButtonGroup>;
}
