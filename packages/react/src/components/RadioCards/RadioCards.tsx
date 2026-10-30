import { forwardRef, type ReactNode } from 'react';
import * as RR from '@radix-ui/react-radio-group';
import { cx } from '../../cx';
import { useField } from '../FormField';
import styles from './RadioCards.module.css';

export interface RadioCardOption {
  value: string;
  title: string;
  /** A line or two that helps the reader choose: the price, the time, what is included. */
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioCardsProps {
  /** The question the cards answer, the group's accessible name. */
  label: string;
  /** The options, in the order they are shown. */
  options: RadioCardOption[];
  /** The controlled value. */
  value?: string;
  /** The starting value when uncontrolled. */
  defaultValue?: string;
  /** Called when the value changes. */
  onValueChange?: (value: string) => void;
  /** Cards per row on a wide screen. Defaults to as many as fit at 200px. */
  columns?: 2 | 3;
  /** Extra class on the root. */
  className?: string;
  /** Marks the answer as wrong with a critical ring and aria-invalid. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Turns the whole control off, so it cannot be focused or changed and reads as dimmed. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
}

/** One choice from a few options that each need a sentence, such as a plan or a delivery speed: radio
 *  buttons drawn as small panes, the chosen one a lighter pane with a check (P6: a mark, never only colour). */
export const RadioCards = forwardRef<HTMLDivElement, RadioCardsProps>(function RadioCards({ label, options, value, defaultValue, onValueChange, columns, className, invalid, disabled }, ref) {
  const field = useField();
  const bad = invalid ?? field?.invalid ?? false;
  return (
    <div ref={ref} data-component="RadioCards" className={cx(styles.root, className)}>
      <span className={styles.legend} id={`rc-${label.replace(/\W+/g, '-')}`}>{label}</span>
      <RR.Root aria-labelledby={`rc-${label.replace(/\W+/g, '-')}`} value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled ?? field?.disabled} aria-invalid={bad || undefined} className={cx(styles.grid, columns && styles[`c${columns}`])}>
        {options.map((o) => (
          <RR.Item key={o.value} value={o.value} disabled={o.disabled} className={styles.card}>
            <span className={styles.head}><span className={styles.title}>{o.title}</span><span className={styles.mark} aria-hidden="true"><RR.Indicator className={styles.check}><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></RR.Indicator></span></span>
            {o.description != null && <span className={styles.description}>{o.description}</span>}
          </RR.Item>
        ))}
      </RR.Root>
    </div>
  );
});
