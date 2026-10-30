import { forwardRef, useState } from 'react';
import { cx } from '../../cx';
import { Listbox, type ListboxOption } from '../Listbox';
import { Button } from '../Button';
import styles from './TransferList.module.css';
import { useMessages } from '../../i18n/context';

export interface TransferListProps {
  /** Everything that can be chosen. */
  options: ListboxOption[];
  /** The values on the chosen side, when you keep them yourself. */
  value?: string[];
  /** The values on the chosen side at the start. */
  defaultValue?: string[];
  /** Called with the chosen values, in the order of `options`, after each move. */
  onValueChange?: (value: string[]) => void;
  /** Names the two lists, such as Available and Shown on the card. */
  labels?: [string, string];
  /** Extra class on the wrapper. */
  className?: string;
}

/** Two Listboxes side by side with move buttons between them, for choosing a set from a long list and
 *  seeing both what is in and what is out, such as the columns of a table. The buttons say how many they
 *  will move; on a narrow pane the lists stack and the buttons sit between them. */
export const TransferList = forwardRef<HTMLDivElement, TransferListProps>(function TransferList({ options, value, defaultValue, onValueChange, labels: labelsIn, className }, ref) {
  const t = useMessages();
  const labels = labelsIn ?? [t.available, t.chosen];
  const [inner, setInner] = useState<string[]>(defaultValue ?? []);
  const chosen = value ?? inner;
  const [left, setLeft] = useState<string[]>([]);
  const [right, setRight] = useState<string[]>([]);
  const set = (next: string[]) => { const ordered = options.map((o) => o.value).filter((v) => next.includes(v)); if (value === undefined) setInner(ordered); onValueChange?.(ordered); };
  const out = options.filter((o) => !chosen.includes(o.value));
  const inn = options.filter((o) => chosen.includes(o.value));
  return (
    <div ref={ref} data-component="TransferList" className={cx(styles.root, className)}>
      <div className={styles.grid}>
      <Listbox label={`${labels[0]}, ${out.length}`} options={out} multiple value={left} onValueChange={(v) => setLeft(v as string[])} className={styles.list} />
      <div className={styles.moves}>
        <Button variant="glass" size="sm" disabled={!left.length} onClick={() => { set([...chosen, ...left]); setLeft([]); }}>
          {t.add}{left.length ? ` ${left.length}` : ''}<svg viewBox="0 0 24 24" aria-hidden="true" className={cx(styles.glyph, styles.fwd)}><path d="M9.5 6l6 6-6 6" /></svg>
        </Button>
        <Button variant="glass" size="sm" disabled={!right.length} onClick={() => { set(chosen.filter((v) => !right.includes(v))); setRight([]); }}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={cx(styles.glyph, styles.back)}><path d="M14.5 6 8.5 12l6 6" /></svg>{t.remove}{right.length ? ` ${right.length}` : ''}
        </Button>
      </div>
      <Listbox label={`${labels[1]}, ${inn.length}`} options={inn} multiple value={right} onValueChange={(v) => setRight(v as string[])} className={styles.list} />
      </div>
    </div>
  );
});
