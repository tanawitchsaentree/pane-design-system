import { forwardRef, useId, useState } from 'react';
import { cx } from '../../cx';
import { Chip } from '../Chip';
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
}

/** Free-form tags typed into one field: Enter or a comma turns the text into a chip, Backspace in an empty
 *  field removes the last one, and pasting a comma-separated list adds them all. Duplicates are ignored. */
export const TagInput = forwardRef<HTMLDivElement, TagInputProps>(function TagInput({ label, value, defaultValue, onValueChange, placeholder, max, hint, className }, ref) {
  const id = useId();
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
    <div ref={ref} data-component="TagInput" className={cx(styles.root, className)}>
      <label htmlFor={`${id}-in`} className={styles.label}>{label}</label>
      <div className={styles.field}>
        {tags.map((t) => <Chip key={t} onRemove={() => set(tags.filter((x) => x !== t))} removeLabel={`Remove ${t}`}>{t}</Chip>)}
        <input id={`${id}-in`} className={styles.input} value={text} placeholder={tags.length ? undefined : placeholder} disabled={full} aria-describedby={hint ? `${id}-h` : undefined}
          onChange={(e) => { if (e.target.value.endsWith(',')) add(e.target.value); else setText(e.target.value); }}
          onPaste={(e) => { const t = e.clipboardData.getData('text'); if (t.includes(',')) { e.preventDefault(); add(text + t); } }}
          onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) { e.preventDefault(); add(text); } if (e.key === 'Backspace' && !text && tags.length) set(tags.slice(0, -1)); }}
          onBlur={() => { if (text.trim()) add(text); }} />
      </div>
      {hint && <span id={`${id}-h`} className={styles.hint}>{hint}</span>}
    </div>
  );
});
