import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Text } from '../Text/Text';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './Label.module.css';

export interface LabelProps extends Omit<ComponentPropsWithoutRef<'label'>, 'htmlFor'> {
  /** Id of the form control this label describes. Omit only when composing inside `FormField`,
   * which wires this automatically. */
  htmlFor?: string;
  /** Shows a required indicator (`*`, non-color cue backed by visually-hidden "(required)" text
   * for assistive tech — BLUEPRINT §7 requires a non-color cue, and a bare `*` glyph alone still
   * needs a text equivalent since screen readers don't reliably announce it). Default `false`. */
  required?: boolean;
  /**
   * Render as the single child element instead of a `label` (Radix-style polymorphism, same
   * contract as Box/Text elsewhere in this system).
   */
  asChild?: boolean;
  children?: ReactNode;
}

/**
 * Label — `<label>` wrapper for form controls (Reuse Check per D-015: renders its text through
 * `Text` instead of re-declaring font styling, same as every other text-bearing atom in this
 * system).
 * Anatomy: root `label` -> `Text` (the label copy) -> optional required-indicator span.
 * A11y: native `<label for>` association (or `asChild` lets a caller wrap an actual control
 * directly instead); `required` renders a visible `*` (`aria-hidden`) plus a `VisuallyHidden`
 * "(required)" so screen readers get an equivalent cue, matching BLUEPRINT §7's non-color-cue rule.
 */
export const Label = forwardRef<ElementRef<'label'>, LabelProps>(function Label(
  { htmlFor, required = false, asChild = false, className, children, ...rest },
  ref,
) {
  const classes = className ? `${styles.label} ${className}` : styles.label;
  const Comp = asChild ? Slot : 'label';

  return (
    <Comp ref={ref} className={classes} htmlFor={htmlFor} {...rest}>
      <Text asChild size="sm" weight="medium" color="default">
        <span>
          {children}
          {required && (
            <>
              <span className={styles.requiredIndicator} aria-hidden="true">
                {' '}*
              </span>
              <VisuallyHidden> (required)</VisuallyHidden>
            </>
          )}
        </span>
      </Text>
    </Comp>
  );
});

Label.displayName = 'Label';
