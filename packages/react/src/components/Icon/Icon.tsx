import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import type { IconSizeToken } from '../../types';
import styles from './Icon.module.css';

export interface IconProps extends Omit<ComponentPropsWithoutRef<'span'>, 'color'> {
  /** `size.icon.*` t-shirt scale — 16/20/24/32 (D-004). Default `'md'` (20). */
  size?: IconSizeToken;
  /**
   * Semantic text color token, or `'currentColor'` (default) to inherit from surrounding text —
   * the common case for icons paired with a label, so they always match it without extra props.
   */
  color?: 'currentColor' | 'default' | 'subtle' | 'disabled' | 'inverse';
  /**
   * Accessible name. Provide this when the icon carries meaning on its own (e.g. a
   * standalone icon-only control's visual content, or an icon next to text where the icon still
   * needs to be independently announced). Omit it — the default — when the icon is purely
   * decorative (adjacent visible text already conveys the meaning); the wrapper is then hidden
   * from assistive tech via `aria-hidden`.
   */
  label?: string;
  /** The SVG icon element. Icon does not ship an icon set — it only sizes/colors whatever is passed. */
  children: ReactNode;
}

const COLOR_VAR: Record<Exclude<IconProps['color'], undefined>, string | undefined> = {
  currentColor: undefined,
  default: 'default',
  subtle: 'subtle',
  disabled: 'disabled',
  inverse: 'inverse',
};

/**
 * Icon — sizes/colors an arbitrary SVG child via CSS vars (D-004 icon size scale). Ships no icon
 * set of its own.
 * Anatomy: single root `span` wrapping the consumer-supplied SVG (set to `width/height: 100%` by
 * the wrapper's `inline-size`/`block-size` so any SVG fills the chosen size box).
 * A11y: `label` set -> `role="img"` + `aria-label` (icon is meaningful on its own); `label`
 * omitted -> `aria-hidden="true"` (icon is decorative, relies on adjacent text for meaning).
 */
export const Icon = forwardRef<ElementRef<'span'>, IconProps>(function Icon(
  { size = 'md', color = 'currentColor', label, className, children, ...rest },
  ref,
) {
  const classes = className ? `${styles.icon} ${className}` : styles.icon;
  const colorAttr = COLOR_VAR[color];

  return (
    <span
      ref={ref}
      className={classes}
      data-size={size}
      data-color={colorAttr}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      {...rest}
    >
      {children}
    </span>
  );
});

Icon.displayName = 'Icon';
