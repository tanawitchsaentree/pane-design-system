import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Icon.module.css';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** The SVG glyph. It inherits the text colour. */
  children: ReactNode;
  /** `sm` 16px or `md` 18px (default), the two icon steps in Pane. */
  size?: 'sm' | 'md';
  /** Names the icon when it carries meaning on its own. Leave it out when text beside it says the same. */
  label?: string;
}

/** A glyph at one of the two icon sizes, in the text colour. Decorative unless it has a label. */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon({ size = 'md', label, className, children, ...rest }, ref) {
  return (
    <span ref={ref} data-component="Icon" className={cx(styles.root, styles[size], className)} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} {...rest}>
      {children}
    </span>
  );
});
