import { forwardRef, useId, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { HelperText } from '../HelperText';
import styles from './Fieldset.module.css';

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** The group's name, read before every control in it. */
  legend: ReactNode;
  /** Optional help for the whole group, under the legend. */
  help?: ReactNode;
  /** An error for the group as a whole, such as Choose at least one; shown under the legend with the octagon and the word Error, and read with the group. */
  error?: ReactNode;
}

/** A named group of related fields, such as an address, as a real fieldset and legend. */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset({ legend, help, error, className, children, ...rest }, ref) {
  const auto = useId();
  const errId = error != null ? `${rest.id ?? auto}-error` : undefined;
  return (
    <fieldset ref={ref} data-component="Fieldset" className={cx(styles.root, className)} aria-describedby={errId} {...rest}>
      <legend className={styles.legend}>{legend}</legend>
      {help != null && <p className={styles.help}>{help}</p>}
      {error != null && <HelperText id={errId} tone="error">{error}</HelperText>}
      <div className={styles.fields}>{children}</div>
    </fieldset>
  );
});
