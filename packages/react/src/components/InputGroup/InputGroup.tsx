import { forwardRef } from 'react';
import type { ElementRef, ReactNode } from 'react';
import { Flex } from '../Flex/Flex';
import type { FlexProps } from '../Flex/Flex';
import styles from './InputGroup.module.css';

export interface InputGroupProps extends Omit<FlexProps, 'direction' | 'gap' | 'align' | 'prefix'> {
  /** Prefix adornment rendered before the input (e.g. a currency symbol). Purely decorative —
   * give it its own accessible name if it needs one. */
  prefix?: ReactNode;
  /** Suffix adornment rendered after the input (e.g. a unit label). */
  suffix?: ReactNode;
  children?: ReactNode;
}

/**
 * InputGroup — composes an `Input`/`Textarea` with prefix/suffix adornments into one visually
 * unified group (Reuse Check per D-015: built on `Flex` from Wave 1 instead of a bespoke flexbox
 * implementation). Unlike `Input`'s own `leftElement`/`rightElement` props (small icon glyphs
 * inside the same bordered box), InputGroup renders the adornment as its OWN bordered segment
 * next to the control — the right shape for a multi-character prefix/suffix like "$" + amount +
 * "USD" that should read as a distinct, contiguous block.
 * Anatomy: root `Flex` (row, no gap) -> optional prefix segment -> the control (children) ->
 * optional suffix segment. The middle control keeps its own focus ring; this wrapper does not
 * intercept focus.
 * A11y: purely a layout/visual composition — no new role. Adornments are `aria-hidden`; if a
 * prefix/suffix conveys meaning (e.g. "required" currency), pair it with a `Label`/`HelperText`
 * via `FormField` rather than relying on the adornment text alone.
 */
export const InputGroup = forwardRef<ElementRef<'div'>, InputGroupProps>(function InputGroup(
  { prefix, suffix, className, children, ...rest },
  ref,
) {
  const classes = className ? `${styles.group} ${className}` : styles.group;

  return (
    <Flex ref={ref} direction="row" align="stretch" className={classes} {...rest}>
      {prefix && (
        <span className={styles.adornment} data-position="prefix" aria-hidden="true">
          {prefix}
        </span>
      )}
      <div className={styles.control}>{children}</div>
      {suffix && (
        <span className={styles.adornment} data-position="suffix" aria-hidden="true">
          {suffix}
        </span>
      )}
    </Flex>
  );
});

InputGroup.displayName = 'InputGroup';
