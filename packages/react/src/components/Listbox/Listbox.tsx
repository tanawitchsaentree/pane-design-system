import { forwardRef, useId, useState } from 'react';
import { cx } from '../../cx';
import { useField } from '../FormField';
import { useListNav } from './useListNav';
import styles from './Listbox.module.css';

export interface ListboxOption {
  value: string;
  label: string;
  /** A second line under the label. */
  description?: string;
  disabled?: boolean;
}

export interface ListboxProps {
  /** The list's name, shown above it and used as its accessible name. */
  label: string;
  /** The options, in the order they are shown. */
  options: ListboxOption[];
  /** One value, or several when `multiple`. */
  value?: string | string[];
  /** The starting value when uncontrolled. */
  defaultValue?: string | string[];
  /** Called when the value changes. */
  onValueChange?: (value: string | string[]) => void;
  /** Lets the reader choose more than one; each chosen row carries a check. */
  multiple?: boolean;
  /** Extra class on the root. */
  className?: string;
  /** Marks the answer as wrong with a critical ring and aria-invalid. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Turns the whole control off, so it cannot be focused or changed and reads as dimmed. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
}

const Check = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;

/** A list that stays on the page, for choosing one or several options when they should all be visible:
 *  rows in a recess, the chosen one a lighter pane with a check. Arrow keys move, Space or Enter choose. */
export const Listbox = forwardRef<HTMLDivElement, ListboxProps>(function Listbox({ label, options, value, defaultValue, onValueChange, multiple, className, invalid, disabled }, ref) {
  const id = useId();
  const field = useField();
  const off = disabled ?? field?.disabled ?? false;
  const bad = invalid ?? field?.invalid ?? false;
  const [inner, setInner] = useState<string[]>(() => [].concat((defaultValue ?? []) as never));
  const chosen: string[] = value !== undefined ? [].concat(value as never) : inner;
  const nav = useListNav(options.length, options.map((o) => o.label), (i) => !!options[i].disabled);
  const choose = (v: string) => {
    if (off) return;
    const next = multiple ? (chosen.includes(v) ? chosen.filter((x) => x !== v) : [...chosen, v]) : [v];
    if (value === undefined) setInner(next);
    onValueChange?.(multiple ? next : next[0]);
  };
  const activeId = nav.active >= 0 ? `${id}-${nav.active}` : undefined;
  return (
    <div ref={ref} data-component="Listbox" className={cx(styles.root, className)}>
      <span id={`${id}-label`} className={styles.label}>{label}</span>
      <div role="listbox" tabIndex={off ? -1 : 0} aria-disabled={off || undefined} aria-invalid={bad || undefined} aria-describedby={field?.describedBy} aria-labelledby={`${id}-label`} aria-multiselectable={multiple || undefined} aria-activedescendant={activeId} className={styles.list}
        onFocus={() => { if (nav.active < 0) nav.setActive(Math.max(0, options.findIndex((o) => chosen.includes(o.value)))); }}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && nav.active >= 0) { e.preventDefault(); choose(options[nav.active].value); return; }
          if (nav.onKey(e, e.key !== ' ')) e.preventDefault();
        }}>
        {options.map((o, i) => (
          <div key={o.value} id={`${id}-${i}`} role="option" aria-selected={chosen.includes(o.value)} aria-disabled={o.disabled || undefined}
            className={cx(styles.option, i === nav.active && styles.active)} onPointerDown={(e) => e.preventDefault()} onClick={() => { if (!o.disabled) { nav.setActive(i); choose(o.value); } }}>
            <span className={styles.check} aria-hidden="true">{chosen.includes(o.value) && <Check />}</span>
            <span className={styles.text}><span className={styles.optionLabel}>{o.label}</span>{o.description && <span className={styles.description}>{o.description}</span>}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
