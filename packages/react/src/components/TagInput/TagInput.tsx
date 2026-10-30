import { forwardRef, useId, useState } from 'react';
import { cx } from '../../cx';
import { Chip } from '../Chip';
import { useField } from '../FormField';
import styles from './TagInput.module.css';

export interface TagInputProps {
  /** The field's label. */
  label: string;
  /** The tags. */
  value?: string[];
  /** The starting value when uncontrolled. */
  defaultValue?: string[];
  /** Called when the value changes. */
  onValueChange?: (tags: string[]) => void;
  /** A hint inside the empty field. It never replaces the label. */
  placeholder?: string;
  /** Stop accepting tags after this many. */
  max?: number;
  /** A line under the field, such as "Press Enter after each tag". */
  hint?: string;
  /** Extra class on the root. */
  className?: string;
  /** Turns the field off. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
  /** Shows the tags without letting them change; it can still be focused and read. */
  readOnly?: boolean;
  /** Marks the value as wrong. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Says the field must be filled. Inside a FormField, its `required` sets this for you. */
  required?: boolean;
}

/** Free-form tags typed into one field: Enter or a comma turns the text into a chip, Backspace in an empty
 *  field removes the last one, and pasting a comma-separated list adds them all. Duplicates are ignored. */
export const TagInput = forwardRef<HTMLDivElement, TagInputProps>(function TagInput({ label, value, defaultValue, onValueChange, placeholder, max, hint, className, disabled, readOnly, invalid, required }, ref) {
  const id = useId();
  const field = useField();
  const off = disabled ?? field?.disabled ?? false;
  const bad = invalid ?? field?.invalid ?? false;
  const fixed = off || !!readOnly;
  const [inner, setInner] = useState<string[]>(defaultValue ?? []);
  const tags = value ?? inner;
  const [text, setText] = useState('');
  const set = (next: string[]) => { if (value === undefined) setInner(next); onValueChange?.(next); };
  const add = (raw: string) => {
    const parts = raw.split(',').map((t) => t.trim()).filter(Boolean);
    const next = [...tags]; for (const p of parts) if (!next.some((t) => t.toLowerCase() === p.toLowerCase()) && (!max || next.length < max)) next.push(p);
    if (next.length !== tags.length) set(next); setText('');
  };
  const full = !!max && tags.length >= max;
  return (
    <div ref={ref} data-component="TagInput" data-off={off || undefined} className={cx(styles.root, className)}>
      {!field && <label htmlFor={`${id}-in`} className={styles.label}>{label}</label>}
      <div className={styles.field}>
        {tags.map((t) => <Chip key={t} onRemove={fixed ? undefined : () => set(tags.filter((x) => x !== t))} removeLabel={t}>{t}</Chip>)}
        <input id={field?.id ?? `${id}-in`} className={styles.input} value={text} placeholder={tags.length ? undefined : placeholder} disabled={full || off} readOnly={readOnly} required={required ?? field?.required} aria-invalid={bad || undefined} aria-describedby={[field?.describedBy, hint ? `${id}-h` : undefined].filter(Boolean).join(' ') || undefined}
          onChange={(e) => { if (e.target.value.endsWith(',')) add(e.target.value); else setText(e.target.value); }}
          onPaste={(e) => { const t = e.clipboardData.getData('text'); if (t.includes(',')) { e.preventDefault(); add(text + t); } }}
          onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) { e.preventDefault(); add(text); } if (e.key === 'Backspace' && !text && tags.length) set(tags.slice(0, -1)); }}
          onBlur={() => { if (text.trim()) add(text); }} />
      </div>
      {hint && <span id={`${id}-h`} className={styles.hint}>{hint}</span>}
    </div>
  );
});
