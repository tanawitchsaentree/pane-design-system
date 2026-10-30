import { forwardRef, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../cx';
import { check } from '../FileUpload/files';
import styles from './Dropzone.module.css';
import { useMessages } from '../../i18n/context';

export interface DropzoneProps {
  /** Says what to drop, such as Drop photos here. It is the zone's main line. */
  label: string;
  /** The second line, usually what is accepted, such as JPG or PNG up to 20 MB. */
  hint?: string;
  /** File types it takes, as in the native accept attribute. */
  accept?: string;
  /** Lets the reader drop or choose more than one file. */
  multiple?: boolean;
  /** The largest file it takes, in bytes. */
  maxSize?: number;
  /** Called with the files that fit, and with the reasons for any that were refused. */
  onFiles?: (files: File[], refused: string[]) => void;
  /** A glyph above the label; an upload arrow by default. */
  icon?: ReactNode;
  /** Turns the zone off. */
  disabled?: boolean;
  /** Extra class on the zone. */
  className?: string;
  /** Marks the answer as wrong with a critical ring and aria-invalid. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
}

/** A large well that takes files dragged onto it, and is itself a button that opens the file chooser, so
 *  the keyboard and touch get the same thing as a drag. While a file is over it the well lifts into chosen
 *  glass with a ring, by shape and not only by tone (P6). */
export const Dropzone = forwardRef<HTMLButtonElement, DropzoneProps>(function Dropzone({ label, hint, accept, multiple, maxSize, onFiles, icon, disabled, className, invalid }, ref) {
  const t = useMessages();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const take = (list: FileList | null) => { const { ok, refused } = check(Array.from(list ?? []), accept, maxSize, t); onFiles?.(multiple ? ok : ok.slice(0, 1), refused.map((r) => r.reason)); };
  return (
    <>
      <input ref={input} type="file" accept={accept} multiple={multiple} disabled={disabled} hidden onChange={(e) => { take(e.target.files); e.target.value = ''; }} />
      <button ref={ref} type="button" data-component="Dropzone" data-over={over || undefined} disabled={disabled} aria-invalid={invalid || undefined} className={cx(styles.root, className)} aria-describedby={hint ? `${id}-hint` : undefined}
        onClick={() => input.current?.click()}
        onDragEnter={(e) => { e.preventDefault(); setOver(true); }}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false); }}
        onDrop={(e) => { e.preventDefault(); setOver(false); if (!disabled) take(e.dataTransfer.files); }}>
        <span className={styles.well} aria-hidden="true">{icon ?? <svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>}</span>
        <span className={styles.label}>{label}</span>
        {hint && <span id={`${id}-hint`} className={styles.hint}>{hint}</span>}
      </button>
    </>
  );
});
