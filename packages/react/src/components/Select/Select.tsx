import { forwardRef, useId, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import * as RS from '@radix-ui/react-select';
import { cx } from '../../cx';
import { useField } from '../FormField';
import styles from './Select.module.css';

// Behaviour (listbox roles, typeahead, Arrow/Home/End, Escape, focus return, scroll into view) is
// Radix's, per the stack rule. This file only adds the Pane look. The list is a real popup drawn
// from tokens, never the operating system's menu.

export interface SelectOption {
  /** Value reported to `onValueChange`. */
  value: string;
  /** Text shown in the list and in the closed control. */
  label: string;
  /** Shown but cannot be chosen. */
  disabled?: boolean;
}

export type SelectSize = 'sm' | 'md';

export interface SelectProps {
  /** Visible label, also the control's accessible name. It is required, because a select without a name is unusable with a screen reader. */
  label: string;
  /** Keep the label for assistive tech but do not show it, when the context already names the control. */
  hideLabel?: boolean;
  /** The choices, in display order. */
  options: SelectOption[];
  /** Controlled value. */
  value?: string;
  /** Starting value when uncontrolled. */
  defaultValue?: string;
  /** Called with the new value when the reader picks an option. */
  onValueChange?: (value: string) => void;
  /** Shown when nothing is selected. */
  placeholder?: string;
  /** `md` is 44px tall for touch; `sm` is 32px for toolbars and dense forms. */
  size?: SelectSize;
  /** Native disabled behaviour. The select cannot take focus or open. */
  disabled?: boolean;
  /** Shows the value without letting it change. It can still be focused and read, and it does not open. */
  readOnly?: boolean;
  /** Marks the value as wrong. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Name for form submission. */
  name?: string;
  /** Extra class on the wrapper. */
  className?: string;
}

// the highlighted row's glint sits under the pointer; keyboard highlight shows the lens without it
const glint = (e: PointerEvent<HTMLDivElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--pane-gx', `${e.clientX - r.left}px`);
};
const Chevron = () => <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.chevron}><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Check = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { label, hideLabel = false, options, value, defaultValue, onValueChange, placeholder, size = 'md', disabled, readOnly, invalid, name, className },
  ref,
) {
  const field = useField();
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  // The list opens in a portal at the end of <body>; it takes the theme of the place the control sits
  // in, so a light region inside a dark page gets a light list.
  const [theme, setTheme] = useState<string | undefined>();
  useLayoutEffect(() => { setTheme((wrap.current?.closest('[data-theme]') as HTMLElement | null)?.dataset.theme); }, []);
  return (
    <div ref={wrap} className={cx(styles.root, className)} data-component="Select">
      <span id={`${id}-label`} className={hideLabel ? styles.hidden : styles.label}>{label}</span>
      <RS.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled ?? field?.disabled} required={field?.required} name={name} {...(readOnly ? { open: false, onOpenChange: () => {} } : {})}>
        <RS.Trigger ref={ref} className={cx(styles.trigger, styles[size])} aria-labelledby={`${id}-label`} aria-readonly={readOnly || undefined} data-readonly={readOnly || undefined} aria-invalid={(invalid ?? field?.invalid) || undefined} aria-describedby={field?.describedBy} aria-required={field?.required || undefined}>
          <RS.Value placeholder={placeholder} />
          <RS.Icon asChild><span className={styles.icon}><Chevron /></span></RS.Icon>
        </RS.Trigger>
        <RS.Portal>
          <RS.Content className={styles.menu} position="popper" sideOffset={6} data-theme={theme}>
            <RS.Viewport className={styles.viewport}>
              {options.map((o) => (
                <RS.Item key={o.value} value={o.value} disabled={o.disabled} className={styles.item} onPointerMove={glint}>
                  <span className={styles.slot}><RS.ItemIndicator className={styles.check}><Check /></RS.ItemIndicator></span>
                  <RS.ItemText>{o.label}</RS.ItemText>
                </RS.Item>
              ))}
            </RS.Viewport>
          </RS.Content>
        </RS.Portal>
      </RS.Root>
    </div>
  );
});
