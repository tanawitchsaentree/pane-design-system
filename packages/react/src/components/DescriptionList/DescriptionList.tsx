import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './DescriptionList.module.css';

export interface DescriptionListProps extends Omit<HTMLAttributes<HTMLDListElement>, 'children'> {
  /** The pairs, in reading order, each term with the detail that belongs to it. */
  items: { term: string; detail: ReactNode }[];
  /** `stacked` (default) puts each detail under its term; `inline` puts terms in a column beside their details and stacks again when the pane is narrow. */
  layout?: 'stacked' | 'inline';
  /** Draws a hairline between pairs, for long lists such as an order summary. */
  dividers?: boolean;
}

/** Facts about one thing as term and detail pairs, in a real dl so each detail is read with its term:
 *  the specification of a print, the summary of an order. */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList({ items, layout = 'stacked', dividers, className, ...rest }, ref) {
  return (
    <dl ref={ref} data-component="DescriptionList" className={cx(styles.root, styles[layout], dividers && styles.dividers, className)} {...rest}>
      {items.map((it, i) => (
        <div key={i} className={styles.pair}>
          <dt className={styles.term}>{it.term}</dt>
          <dd className={styles.detail}>{it.detail}</dd>
        </div>
      ))}
    </dl>
  );
});
