import { forwardRef, useMemo, useState, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import { useMessages } from '../../i18n/context';
import { highlight, type CodeLanguage } from './highlight';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The code, as text. It is shown, never run. */
  code: string;
  /** Picks the highlighting rules. `text` shows the code in one colour. */
  language?: CodeLanguage;
  /** What the code is, such as TSX or Terminal; shown in the bar and used to name the copy button. */
  label?: string;
  /** Longer code shows this many lines with "Show all"; Copy always copies everything. */
  lines?: number;
  /** An IDE palette loaded from `pane-react/tokens/code-themes/<id>.css`, such as `github-dark`. Without one, the code takes Pane's palette for the theme. */
  codeTheme?: string;
  /** Numbers each line in the gutter. */
  lineNumbers?: boolean;
}

/** Code with its roles in colour, a label and a copy button that is always there. The colours come from the
 *  syntax tokens, so a code theme or a brand can change them, and every role holds 4.5:1 on the code ground. */
export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock({ code, language = 'tsx', label: labelProp, lines = 14, codeTheme, lineNumbers = false, className, ...rest }, ref) {
  const t = useMessages();
  const label = labelProp ?? t.code;
  const body = code.replace(/\s+$/, '');
  const total = body.split('\n').length;
  const long = total > lines;
  const [open, setOpen] = useState(!long);
  const [copied, setCopied] = useState(false);
  const shown = open ? body : body.split('\n').slice(0, lines).join('\n');
  const runs = useMemo(() => highlight(shown, language), [shown, language]);
  const copy = () => { navigator.clipboard?.writeText(body); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  return (
    <div ref={ref} data-component="CodeBlock" data-codeblock="" data-code-theme={codeTheme} className={cx(styles.root, className)} {...rest}>
      <div className={styles.bar}>
        <span className={styles.label}>{label}</span>
        <span className={styles.actions}>
          {long && <button type="button" className={styles.action} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? t.showLess : t.showAllLines(total)}</button>}
          <button type="button" className={styles.action} data-copy="" aria-label={t.copyCode(label)} onClick={copy}>{copied ? t.copied : t.copy}</button>
          <span className={styles.hidden} role="status">{copied ? t.copied : ''}</span>
        </span>
      </div>
      <pre className={cx(styles.code, !open && styles.clipped, lineNumbers && styles.numbered)} tabIndex={0} aria-label={t.codeSnippet(label)}>
        <code>{lineNumbers ? shown.split('\n').map((ln, i) => <span key={i} className={styles.line}>{highlight(ln, language).map((r, k) => (r.role ? <span key={k} data-syntax={r.role}>{r.text}</span> : r.text))}{'\n'}</span>) : runs.map((r, k) => (r.role ? <span key={k} data-syntax={r.role}>{r.text}</span> : r.text))}</code>
      </pre>
    </div>
  );
});
