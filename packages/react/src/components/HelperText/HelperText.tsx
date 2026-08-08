import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { Text } from '../Text/Text';
import styles from './HelperText.module.css';

export type HelperTextTone = 'default' | 'error';

export interface HelperTextProps extends ComponentPropsWithoutRef<'p'> {
  /** Visual tone. `'error'` uses `color.action.danger.default` (D-014-fixed AA step — self-checked
   * at 6.91:1/6.50:1 light and 5.78:1/6.07:1 dark against surface.raised/canvas, D-015 contrast
   * self-check). Default `'default'`. */
  tone?: HelperTextTone;
  children?: ReactNode;
}

/**
 * HelperText — supporting copy under a form control (Reuse Check per D-015: renders through
 * `Text` rather than re-declaring font styling, same pattern as Label).
 * Anatomy: single root `p` -> `Text` (the message).
 * A11y: purely presentational text — the connection to its control (`aria-describedby`) is wired
 * by the consumer, or automatically by `FormField` when composed through it.
 */
export const HelperText = forwardRef<ElementRef<'p'>, HelperTextProps>(function HelperText(
  { tone = 'default', className, children, ...rest },
  ref,
) {
  const classes = className ? `${styles.helperText} ${className}` : styles.helperText;

  return (
    <p ref={ref} className={classes} data-tone={tone} {...rest}>
      <Text asChild size="sm" color="subtle">
        <span>{children}</span>
      </Text>
    </p>
  );
});

HelperText.displayName = 'HelperText';
