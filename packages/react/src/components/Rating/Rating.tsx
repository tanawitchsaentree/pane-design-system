import { forwardRef, useState } from 'react';
import * as RR from '@radix-ui/react-radio-group';
import { cx } from '../../cx';
import styles from './Rating.module.css';
import { useMessages } from '../../i18n/context';

export interface RatingProps {
  /** What is being rated, the group's accessible name: Rate this print. */
  label: string;
  /** The rating, 1 to `max`. */
  value?: number;
  /** The starting value when uncontrolled. */
  defaultValue?: number;
  /** Called when the value changes. */
  onValueChange?: (value: number) => void;
  /** How many stars. Defaults to 5. */
  max?: number;
  /** Shows a rating without letting the reader change it, read as "4 out of 5". */
  readOnly?: boolean;
  /** Extra class on the root. */
  className?: string;
  /** Turns the whole control off, so it cannot be focused or changed and reads as dimmed. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
}

const Star = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6l2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.6l-5.2 2.9 1.2-5.8-4.4-4 5.9-.7z" /></svg>;

/** A score from one to five stars. Chosen stars are the loud solid, the rest an etched outline, so the
 *  score reads by shape and count, never by a hue (P1, P6). Arrow keys change it. */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating({ label, value, defaultValue, onValueChange, max = 5, readOnly, disabled, className }, ref) {
  const t = useMessages();
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const [inner, setInner] = useState(defaultValue ?? 0);
  const current = value ?? inner;
  const set = (n: number) => { if (value === undefined) setInner(n); if (n !== current) onValueChange?.(n); };
  if (readOnly) {
    const v = current;
    return <div ref={ref} data-component="Rating" role="img" aria-label={t.ratingScore(label, v, max)} className={cx(styles.root, styles.readOnly, className)}>{stars.map((n) => <span key={n} className={cx(styles.star, n <= v && styles.on)}><Star /></span>)}</div>;
  }
  return (
    <RR.Root ref={ref} data-component="Rating" aria-label={label} disabled={disabled} orientation="horizontal" loop={false} value={current ? String(current) : ''}
      onValueChange={(v) => set(Number(v))} className={cx(styles.root, className)}
      // the roving focus moves the focus star; the score follows it here, so an arrow always changes the score
      onKeyDown={(e) => {
        if (disabled) return;
        const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
        const step = { ArrowUp: 1, ArrowDown: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
        if (step) set(Math.min(max, Math.max(1, (current || 0) + step)));
      }}>
      {stars.map((n) => (
        <RR.Item key={n} value={String(n)} aria-label={t.ratingStar(n, max)} className={cx(styles.item, styles.star)} data-on={n <= current || undefined}><Star /></RR.Item>
      ))}
    </RR.Root>
  );
});
