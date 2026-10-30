import { forwardRef, useEffect, useRef, useState } from 'react';
import { cx } from '../../cx';
import { Input } from '../Input';
import styles from './Editable.module.css';
import { useMessages } from '../../i18n/context';

export interface EditableProps {
  /** Names the value, such as Album title; the button reads Edit album title and the field takes it as its name. */
  label: string;
  /** The text, when you keep it yourself. */
  value?: string;
  /** The text it starts with. */
  defaultValue?: string;
  /** Called with the new text when an edit is saved; not called when it is cancelled or unchanged. */
  onSave?: (value: string) => void;
  /** Shown in the secondary tone when the text is empty, such as Add a title. */
  placeholder?: string;
  /** `body` (default) is body text; `title` edits a heading in the title size. */
  size?: 'body' | 'title';
  /** Turns editing off; the text stays readable. */
  disabled?: boolean;
  /** Extra class on the wrapper. */
  className?: string;
}

/** Text that turns into a field where it stands. The text is a button with a pencil that shows on hover
 *  and focus; pressing it puts the same words in a groove, Enter or leaving saves, Esc puts them back.
 *  Focus returns to the text afterwards, so the reader stays where they were. */
export const Editable = forwardRef<HTMLDivElement, EditableProps>(function Editable({ label, value, defaultValue, onSave, placeholder, size = 'body', disabled, className }, ref) {
  const t = useMessages();
  const [inner, setInner] = useState(defaultValue ?? '');
  const text = value ?? inner;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const field = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const back = useRef(false);
  useEffect(() => { if (editing) { field.current?.focus(); field.current?.select(); } else if (back.current) { back.current = false; button.current?.focus(); } }, [editing]);
  const finish = (save: boolean) => {
    if (!editing) return;
    if (save && draft !== text) { if (value === undefined) setInner(draft); onSave?.(draft); }
    back.current = true; setEditing(false);
  };
  return (
    <div ref={ref} data-component="Editable" className={cx(styles.root, styles[size], className)}>
      {editing ? (
        <Input ref={field} aria-label={label} value={draft} placeholder={placeholder} className={styles.field}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); finish(true); } if (e.key === 'Escape') { e.preventDefault(); finish(false); } }}
          onBlur={() => finish(true)} />
      ) : (
        <button ref={button} type="button" disabled={disabled} className={styles.text} aria-label={t.edit(label.toLowerCase(), text || placeholder || t.empty)}
          onClick={() => { setDraft(text); setEditing(true); }}>
          <span className={cx(!text && styles.placeholder)}>{text || placeholder}</span>
          {!disabled && <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.pencil}><path d="M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4" /></svg>}
        </button>
      )}
    </div>
  );
});
