import { forwardRef, useState } from 'react';
import * as RR from '@radix-ui/react-radio-group';
import { cx } from '../../cx';
import styles from './Rating.module.css';

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
}

const Star = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6l2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.6l-5.2 2.9 1.2-5.8-4.4-4 5.9-.7z" /></svg>;

/** A score from one to five stars. Chosen stars are the loud solid, the rest an etched outline, so the
 *  score reads by shape and count, never by a hue (P1, P6). Arrow keys change it. */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating({ label, value, defaultValue, onValueChange, max = 5, readOnly, className }, ref) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const [inner, setInner] = useState(defaultValue ?? 0);
  const current = value ?? inner;
  if (readOnly) {
    const v = current;
    return <div ref={ref} data-component="Rating" role="img" aria-label={`${label}: ${v} out of ${max}`} className={cx(styles.root, styles.readOnly, className)}>{stars.map((n) => <span key={n} className={cx(styles.star, n <= v && styles.on)}><Star /></span>)}</div>;
  }
  return (
    <RR.Root ref={ref} data-component="Rating" aria-label={label} orientation="horizontal" value={current ? String(current) : ''}
      onValueChange={(v) => { if (value === undefined) setInner(Number(v)); onValueChange?.(Number(v)); }} className={cx(styles.root, className)}>
      {stars.map((n) => (
        <RR.Item key={n} value={String(n)} aria-label={`${n} out of ${max}`} className={cx(styles.item, styles.star)} data-on={n <= current || undefined}><Star /></RR.Item>
      ))}
    </RR.Root>
  );
});
