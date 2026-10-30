import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Heading.module.css';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** The outline level, h1 to h6. Pick it from the page outline, never from the look. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** The look, taken from the type scale as `display`, `headline`, `title` or `emphasis`. It defaults by level. */
  size?: 'display' | 'headline' | 'title' | 'emphasis';
}

const BY_LEVEL = { 1: 'display', 2: 'headline', 3: 'title', 4: 'emphasis', 5: 'emphasis', 6: 'emphasis' } as const;

/** A heading whose level comes from the outline and whose size comes from the scale, set apart so a small
 *  heading deep in a card can still be an h2 when the outline needs it. */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading({ level, size, className, ...rest }, ref) {
  const Tag = `h${level}` as 'h1';
  return <Tag ref={ref} data-component="Heading" className={cx(styles.root, styles[size ?? BY_LEVEL[level]], className)} {...rest} />;
});
