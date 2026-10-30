import { forwardRef, useId, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Popover } from '../Popover';
import { IconButton } from '../IconButton';
import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import styles from './NotificationCenter.module.css';
import { useMessages } from '../../i18n/context';

export interface Notice {
  /** Unique within the list. */
  id: string;
  /** What happened, in one line, such as Mara commented on Lofoten. */
  title: string;
  /** More about it, a sentence. */
  body?: string;
  /** When it happened, already formatted, such as 2 min ago. */
  time: string;
  /** The heading it is grouped under, such as Today or Earlier. */
  group?: string;
  /** Not seen yet: it carries a dot and the words New. */
  unread?: boolean;
  /** An avatar or a glyph at the row's start. */
  leading?: ReactNode;
  /** Opens what the notice is about. */
  onOpen?: () => void;
}

export interface NotificationCenterProps {
  /** The notices, newest first. */
  notices: Notice[];
  /** Called by Mark all as read. */
  onMarkAllRead?: () => void;
  /** Called with a notice when its row is pressed, after its own `onOpen`. */
  onOpenNotice?: (notice: Notice) => void;
  /** The bell's name for screen readers; it adds the unread count, as Notifications, 3 unread. */
  label?: string;
  /** Renders the panel in place instead of from the bell, for docs and tests. */
  preview?: boolean;
  /** Extra class on the panel. */
  className?: string;
}

/** A bell that opens a popover of notices grouped by day: unread ones carry a dot and the word New, so
 *  unread reads by a mark and a word (P6), and the badge on the bell gives the count. An empty list says
 *  so with EmptyState instead of a blank panel. */
export const NotificationCenter = forwardRef<HTMLDivElement, NotificationCenterProps>(function NotificationCenter({ notices, onMarkAllRead, onOpenNotice, label: labelIn, preview, className }, ref) {
  const t = useMessages();
  const label = labelIn ?? t.notifications;
  const uid = useId();
  const unread = notices.filter((n) => n.unread).length;
  const groups = [...notices.reduce((m, n) => m.set(n.group ?? t.recent, [...(m.get(n.group ?? t.recent) ?? []), n]), new Map<string, Notice[]>())];
  const panel = (
    <div ref={ref} data-component="NotificationCenter" className={cx(styles.panel, className)}>
      <div className={styles.head}>
        <h2 className={styles.title}>{label}</h2>
        {unread > 0 && onMarkAllRead && <Button variant="glass" size="sm" onClick={onMarkAllRead}>{t.markAllRead}</Button>}
      </div>
      {notices.length === 0 ? <EmptyState size="sm" level={3} title={t.nothingNew} description={t.nothingNewText} /> : groups.map(([g, ns], gi) => (
        <section key={g} aria-labelledby={`${uid}-${gi}`} className={styles.group}>
          <h3 id={`${uid}-${gi}`} className={styles.heading}>{g}</h3>
          <ul className={styles.list}>
            {ns.map((n) => (
              <li key={n.id}>
                <button type="button" className={cx(styles.row, n.unread && styles.unread)} onClick={() => { n.onOpen?.(); onOpenNotice?.(n); }}>
                  {n.leading && <span className={styles.leading}>{n.leading}</span>}
                  <span className={styles.text}>
                    <span className={styles.line}>{n.title}</span>
                    {n.body && <span className={styles.body}>{n.body}</span>}
                    <span className={styles.time}>{n.unread && <span className={styles.new}>{t.newTag} · </span>}{n.time}</span>
                  </span>
                  {n.unread && <span className={styles.dot} aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
  if (preview) return panel;
  return (
    <Popover side="bottom" align="end" className={styles.pop}
      trigger={<IconButton variant="glass" aria-label={unread ? t.unread(label, unread) : label}><svg viewBox="0 0 24 24" aria-hidden="true" className={styles.bell}><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15ZM10 20.5h4" /></svg>{unread > 0 && <span className={styles.badge} aria-hidden="true">{unread > 9 ? '9+' : unread}</span>}</IconButton>}>
      {panel}
    </Popover>
  );
});
