import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Person or brand the avatar stands for — used as the accessible name and for initials. */
  name: string;
  src?: string;
  size?: AvatarSize;
  /** Set when a visible name sits right next to the avatar, so screen readers don't hear it twice. */
  decorative?: boolean;
}

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size = 'md', decorative = false, className, ...rest },
  ref,
) {
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': name };
  return (
    <span ref={ref} className={cx(styles.root, styles[size], className)} {...a11y} {...rest}>
      {src ? <img className={styles.img} src={src} alt="" /> : <span className={styles.initials} aria-hidden="true">{initials(name)}</span>}
    </span>
  );
});
