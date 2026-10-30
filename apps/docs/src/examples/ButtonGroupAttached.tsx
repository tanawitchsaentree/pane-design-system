// @example Bold, Italic and Underline joined into one piece
import { useState } from 'react';
import { Button, ButtonGroup } from 'pane-react';

export default function ButtonGroupAttached() {
  const [on, setOn] = useState<string[]>(['Bold']);
  const flip = (k: string) => setOn((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  return <ButtonGroup label="Text style" attached>{['Bold', 'Italic', 'Underline'].map((k) => <Button key={k} variant="glass" size="sm" pressed={on.includes(k)} onClick={() => flip(k)}>{k}</Button>)}</ButtonGroup>;
}
