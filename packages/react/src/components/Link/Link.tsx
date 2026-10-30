import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Link.module.css';
import { useMessages } from '../../i18n/context';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** `inline` (default) sits in a sentence and is underlined; `standalone` stands on its own line with a heavier weight and an underline on hover. */
  variant?: 'inline' | 'standalone';
  /** Marks a link that leaves the product; adds the words "opens in a new tab" for screen readers. */
  external?: boolean;
}

/** A link in the text colour, found by its underline rather than by a hue (the system owns no blue, P1). */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ variant = 'inline', external, className, children, target, rel, ...rest }, ref) {
  const t = useMessages();
  return (
    <a ref={ref} data-component="Link" className={cx(styles.root, styles[variant], className)} target={external ? '_blank' : target} rel={external ? 'noopener noreferrer' : rel} {...rest}>
      {children}
      {external && <span className={styles.sr}> {t.opensInNewTab}</span>}
    </a>
  );
});
