// @example A favourite toggle with a filled star when on
import { useState } from 'react';
import { IconButton } from 'pane-react';

const Star = ({ filled }: { filled?: boolean }) => <svg viewBox="0 0 24 24" aria-hidden="true" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" /></svg>;

export default function IconButtonToggle() {
  const [on, setOn] = useState(false);
  return <IconButton aria-label="Favourite" pressed={on} pressedIcon={<Star filled />} onClick={() => setOn((v) => !v)}><Star /></IconButton>;
}
