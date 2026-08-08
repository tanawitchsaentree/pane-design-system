import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import styles from './Link.module.css';

export type LinkVariant = 'default' | 'subtle';

export interface LinkProps extends ComponentPropsWithoutRef<'a'> {
  href: string;
  /** `'default'` spends the scarce brand accent (D-001) — reserve for the rare link that IS a
   * view's primary action. `'subtle'` (plain text color) is the right choice for most inline
   * body-copy links. Default `'subtle'`. */
  variant?: LinkVariant;
  /**
   * Render as the single child element instead of an `a` (Radix-style polymorphism) — for
   * framework router `<Link>` components that must own the anchor element themselves.
   */
  asChild?: boolean;
  children?: ReactNode;
}

const isExternal = (href: string): boolean => {
  if (typeof window === 'undefined') return /^https?:\/\//i.test(href);
  try {
    const url = new URL(href, window.location.href);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
};

/**
 * Link — `<a>` wrapper with quiet-by-default underline (D-001: calm, not underlined at rest) but
 * a clear focus-visible ring always (D-006/BLUEPRINT a11y baseline — underline is a style choice,
 * focus visibility is not negotiable). Absolute cross-origin `href`s automatically get
 * `target="_blank" rel="noopener noreferrer"` so consumers don't have to remember the security
 * attributes every time.
 * Anatomy: single root element (`a` by default, or the `asChild` child).
 */
export const Link = forwardRef<ElementRef<'a'>, LinkProps>(function Link(
  { href, variant = 'subtle', asChild = false, className, target, rel, children, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'a';
  const classes = className ? `${styles.link} ${className}` : styles.link;
  const external = isExternal(href);
  const resolvedTarget = target ?? (external ? '_blank' : undefined);
  const resolvedRel = rel ?? (external ? 'noopener noreferrer' : undefined);

  return (
    <Comp
      ref={ref}
      href={href}
      className={classes}
      data-variant={variant}
      target={resolvedTarget}
      rel={resolvedRel}
      {...rest}
    >
      {children}
    </Comp>
  );
});

Link.displayName = 'Link';
