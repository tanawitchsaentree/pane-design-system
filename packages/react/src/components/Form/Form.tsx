import { forwardRef, useEffect, useId, useRef, type FormEvent, type FormHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Form.module.css';
import { useMessages } from '../../i18n/context';

export interface FormError {
  /** The id of the field that is wrong; the summary links to it and moves focus there. */
  field: string;
  /** What is wrong and how to put it right, the same words the field shows, such as Enter an email address. */
  message: string;
}

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Called on submit with the form's values; the native submit never reloads the page. */
  onSubmit?: (values: FormData, event: FormEvent<HTMLFormElement>) => void;
  /** The errors after a submit. When there are any, a summary appears at the top, takes focus and lists each as a link. */
  errors?: FormError[];
  /** The sentence above the error list; There is a problem by default. */
  errorTitle?: string;
  /** The buttons at the end, usually one loud submit and a quiet cancel. */
  actions?: ReactNode;
  /** The fields and Fieldsets. */
  children: ReactNode;
}

/** A form that lays out its fields in one column with even rhythm, keeps its buttons together at the end,
 *  and on a failed submit puts an error summary at the top that takes focus and links to each field
 *  (GOV.UK error summary). The errors are said in words with the critical mark, never only in red (P6). */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form({ onSubmit, errors = [], errorTitle: errorTitleIn, actions, children, className, noValidate = true, ...rest }, ref) {
  const t = useMessages();
  const errorTitle = errorTitleIn ?? t.thereIsAProblem;
  const summary = useRef<HTMLDivElement>(null);
  const id = useId();
  const count = errors.length;
  // focus moves to the summary when a submit fails, never on first render, so a page opens at its heading
  const mounted = useRef(false);
  useEffect(() => { if (mounted.current && count) summary.current?.focus(); mounted.current = true; }, [errors, count]);
  return (
    <form ref={ref} data-component="Form" noValidate={noValidate} className={cx(styles.root, className)} {...rest}
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(new FormData(e.currentTarget), e); }}>
      {count > 0 && (
        <div ref={summary} className={styles.summary} tabIndex={-1} role="alert" aria-labelledby={`${id}-errors`}>
          <p id={`${id}-errors`} className={styles.title}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><path d="M8.6 3.8h6.8l4.8 4.8v6.8l-4.8 4.8H8.6l-4.8-4.8V8.6z" /><path d="M12 8v5M12 16v.01" /></svg>
            {errorTitle}
          </p>
          <ul className={styles.list}>
            {errors.map((er) => (
              <li key={er.field}><a href={`#${er.field}`} className={styles.link} onClick={(e) => { const el = document.getElementById(er.field); if (el) { e.preventDefault(); el.focus(); el.scrollIntoView({ block: 'center' }); } }}>{er.message}</a></li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.fields}>{children}</div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </form>
  );
});
