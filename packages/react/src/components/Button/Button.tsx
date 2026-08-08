import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { ActionIntent, ControlSizeToken } from '../../types';
import { Spinner } from '../Spinner/Spinner';
import styles from './Button.module.css';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Fill treatment. Default `'solid'`. */
  variant?: ButtonVariant;
  /** Visual intent (D-001 accent scarcity: `'primary'` reserved for the single most important
   * action per view — most buttons should be `'neutral'`). Default `'neutral'`. */
  intent?: ActionIntent;
  /** `size.control.*` t-shirt scale (D-004, md=48). Default `'md'`. */
  size?: ControlSizeToken;
  /** Shows a spinner in place of the icon slot and marks the button busy/disabled. Default `false`. */
  loading?: boolean;
  /** Icon rendered before the label. */
  leftIcon?: ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: ReactNode;
  /**
   * Render as the single child element instead of a `button` (Radix-style polymorphism) — for
   * cases like a Button that must actually be an `<a>` (navigating link styled as a button).
   */
  asChild?: boolean;
  children?: ReactNode;
}

/**
 * Button — native `<button>`-based interactive control (BLUEPRINT §7: basic button behavior does
 * not need to borrow from React Aria/Radix — the browser already provides correct semantics/
 * keyboard behavior for `<button>`). Braun-flat styling throughout: no decorative shadow, hairline
 * border (outline variant), overlay.hover/overlay.pressed tokens for the non-shadow state cue
 * (outline/ghost/link), focusRing token for focus-visible (D-008/braun-flat rules 1 and 4).
 * Anatomy: root `button` -> optional leftIcon slot -> label (children) -> optional rightIcon slot
 * (or a Spinner replacing leftIcon when `loading`).
 * A11y: disabled while `loading` (via native `disabled`, so it's removed from the tab order like
 * any other disabled control) + `aria-busy="true"` so assistive tech announces the pending state.
 */
export const Button = forwardRef<ElementRef<'button'>, ButtonProps>(function Button(
  {
    variant = 'solid',
    intent = 'neutral',
    size = 'md',
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    asChild = false,
    className,
    children,
    type,
    ...rest
  },
  ref,
) {
  const classes = className ? `${styles.button} ${className}` : styles.button;
  const isDisabled = disabled || loading;
  const sharedProps = {
    className: classes,
    'data-variant': variant,
    'data-intent': intent,
    'data-size': size,
    'data-loading': loading ? '' : undefined,
    disabled: isDisabled,
    'aria-busy': loading ? ('true' as const) : undefined,
    ...rest,
  };

  // asChild hands full ownership of content to the single child element (Radix-style
  // polymorphism, same contract as Box/Divider elsewhere in this system) — Slot requires exactly
  // one child, which the icon/label wrapper markup below is not, so decoration is skipped here
  // and the caller's child renders as-is with Button's styling/state props merged onto it.
  if (asChild) {
    return (
      <Slot ref={ref} {...sharedProps}>
        {children}
      </Slot>
    );
  }

  return (
    <button ref={ref} type={type ?? 'button'} {...sharedProps}>
      {loading ? (
        <Spinner className={styles.icon} size={size === 'sm' ? 'sm' : 'md'} />
      ) : (
        leftIcon && <span className={styles.icon} aria-hidden="true">{leftIcon}</span>
      )}
      {children && <span className={styles.label}>{children}</span>}
      {!loading && rightIcon && <span className={styles.icon} aria-hidden="true">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
