import { type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './InputGroup.module.css';

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Shown before the input inside the same well, such as a search icon or a currency. Decorative unless it is a control. */
  start?: ReactNode;
  /** Shown after the input inside the same well, such as a unit or a small Button. */
  end?: ReactNode;
  /** One Input. */
  children: ReactNode;
}

/** One well holding an Input and its adornments, so a unit or icon reads as part of the field. */
export function InputGroup({ start, end, className, children, ...rest }: InputGroupProps) {
  return (
    <div data-component="InputGroup" className={cx(styles.root, className)} {...rest}>
      {start != null && <span className={styles.start}>{start}</span>}
      <div className={styles.field}>{children}</div>
      {end != null && <span className={styles.end}>{end}</span>}
    </div>
  );
}
