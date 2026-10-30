import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './List.module.css';

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** `inset` (default) sets the rows on a level-2 pane with hairlines between them, a settings group;
   *  `plain` puts them straight on the pane they are in, for a list inside a card. */
  variant?: 'inset' | 'plain';
  /** Names the list for screen readers when no heading above it does. */
  label?: string;
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title' | 'onClick'> {
  /** The row's main line. */
  title: ReactNode;
  /** A second line in the secondary tone, such as a date or a count. */
  description?: ReactNode;
  /** An Avatar, an Icon or a thumbnail at the row's start. */
  leading?: ReactNode;
  /** A value, a Badge, a Switch or a chevron at the row's end. */
  trailing?: ReactNode;
  /** Makes the whole row a link to this address. */
  href?: string;
  /** Makes the whole row a button that runs this. Leave out both `href` and `onClick` for a row that only shows. */
  onClick?: () => void;
  /** Shows a chevron at the end, for a row that opens a page of its own. */
  chevron?: boolean;
}

/** Rows of things of one kind: people, files, settings. An inset list is a level-2 pane with hairlines
 *  between its rows, like a group of settings; a row that leads somewhere is pressed as a whole. */
export const List = forwardRef<HTMLUListElement, ListProps>(function List({ variant = 'inset', label, className, children, ...rest }, ref) {
  return <ul ref={ref} data-component="List" aria-label={label} className={cx(styles.root, styles[variant], className)} {...rest}>{children}</ul>;
});

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem({ title, description, leading, trailing, href, onClick, chevron, className, ...rest }, ref) {
  const inner = (
    <>
      {leading && <span className={styles.leading}>{leading}</span>}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
      {chevron && <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.chevron}><path d="M6 3.5 10.5 8 6 12.5" /></svg>}
    </>
  );
  return (
    <li ref={ref} className={cx(styles.item, className)} {...rest}>
      {href ? <a href={href} className={cx(styles.row, styles.press)}>{inner}</a>
        : onClick ? <button type="button" onClick={onClick} className={cx(styles.row, styles.press)}>{inner}</button>
        : <div className={styles.row}>{inner}</div>}
    </li>
  );
});
