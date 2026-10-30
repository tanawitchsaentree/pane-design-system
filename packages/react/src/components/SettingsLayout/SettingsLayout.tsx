import { forwardRef, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './SettingsLayout.module.css';

export interface SettingsRowProps {
  /** The setting's name, such as Email me when someone comments. */
  label: string;
  /** A sentence under the name on what it changes. */
  description?: ReactNode;
  /** The control, such as a Switch, a Select, a SegmentedControl or a Button. Give it the same label. */
  control: ReactNode;
}

export interface SettingsGroupProps {
  /** The group's heading, such as Notifications. */
  title: string;
  /** A line under the heading. */
  description?: ReactNode;
  /** SettingsRows. */
  children: ReactNode;
}

export interface SettingsLayoutProps {
  /** The page heading, such as Settings. */
  title: string;
  /** The groups. */
  children: ReactNode;
  /** Extra class on the wrapper. */
  className?: string;
}

/** A settings page: a heading, then groups as inset panes with hairlines between rows, each row a name,
 *  a sentence and its control at the end, the way the system settings people know are laid out. On a
 *  narrow pane the control drops under its words. */
export const SettingsLayout = forwardRef<HTMLDivElement, SettingsLayoutProps>(function SettingsLayout({ title, children, className }, ref) {
  return (
    <div ref={ref} data-component="SettingsLayout" className={cx(styles.root, className)}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  );
});

export function SettingsGroup({ title, description, children }: SettingsGroupProps) {
  return (
    <section className={styles.group} aria-label={title}>
      <div className={styles.groupHead}>
        <h2 className={styles.groupTitle}>{title}</h2>
        {description && <p className={styles.groupDescription}>{description}</p>}
      </div>
      <div className={styles.rows}>{children}</div>
    </section>
  );
}

export function SettingsRow({ label, description, control }: SettingsRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
      <div className={styles.control}>{control}</div>
    </div>
  );
}
