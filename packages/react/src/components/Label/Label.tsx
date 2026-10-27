import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Label.module.css';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Adds "(required)" after the text, in words, so the state is never shown by colour alone. */
  required?: boolean;
}

/** A field's name. Looks like a label and never like a link (P7). */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label({ required = false, className, children, ...rest }, ref) {
  return (
    <label ref={ref} data-component="Label" className={cx(styles.root, className)} {...rest}>
      {children}{required && <span className={styles.required}> (required)</span>}
    </label>
  );
});
