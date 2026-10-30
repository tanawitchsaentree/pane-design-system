import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Kbd.module.css';

export type KbdProps = HTMLAttributes<HTMLElement>;

/** A key the reader presses, drawn as a small keycap lit from above. Write the key as it is printed:
 *  ⌘, Shift, Enter, K. Wrap each key of a shortcut in its own Kbd. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ className, ...rest }, ref) {
  return <kbd ref={ref} data-component="Kbd" className={cx(styles.root, className)} {...rest} />;
});
