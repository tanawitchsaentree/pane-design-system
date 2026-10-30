import { forwardRef, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../cx';
import { IconButton } from '../IconButton';
import { addDays, addMonths, before, day, iso, monthGrid, same, type DateRange } from './dates';
import styles from './Calendar.module.css';
import { useMessages, useLocale } from '../../i18n/context';

interface Base {
  /** The month shown first; the month of the value, or this month, by default. */
  defaultMonth?: Date;
  /** The earliest day that can be chosen. */
  min?: Date;
  /** The latest day that can be chosen. */
  max?: Date;
  /** Days that cannot be chosen, such as a fully booked day; they stay visible and are read as unavailable. */
  isUnavailable?: (date: Date) => boolean;
  /** A BCP 47 locale for month and weekday names, such as nb-NO; the browser's own by default. */
  locale?: string;
  /** The first day of the week, 0 for Sunday to 6 for Saturday; 1, Monday, by default. */
  weekStartsOn?: number;
  /** Names the calendar for screen readers, such as Check-in date. */
  label?: string;
  /** Extra class on the wrapper. */
  className?: string;
}
export interface CalendarSingleProps extends Base {
  /** `single` (default) chooses one day. */
  mode?: 'single';
  /** The chosen day, when you keep it yourself. */
  value?: Date | null;
  /** The day it starts with. */
  defaultValue?: Date | null;
  /** Called with the day the reader chooses. */
  onValueChange?: (value: Date) => void;
}
export interface CalendarRangeProps extends Base {
  /** `range` chooses a first and a last day; the first press sets the start and the second the end. */
  mode: 'range';
  /** The chosen range, when you keep it yourself. */
  value?: DateRange;
  /** The range it starts with. */
  defaultValue?: DateRange;
  /** Called with the range after each press; `end` is null until the second day is chosen. */
  onValueChange?: (value: DateRange) => void;
}
export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/** A month of days in a real grid. Arrow keys move a day or a week, Page Up and Page Down a month, Home and
 *  End the week's ends, Enter or Space chooses. Today is ringed, the chosen day is the loud solid and a
 *  range is chosen glass between its two solid ends, so each state reads by shape (P6). */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(props, ref) {
  const t = useMessages();
  const { min, max, isUnavailable, weekStartsOn = 1, label, className } = props;
  const locale = props.locale ?? useLocale();
  const range = props.mode === 'range';
  const [innerSingle, setSingle] = useState<Date | null>(!range ? (props as CalendarSingleProps).defaultValue ?? null : null);
  const [innerRange, setRange] = useState<DateRange>(range ? (props as CalendarRangeProps).defaultValue ?? { start: null, end: null } : { start: null, end: null });
  const single = !range ? ((props as CalendarSingleProps).value !== undefined ? (props as CalendarSingleProps).value ?? null : innerSingle) : null;
  const span = range ? (props as CalendarRangeProps).value ?? innerRange : null;
  const anchor = single ?? span?.start ?? null;
  const today = day(new Date());
  const [month, setMonth] = useState(() => day(props.defaultMonth ?? anchor ?? today));
  const [focus, setFocus] = useState(() => anchor ?? today);
  const [hover, setHover] = useState<Date | null>(null);
  const grid = useMemo(() => monthGrid(month, weekStartsOn), [month, weekStartsOn]);
  const cells = useRef(new Map<string, HTMLButtonElement>());
  const moved = useRef(false);
  useEffect(() => { if (moved.current) { cells.current.get(iso(focus))?.focus(); moved.current = false; } }, [focus, month]);
  const off = (d: Date) => (min && before(d, min)) || (max && before(max, d)) || !!isUnavailable?.(d);
  const go = (d: Date) => { moved.current = true; setFocus(d); if (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear()) setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); };
  const choose = (d: Date) => {
    if (off(d)) return;
    if (!range) { const p = props as CalendarSingleProps; if (p.value === undefined) setSingle(d); p.onValueChange?.(d); return; }
    const p = props as CalendarRangeProps; const cur = span!;
    const next: DateRange = !cur.start || cur.end ? { start: d, end: null } : before(d, cur.start) ? { start: d, end: cur.start } : { start: cur.start, end: d };
    if (p.value === undefined) setRange(next); p.onValueChange?.(next);
  };
  const key = (e: KeyboardEvent) => {
    const m: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focus, -1), ArrowRight: () => addDays(focus, 1), ArrowUp: () => addDays(focus, -7), ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, e.shiftKey ? -12 : -1), PageDown: () => addMonths(focus, e.shiftKey ? 12 : 1),
      Home: () => addDays(focus, -((focus.getDay() - weekStartsOn + 7) % 7)), End: () => addDays(focus, 6 - ((focus.getDay() - weekStartsOn + 7) % 7)),
    };
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const k = rtl && e.key === 'ArrowLeft' ? 'ArrowRight' : rtl && e.key === 'ArrowRight' ? 'ArrowLeft' : e.key;
    if (m[k]) { e.preventDefault(); go(m[k]()); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(focus); }
  };
  const title = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month);
  const wd = new Intl.DateTimeFormat(locale, { weekday: 'short' }); const wdLong = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  const full = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const end = span?.end ?? (span?.start && hover && !before(hover, span.start) ? hover : null);
  const inSpan = (d: Date) => !!span?.start && !!end && !before(d, span.start) && !before(end, d);
  const shift = (n: number) => { const t = addMonths(month, n); setMonth(t); setFocus(addMonths(focus, n)); };
  return (
    <div ref={ref} data-component="Calendar" className={cx(styles.root, className)}>
      <div className={styles.head}>
        <IconButton variant="ghost" aria-label={t.previousMonth} onClick={() => shift(-1)}><svg viewBox="0 0 24 24" aria-hidden="true" className={styles.chev}><path d="M14.5 6 8.5 12l6 6" /></svg></IconButton>
        <h2 className={styles.title} aria-live="polite">{title}</h2>
        <IconButton variant="ghost" aria-label={t.nextMonth} onClick={() => shift(1)}><svg viewBox="0 0 24 24" aria-hidden="true" className={styles.chev}><path d="M9.5 6l6 6-6 6" /></svg></IconButton>
      </div>
      <table role="grid" aria-label={label ? `${label}, ${title}` : title} className={styles.grid} onKeyDown={key}>
        <thead><tr>{grid[0].map((d) => <th key={d.getDay()} scope="col" abbr={wdLong.format(d)} className={styles.wd}>{wd.format(d)}</th>)}</tr></thead>
        <tbody>
          {grid.map((w, i) => (
            <tr key={i}>
              {w.map((d) => {
                const out = d.getMonth() !== month.getMonth();
                const chosen = same(d, single) || same(d, span?.start) || same(d, span?.end);
                const mid = inSpan(d) && !chosen;
                return (
                  <td key={iso(d)} role="gridcell" aria-selected={chosen || mid || undefined} className={cx(styles.cell, mid && styles.mid, same(d, span?.start) && end && styles.start, same(d, end) && span?.start && styles.end)}>
                    <button ref={(el) => { if (el) cells.current.set(iso(d), el); else cells.current.delete(iso(d)); }} type="button" tabIndex={same(d, focus) ? 0 : -1}
                      aria-label={full.format(d)} aria-current={same(d, today) ? 'date' : undefined} aria-disabled={off(d) || undefined}
                      className={cx(styles.day, out && styles.out, chosen && styles.chosen, same(d, today) && styles.today, off(d) && styles.off)}
                      onClick={() => { go(d); choose(d); }} onPointerEnter={() => range && setHover(d)} onFocus={() => range && setHover(d)}>
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
