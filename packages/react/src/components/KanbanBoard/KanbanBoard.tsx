import { forwardRef, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './KanbanBoard.module.css';
import { useMessages } from '../../i18n/context';

export interface KanbanCard { id: string; title: string; meta?: ReactNode }
export interface KanbanColumn { id: string; title: string; cards: KanbanCard[] }

export interface KanbanBoardProps {
  /** Names the board, such as Print orders. */
  label: string;
  /** The columns, in order, each with its cards in order. */
  columns: KanbanColumn[];
  /** Called with the new columns after every move, by drag or by keyboard. */
  onChange: (columns: KanbanColumn[]) => void;
  /** Extra class on the board. */
  className?: string;
}

type Pick = { card: string; from: string } | null;

/** Columns of cards that move by drag and by keyboard alike: Space picks a card up, arrow keys carry it
 *  within and across columns, Space drops it and Esc puts it back. Every move is said aloud. A lifted card
 *  rises a little, as an object picked up (P4), and its gap stays open where it will land. */
export const KanbanBoard = forwardRef<HTMLDivElement, KanbanBoardProps>(function KanbanBoard({ label, columns, onChange, className }, ref) {
  const t = useMessages();
  const uid = useId();
  const [held, setHeld] = useState<Pick>(null);
  const [before, setBefore] = useState<KanbanColumn[] | null>(null);
  const [say, setSay] = useState('');
  const [over, setOver] = useState<string | null>(null);
  const where = (cols: KanbanColumn[], id: string) => { const c = cols.findIndex((col) => col.cards.some((x) => x.id === id)); return { c, i: c < 0 ? -1 : cols[c].cards.findIndex((x) => x.id === id) }; };
  const move = (cols: KanbanColumn[], id: string, toCol: number, toIdx: number) => {
    const { c, i } = where(cols, id); if (c < 0) return cols;
    const next = cols.map((col) => ({ ...col, cards: [...col.cards] }));
    const [card] = next[c].cards.splice(i, 1);
    next[toCol].cards.splice(Math.max(0, Math.min(toIdx, next[toCol].cards.length)), 0, card);
    return next;
  };
  // scoped to this board, so two boards with the same card ids never take each other's focus
  const box = useRef<HTMLDivElement | null>(null);
  const focusCard = (id: string) => requestAnimationFrame(() => box.current?.querySelector<HTMLElement>(`[data-card="${CSS.escape(id)}"]`)?.focus());
  const key = (e: KeyboardEvent, card: KanbanCard) => {
    const { c, i } = where(columns, card.id);
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!held) { setHeld({ card: card.id, from: columns[c].id }); setBefore(columns); setSay(t.kanbanPicked(card.title, columns[c].title, i + 1, columns[c].cards.length)); }
      else { setHeld(null); setBefore(null); setSay(t.kanbanDropped(card.title, columns[c].title, i + 1, columns[c].cards.length)); }
      return;
    }
    if (e.key === 'Escape' && held && before) { e.preventDefault(); onChange(before); setHeld(null); setBefore(null); setSay(t.kanbanCancelled(card.title)); focusCard(card.id); return; }
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const d: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [rtl ? 1 : -1, 0], ArrowRight: [rtl ? -1 : 1, 0] };
    if (!d[e.key]) return;
    e.preventDefault();
    const [dc, di] = d[e.key];
    if (held) {
      const tc = Math.max(0, Math.min(columns.length - 1, c + dc)); const ti = dc ? Math.min(i, columns[tc].cards.length) : i + di;
      if (tc === c && (ti < 0 || ti >= columns[c].cards.length)) return;
      const next = move(columns, card.id, tc, ti); onChange(next);
      const pos = where(next, card.id); setSay(t.kanbanMoved(columns[tc].title, pos.i + 1, next[tc].cards.length)); focusCard(card.id);
    } else {
      const tc = Math.max(0, Math.min(columns.length - 1, c + dc)); const target = columns[tc].cards[dc ? Math.min(i, columns[tc].cards.length - 1) : i + di];
      if (target) focusCard(target.id);
    }
  };
  return (
    <div ref={(el) => { box.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }} data-component="KanbanBoard" role="region" aria-label={label} className={cx(styles.root, className)}>
      <p className={styles.hint} id={`${uid}-hint`}>{t.kanbanHint}</p>
      <div className={styles.columns} role="group" tabIndex={0} aria-label={t.columns(label)}>
        {columns.map((col, ci) => (
          <section key={col.id} aria-labelledby={`${uid}-${ci}`} className={cx(styles.column, over === col.id && styles.over)}
            onDragOver={(e) => { e.preventDefault(); setOver(col.id); }} onDragLeave={() => setOver(null)}
            onDrop={(e) => { e.preventDefault(); setOver(null); const id = e.dataTransfer.getData('text/plain'); if (id) onChange(move(columns, id, ci, col.cards.length)); }}>
            <h3 id={`${uid}-${ci}`} className={styles.title}>{col.title}<span className={styles.count}>{col.cards.length}</span></h3>
            <ul className={styles.list}>
              {col.cards.map((card, i) => (
                <li key={card.id}>
                <div data-card={card.id} role="button" tabIndex={0} draggable aria-describedby={`${uid}-hint`} aria-roledescription={t.draggableCard} aria-pressed={held?.card === card.id}
                  className={cx(styles.card, held?.card === card.id && styles.held)}
                  onKeyDown={(e) => key(e, card)} onDragStart={(e) => { e.dataTransfer.setData('text/plain', card.id); e.dataTransfer.effectAllowed = 'move'; }}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setOver(null); const id = e.dataTransfer.getData('text/plain'); if (id && id !== card.id) onChange(move(columns, id, ci, i)); }}>
                  <span className={styles.cardTitle}>{card.title}</span>
                  {card.meta && <span className={styles.meta}>{card.meta}</span>}
                </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className={styles.live} aria-live="assertive">{say}</p>
    </div>
  );
});
