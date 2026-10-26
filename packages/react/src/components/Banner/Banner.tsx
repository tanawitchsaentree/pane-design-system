import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Banner.module.css';

export type BannerTone = 'info' | 'positive' | 'warning' | 'critical';

export interface BannerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Each tone (info, positive, warning, critical) has its own icon, so tone has a shape cue as well as colour. */
  tone?: BannerTone;
  /** One-line headline saying what happened. */
  title: ReactNode;
  /** Optional detail on what it means or what to do. */
  children?: ReactNode;
  /** Optional action (e.g. a Button) shown after the text. */
  action?: ReactNode;
  /** Shows a dismiss button labelled "Dismiss". */
  onDismiss?: () => void;
  /**
   * Announce it when it appears. 'polite' gives role="status" and 'assertive' gives role="alert".
   * Leave it unset for banners already present on page load, since announcing those interrupts for nothing.
   */
  live?: 'polite' | 'assertive';
}

const ICONS: Record<BannerTone, ReactNode> = {
  info: <path d="M12 8v.01M12 11v5" strokeWidth="2.2" strokeLinecap="round" />,
  positive: <path d="M8 12.5l3 3 5-6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  warning: <path d="M12 7.5v5M12 16v.01" strokeWidth="2.2" strokeLinecap="round" />,
  critical: <path d="M9 9l6 6M15 9l-6 6" strokeWidth="2.2" strokeLinecap="round" />,
};
const TONE_LABEL: Record<BannerTone, string> = { info: 'Info', positive: 'Success', warning: 'Warning', critical: 'Error' };

/** An inline message about the page or a task: an icon in the tone colour, a title, detail and an optional action. */
export const Banner = forwardRef<HTMLElement, BannerProps>(function Banner(
  { tone = 'info', title, children, action, onDismiss, live, className, ...rest },
  ref,
) {
  const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined;
  return (
    <section ref={ref} className={cx(styles.root, styles[tone], className)} role={role} aria-label={role ? undefined : TONE_LABEL[tone]} {...rest}>
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">{ICONS[tone]}</svg>
      </span>
      <div className={styles.body}>
        <p className={styles.title}><span className={styles.sr}>{TONE_LABEL[tone]}: </span>{title}</p>
        {children != null && <div className={styles.detail}>{children}</div>}
      </div>
      {action != null && <div className={styles.action}>{action}</div>}
      {onDismiss && (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
      )}
    </section>
  );
});
