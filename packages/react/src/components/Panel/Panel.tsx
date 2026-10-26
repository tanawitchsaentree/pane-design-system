import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Panel.module.css';

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  /** Heading level of `title` — pick the one that fits the page outline. */
  headingLevel?: 2 | 3 | 4;
  description?: ReactNode;
}

export const Panel = forwardRef<HTMLElement, PanelProps>(function Panel(
  { title, headingLevel = 3, description, className, children, ...rest },
  ref,
) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section ref={ref} className={cx(styles.root, className)} {...rest}>
      {title != null && <Heading className={styles.title}>{title}</Heading>}
      {description != null && <p className={styles.description}>{description}</p>}
      {children}
    </section>
  );
});
