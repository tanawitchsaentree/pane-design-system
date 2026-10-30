import { forwardRef, useState, type KeyboardEvent } from 'react';
import { Input, type InputProps } from '../Input';
import { InputGroup } from '../InputGroup';
import { IconButton } from '../IconButton';
import { useField } from '../FormField';
import styles from './NumberInput.module.css';
import { useMessages } from '../../i18n/context';

export interface NumberInputProps extends Omit<InputProps, 'type' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'> {
  /** The number, when you keep it yourself; `null` is an empty field. */
  value?: number | null;
  /** The number it starts with. */
  defaultValue?: number | null;
  /** Called with the new number after a step, or after typing once the field is left; `null` when it is emptied. */
  onValueChange?: (value: number | null) => void;
  /** The smallest number allowed; typing below it is raised to it when the field is left. */
  min?: number;
  /** The largest number allowed; typing above it is lowered to it when the field is left. */
  max?: number;
  /** How much one press of a stepper button or an arrow key changes the number; 1 by default. Page Up and Page Down move ten steps. */
  step?: number;
  /** A unit shown at the end of the field and read with the number, such as kg or prints. */
  unit?: string;
  /** Names the field for the stepper buttons, such as Quantity, so they read Decrease quantity and Increase quantity. */
  label: string;
}

const clampTo = (n: number, min?: number, max?: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));

/** A number field with a minus and a plus beside it, inside one groove. It is a spinbutton: arrow keys
 *  step, Page Up and Page Down jump ten steps, Home and End go to the limits, and a typed number is held
 *  to the limits when the field is left. The steppers keep 44px press areas. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput({ value, defaultValue, onValueChange, min, max, step = 1, unit, label, className, onKeyDown, onBlur, disabled, ...rest }, ref) {
  const t = useMessages();
  const [inner, setInner] = useState<number | null>(defaultValue ?? null);
  const current = value !== undefined ? value : inner;
  const [draft, setDraft] = useState<string | null>(null);
  const commit = (n: number | null) => {
    const next = n === null ? null : clampTo(Math.round(n / step) * step, min, max);
    const tidy = next === null ? null : Number(next.toFixed(10));
    if (value === undefined) setInner(tidy);
    if (tidy !== current) onValueChange?.(tidy);
    setDraft(null);
  };
  const by = (k: number) => commit((current ?? min ?? 0) + k * step);
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    const moves: Record<string, () => void> = { ArrowUp: () => by(1), ArrowDown: () => by(-1), PageUp: () => by(10), PageDown: () => by(-10), Home: () => min !== undefined && commit(min), End: () => max !== undefined && commit(max) };
    if (moves[e.key]) { e.preventDefault(); moves[e.key](); }
    if (e.key === 'Enter' && draft !== null) commit(draft.trim() === '' ? null : Number(draft));
    onKeyDown?.(e);
  };
  const atMin = min !== undefined && current !== null && current <= min;
  const atMax = max !== undefined && current !== null && current >= max;
  const lower = label.toLowerCase();
  // inside a FormField the visible label names the field; on its own, `label` does
  const field = useField();
  const off = disabled ?? field?.disabled ?? false;
  return (
    <InputGroup data-component="NumberInput" className={className}
      start={<IconButton variant="ghost" aria-label={t.decrease(lower)} tabIndex={-1} disabled={off || atMin} onClick={() => by(-1)}><svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><path d="M6 12h12" /></svg></IconButton>}
      end={<span className={styles.end}>{unit && <span className={styles.unit} aria-hidden="true">{unit}</span>}<IconButton variant="ghost" aria-label={t.increase(lower)} tabIndex={-1} disabled={off || atMax} onClick={() => by(1)}><svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><path d="M6 12h12M12 6v12" /></svg></IconButton></span>}>
      <Input ref={ref} type="text" inputMode={step % 1 === 0 && (min ?? 0) >= 0 ? 'numeric' : 'decimal'} role="spinbutton" disabled={off} aria-label={rest['aria-label'] ?? (field ? undefined : label)}
        aria-valuenow={current ?? undefined} aria-valuemin={min} aria-valuemax={max} aria-valuetext={current !== null && unit ? `${current} ${unit}` : undefined}
        value={draft ?? (current === null ? '' : String(current))}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d.,-]/g, '').replace(',', '.'))}
        onKeyDown={key}
        onBlur={(e) => { if (draft !== null) commit(draft.trim() === '' || Number.isNaN(Number(draft)) ? (draft.trim() === '' ? null : current) : Number(draft)); onBlur?.(e); }}
        className={styles.input} {...rest} />
    </InputGroup>
  );
});
