import { useCallback, useRef, useState } from 'react';

/** Keyboard movement through a list of options, shared by Listbox, Combobox, Autocomplete and MultiSelect:
 *  Up and Down move, Home and End jump, typing a letter jumps to the next option that starts with it. */
export function useListNav(count: number, labels: string[], disabled: (i: number) => boolean) {
  const [active, setActive] = useState(-1);
  const typed = useRef({ text: '', at: 0 });
  const step = useCallback((from: number, dir: 1 | -1) => {
    if (!count) return -1;
    for (let n = 1; n <= count; n++) { const i = (from + dir * n + count) % count; if (!disabled(i)) return i; }
    return from;
  }, [count, disabled]);
  const onKey = useCallback((e: React.KeyboardEvent, typeahead = true): boolean => {
    if (e.key === 'ArrowDown') { setActive((a) => step(a < 0 ? -1 : a, 1)); return true; }
    if (e.key === 'ArrowUp') { setActive((a) => step(a < 0 ? 0 : a, -1)); return true; }
    if (e.key === 'Home') { setActive(step(-1, 1)); return true; }
    if (e.key === 'End') { setActive(step(0, -1)); return true; }
    if (typeahead && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const now = Date.now(); typed.current = { text: now - typed.current.at < 600 ? typed.current.text + e.key.toLowerCase() : e.key.toLowerCase(), at: now };
      const hit = labels.findIndex((l, i) => !disabled(i) && l.toLowerCase().startsWith(typed.current.text));
      if (hit >= 0) setActive(hit);
      return hit >= 0;
    }
    return false;
  }, [labels, disabled, step]);
  return { active, setActive, onKey };
}
