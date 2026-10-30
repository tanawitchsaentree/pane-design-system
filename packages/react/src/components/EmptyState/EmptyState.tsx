import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './EmptyState.module.css';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Says what is empty in plain words, such as No prints yet. It is a heading at `level`. */
  title: string;
  /** One or two sentences on why it is empty and what the reader can do about it. */
  description?: ReactNode;
  /** A glyph that stands for the missing thing; it sits in a small well above the title and is not read. */
  icon?: ReactNode;
  /** The way out, usually one Button, at most a primary and a secondary. */
  actions?: ReactNode;
  /** The heading level of the title, so the outline of the page stays right; 2 by default. */
  level?: 2 | 3 | 4;
  /** `md` (default) fills a page or a panel; `sm` sits inside a card or a list. */
  size?: 'sm' | 'md';
}

/** The place where content will be, when there is none yet: a glyph in a well, a title, a sentence and
 *  the way out. It says why it is empty and what to do, never only that it is. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState({ title, description, icon, actions, level = 2, size = 'md', className, ...rest }, ref) {
  const H = `h${level}` as 'h2';
  return (
    <div ref={ref} data-component="EmptyState" className={cx(styles.root, styles[size], className)} {...rest}>
      {icon && <span className={styles.well} aria-hidden="true">{icon}</span>}
      <H className={styles.title}>{title}</H>
      {description && <p className={styles.description}>{description}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
});
