import { forwardRef, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import { IconButton } from '../IconButton';
import { Textarea } from '../Textarea';
import { useMessages } from '../../i18n/context';
import styles from './ChatComposer.module.css';

export interface ChatComposerProps {
  /** Called with the text when the reader sends it; the field empties. */
  onSend: (text: string) => void;
  /** While an answer is arriving the send button becomes Stop, which calls this. */
  onStop?: () => void;
  /** Set while an answer is arriving. The field stays usable for the next message, and the button stops the answer. */
  busy?: boolean;
  /** Names the field and shows when it is empty, such as Ask about your results. */
  placeholder?: string;
  /** Names the field for screen readers; the placeholder by default. */
  label?: string;
  /** Things before the field, such as an attach IconButton. */
  start?: ReactNode;
  /** The most lines the field grows to before it scrolls; 6 by default. */
  maxRows?: number;
  /** Turns the composer off, such as while a human has taken over the chat. */
  disabled?: boolean;
  /** Extra class on the composer. */
  className?: string;
}

/** Where the reader writes the next turn: a field that grows with the text, Enter to send and Shift+Enter
 *  for a new line, and one round button that sends, or stops an answer that is arriving. */
export const ChatComposer = forwardRef<HTMLFormElement, ChatComposerProps>(function ChatComposer({ onSend, onStop, busy, placeholder, label, start, maxRows = 6, disabled, className }, ref) {
  const t = useMessages();
  const [text, setText] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);
  const send = () => { const v = text.trim(); if (!v || disabled) return; onSend(v); setText(''); field.current?.focus(); };
  const submit = (e: FormEvent) => { e.preventDefault(); if (busy && onStop && !text.trim()) onStop(); else send(); };
  const key = (e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } };
  const stopping = busy && onStop && !text.trim();
  return (
    <form ref={ref} data-component="ChatComposer" className={cx(styles.root, className)} onSubmit={submit}>
      {start != null && <div className={styles.start}>{start}</div>}
      <Textarea ref={field} className={styles.field} rows={1} autoResize maxRows={maxRows} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={key}
        placeholder={placeholder ?? t.writeMessage} aria-label={label ?? placeholder ?? t.writeMessage} disabled={disabled} enterKeyHint="send" />
      <IconButton type="submit" variant="loud" aria-label={stopping ? t.stop : t.send} disabled={disabled || (!stopping && !text.trim())} className={styles.send}>
        {stopping
          ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2" /></svg>
          : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>}
      </IconButton>
    </form>
  );
});
