// @example A toggle that stays on, such as Bold
import { useState } from 'react';
import { Button } from 'pane-react';

export default function ButtonToggle() {
  const [bold, setBold] = useState(true);
  return <Button variant="glass" pressed={bold} onClick={() => setBold((b) => !b)}>Bold</Button>;
}
