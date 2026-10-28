import { forwardRef, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Fieldset.module.css';

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** The group's name, read before every control in it. */
  legend: ReactNode;
  /** Optional help for the whole group, under the legend. */
  help?: ReactNode;
}

/** A named group of related fields, such as an address, as a real fieldset and legend. */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset({ legend, help, className, children, ...rest }, ref) {
  return (
    <fieldset ref={ref} data-component="Fieldset" className={cx(styles.root, className)} {...rest}>
      <legend className={styles.legend}>{legend}</legend>
      {help != null && <p className={styles.help}>{help}</p>}
      <div className={styles.fields}>{children}</div>
    </fieldset>
  );
});
