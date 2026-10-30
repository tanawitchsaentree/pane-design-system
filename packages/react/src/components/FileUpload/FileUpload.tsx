import { forwardRef, useId, useRef, useState } from 'react';
import { cx } from '../../cx';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Progress } from '../Progress';
import { check, sizeText } from './files';
import styles from './FileUpload.module.css';
import { useMessages } from '../../i18n/context';

/** Where one file's upload has got to. `uploading` shows a bar (and the percent when `progress` is set), `done` a check and Uploaded, `error` the octagon, the message and a Retry button. */
export interface FileStatus { state: 'uploading' | 'done' | 'error'; progress?: number; message?: string }

export interface FileUploadProps {
  /** Names what is asked for, such as Receipts; it is the button's text after Choose and the list's name. */
  label: string;
  /** File types it takes, as in the native accept attribute, such as image/*,.pdf. Refused files are listed with the reason. */
  accept?: string;
  /** Lets the reader choose more than one file. */
  multiple?: boolean;
  /** The largest file it takes, in bytes. */
  maxSize?: number;
  /** The chosen files, when you keep them yourself. */
  files?: File[];
  /** Called with the whole list whenever a file is added or removed. */
  onFilesChange?: (files: File[]) => void;
  /** A line under the button that says what is accepted, such as PDF or JPG up to 10 MB. */
  hint?: string;
  /** Name for form submission. */
  name?: string;
  /** Turns the control off. */
  disabled?: boolean;
  /** Extra class on the wrapper. */
  className?: string;
  /** Marks the answer as wrong with a critical ring and aria-invalid. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Says where each file's upload has got to, when the product uploads as files are chosen. Return undefined for a file not started. */
  status?: (file: File, index: number) => FileStatus | undefined;
  /** Called by a failed file's Retry button. */
  onRetry?: (file: File, index: number) => void;
}

/** A button that opens the system file chooser and a list of what was chosen, each file with its size and
 *  its own remove button. A refused file is listed with the reason in words, never only a red mark. For a
 *  large target that also takes dragged files, use Dropzone. */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload({ label, accept, multiple, maxSize, files, onFilesChange, hint, name, disabled, className, invalid, status, onRetry }, ref) {
  const t = useMessages();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState<File[]>([]);
  const list = files ?? inner;
  const [refused, setRefused] = useState<string[]>([]);
  const set = (next: File[]) => { if (files === undefined) setInner(next); onFilesChange?.(next); };
  const add = (chosen: File[]) => { const { ok, refused: no } = check(chosen, accept, maxSize, t); setRefused(no.map((n) => n.reason)); set(multiple ? [...list, ...ok] : ok.slice(0, 1)); };
  return (
    <div ref={ref} data-component="FileUpload" data-invalid={invalid || undefined} className={cx(styles.root, className)}>
      <input ref={input} id={`${id}-in`} type="file" name={name} accept={accept} multiple={multiple} disabled={disabled} hidden
        onChange={(e) => { add(Array.from(e.target.files ?? [])); e.target.value = ''; }} />
      <div className={styles.head}>
        <Button variant="glass" disabled={disabled} aria-invalid={invalid || undefined} onClick={() => input.current?.click()} aria-describedby={hint ? `${id}-hint` : undefined}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
          {t.choose(label.toLowerCase())}
        </Button>
        {hint && <span id={`${id}-hint`} className={styles.hint}>{hint}</span>}
      </div>
      {refused.length > 0 && <ul className={styles.refused} role="alert">{refused.map((r, i) => <li key={i}>{r}</li>)}</ul>}
      {list.length > 0 && (
        <ul className={styles.list} aria-label={label}>
          {list.map((f, i) => (
            <li key={`${f.name}-${i}`} className={styles.file}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><path d="M6 3h8l4 4v14H6Z M14 3v4h4" /></svg>
              <span className={styles.name}>{f.name}</span>
              <span className={styles.size}>{sizeText(f.size)}</span>
              {(() => {
                const st = status?.(f, i);
                if (!st) return null;
                if (st.state === 'uploading') return <span className={styles.status}><Progress label={t.uploading(f.name)} value={st.progress} size="sm" hideLabel className={styles.bar} /></span>;
                if (st.state === 'done') return <span className={cx(styles.status, styles.done)}><svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12.3l2.4 2.4 4.6-5" /></svg>{t.uploaded}</span>;
                return (
                  <span className={cx(styles.status, styles.failed)} role="alert">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><path d="M8.6 3.8h6.8l4.8 4.8v6.8l-4.8 4.8H8.6l-4.8-4.8V8.6z" /><path d="M12 8v5M12 16v.01" /></svg>
                    <span><span className={styles.sr}>{t.error} </span>{st.message ?? t.uploadFailed}</span>
                    {onRetry && <Button variant="ghost" size="sm" onClick={() => onRetry(f, i)}>{t.retry}</Button>}
                  </span>
                );
              })()}
              <IconButton variant="ghost" aria-label={t.removeItem(f.name)} onClick={() => set(list.filter((_, j) => j !== i))}><svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><path d="M7 7l10 10M17 7 7 17" /></svg></IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
