import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './HelperText.module.css';
import { useMessages } from '../../i18n/context';

export interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** `help` is secondary text. `warning` adds the triangle glyph and the spoken word Warning, for a value that is allowed but worth a second look. `error` adds the octagon glyph and the spoken word Error. The tone is never colour alone. */
  tone?: 'help' | 'warning' | 'error';
}

/** Help or an error under a control. FormField renders it and wires its id to the control. */
export const HelperText = forwardRef<HTMLParagraphElement, HelperTextProps>(function HelperText({ tone = 'help', className, children, ...rest }, ref) {
  const t = useMessages();
  return (
    <p ref={ref} data-component="HelperText" className={cx(styles.root, styles[tone], className)} {...rest}>
      {tone === 'error' && (
        <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true"><path d="M8.6 3.8h6.8l4.8 4.8v6.8l-4.8 4.8H8.6l-4.8-4.8V8.6z" /><path d="M12 8v5M12 16v.01" /></svg>
      )}
      {tone === 'warning' && (
        <svg className={cx(styles.glyph, styles.warnGlyph)} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2l8.6 15H3.4z" /><path d="M12 10v4M12 16.8v.01" /></svg>
      )}
      {tone === 'error' && <span className={styles.sr}>{t.error} </span>}
      {tone === 'warning' && <span className={styles.sr}>{t.warning}: </span>}
      <span>{children}</span>
    </p>
  );
});
