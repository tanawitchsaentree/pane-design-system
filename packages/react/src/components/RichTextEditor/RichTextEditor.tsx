import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { cx } from '../../cx';
import { useField } from '../FormField';
import styles from './RichTextEditor.module.css';
import { useMessages } from '../../i18n/context';

export interface RichTextEditorProps {
  /** Names the editor when it is not inside a FormField, such as Description. */
  'aria-label'?: string;
  /** The HTML it starts with. Only paragraphs, bold, italic, lists and links are kept. */
  defaultValue?: string;
  /** Called with the HTML after every change. Clean it on the server before you show it to others. */
  onChange?: (html: string) => void;
  /** Shown in the secondary tone while the editor is empty. */
  placeholder?: string;
  /** The smallest height, in lines of text; 5 by default. */
  rows?: number;
  /** Turns editing off; the text stays readable. */
  disabled?: boolean;
  /** Shows the text without letting it change; it can be focused, read and selected, and the toolbar is hidden. */
  readOnly?: boolean;
  /** Marks the text as wrong. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Extra class on the wrapper. */
  className?: string;
}

type Mark = 'bold' | 'italic' | 'insertUnorderedList' | 'insertOrderedList';
const TOOLS: { cmd: Mark | 'link'; label: 'bold' | 'italic' | 'bulletedList' | 'numberedList' | 'link'; keys: string; path: string }[] = [
  { cmd: 'bold', label: 'bold', keys: 'Ctrl+B', path: 'M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z' },
  { cmd: 'italic', label: 'italic', keys: 'Ctrl+I', path: 'M10 5h8M6 19h8M14 5l-4 14' },
  { cmd: 'insertUnorderedList', label: 'bulletedList', keys: '', path: 'M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01' },
  { cmd: 'insertOrderedList', label: 'numberedList', keys: '', path: 'M10 7h10M10 12h10M10 17h10M4 6l1.5-1V9M4 14h2.5L4 17h2.5' },
  { cmd: 'link', label: 'link', keys: 'Ctrl+K', path: 'M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1' },
];

/** A text field for short formatted text, a description or a comment: a toolbar of the few marks that
 *  matter, then Input's groove holding the text. The toolbar is one tab stop with arrow keys between its
 *  buttons, and each button says whether its mark is on (aria-pressed), so state reads by more than tone. */
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(function RichTextEditor({ defaultValue = '', onChange, placeholder, rows = 5, disabled, readOnly, invalid, className, ...rest }, ref) {
  const m = useMessages();
  const id = useId();
  const field = useField();
  const off = disabled ?? field?.disabled ?? false;
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [empty, setEmpty] = useState(!defaultValue);
  const [tool, setTool] = useState(0);
  useEffect(() => { if (box.current) box.current.innerHTML = defaultValue; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const sync = () => { if (!box.current?.contains(document.getSelection()?.anchorNode ?? null)) return; setOn(Object.fromEntries((['bold', 'italic', 'insertUnorderedList', 'insertOrderedList'] as Mark[]).map((m) => [m, document.queryCommandState(m)]))); };
    document.addEventListener('selectionchange', sync); return () => document.removeEventListener('selectionchange', sync);
  }, []);
  const changed = () => { const html = box.current?.innerHTML ?? ''; setEmpty(!box.current?.textContent?.trim()); onChange?.(html); };
  const run = (cmd: Mark | 'link') => {
    box.current?.focus();
    if (cmd === 'link') { const url = window.prompt(m.linkAddress); if (url && /^(https?:|mailto:|\/|#)/i.test(url)) document.execCommand('createLink', false, url); }
    else document.execCommand(cmd);
    changed();
  };
  return (
    <div ref={ref} data-component="RichTextEditor" className={cx(styles.root, off && styles.disabled, className)}>
      {!readOnly && <div role="toolbar" aria-label={m.formatting} aria-controls={`${id}-box`} className={styles.toolbar}
        onKeyDown={(e) => { const n = TOOLS.length; const m: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }; if (m[e.key]) { e.preventDefault(); const t = (tool + m[e.key] + n) % n; setTool(t); (e.currentTarget.children[t] as HTMLElement)?.focus(); } }}>
        {TOOLS.map((t, i) => (
          <button key={t.cmd} type="button" tabIndex={i === tool ? 0 : -1} disabled={off} aria-pressed={t.cmd === 'link' ? undefined : !!on[t.cmd]} aria-label={m[t.label]} title={t.keys ? `${m[t.label]} (${t.keys})` : m[t.label]}
            className={cx(styles.tool, on[t.cmd] && styles.on)} onMouseDown={(e) => e.preventDefault()} onClick={() => { setTool(i); run(t.cmd); }}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><path d={t.path} /></svg>
          </button>
        ))}
      </div>}
      <div ref={box} id={`${id}-box`} role="textbox" aria-multiline="true" aria-label={rest['aria-label']} aria-labelledby={rest['aria-label'] || !field ? undefined : `${field.id}-label`}
        aria-describedby={field?.describedBy} aria-disabled={off || undefined} aria-required={field?.required || undefined} aria-readonly={readOnly || undefined} aria-invalid={(invalid ?? field?.invalid) || undefined} tabIndex={readOnly ? 0 : undefined} contentEditable={!off && !readOnly} suppressContentEditableWarning
        data-placeholder={empty ? placeholder : undefined} className={styles.box} style={{ minBlockSize: `calc(${rows} * var(--ds-type-leading-body) * 1em + var(--ds-rich-text-editor-padding) * 2)` }}
        onInput={changed}
        onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); run('link'); } }}
        onPaste={(e) => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')); }} />
    </div>
  );
});
