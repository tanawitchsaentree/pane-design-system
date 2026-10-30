import { type ReactNode } from 'react';
import * as RT from '@radix-ui/react-toast';
import { cx } from '../../cx';
import styles from './Toast.module.css';
import { useMessages } from '../../i18n/context';
import { GLYPHS } from '../Banner/Banner';

export interface ToastProps {
  /** Whether it is showing. It hides itself after `duration` and calls onOpenChange(false). */
  open: boolean;
  /** Called when it opens or closes. */
  onOpenChange: (open: boolean) => void;
  /** What happened, in a few words, such as Print ordered. */
  title: ReactNode;
  /** One sentence more, if the title is not enough. */
  description?: ReactNode;
  /** One action, such as Undo or View. `altText` says how to do it without the toast, for screen readers. */
  action?: { label: string; altText: string; onClick: () => void };
  /** The tone, `info` (default), `positive` or `critical`. Each has its own glyph shape beside the title and its word is read first, so colour is never the only cue. */
  tone?: 'info' | 'positive' | 'critical';
  /** How long it stays, in milliseconds. Defaults to 5000; it pauses while hovered or focused. */
  duration?: number;
  /** Extra class on the toast pane. */
  className?: string;
  /** Draws it in place, open and not modal, inside its parent, for documentation, previews and screenshots, never in a product flow. */
  preview?: boolean;
}

/** A short message about something that just happened, in a level-4 pane at the top end of the screen.
 *  It is announced politely, pauses under the pointer and leaves by itself. */
export function Toast({ open, onOpenChange, title, description, action, tone = 'info', duration = 5000, className, preview }: ToastProps) {
  const t = useMessages();
  // the toast sits at the end edge, so it is swiped away towards the end: right in LTR, left in RTL
  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  const word = { info: t.info, positive: t.success, critical: t.errorTone }[tone];
  const mark = <svg className={cx(styles.mark, styles[tone])} viewBox="0 0 24 24" aria-hidden="true">{GLYPHS[tone]}</svg>;
  const close = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>;
  // A preview is drawn in place on the first render, with no portal and no timer: Radix mounts a toast
  // into its viewport a frame later, which left a documentation page without its text on first paint.
  if (preview) return (
    <div className={cx(styles.viewport, styles.previewViewport)}>
      <div role="status" className={cx(styles.toast, className)} data-component="Toast" data-tone={tone} data-state="open">
        {mark}
        <div className={styles.text}>
          <div className={styles.title}><span className={styles.sr}>{word}: </span>{title}</div>
          {description != null && <div className={styles.description}>{description}</div>}
        </div>
        {action && <button type="button" className={styles.action} onClick={action.onClick}>{action.label}</button>}
        <button type="button" className={styles.close} aria-label={t.dismiss} onClick={() => onOpenChange(false)}>{close}</button>
      </div>
    </div>
  );
  return (
    <RT.Provider swipeDirection={rtl ? 'left' : 'right'} duration={duration}>
      <RT.Root open={open} onOpenChange={onOpenChange} className={cx(styles.toast, className)} data-component="Toast" data-tone={tone}>
        {mark}
        <div className={styles.text}>
          <RT.Title className={styles.title}><span className={styles.sr}>{word}: </span>{title}</RT.Title>
          {description != null && <RT.Description className={styles.description}>{description}</RT.Description>}
        </div>
        {action && <RT.Action altText={action.altText} className={styles.action} onClick={action.onClick}>{action.label}</RT.Action>}
        <RT.Close className={styles.close} aria-label={t.dismiss}>{close}</RT.Close>
      </RT.Root>
      <RT.Viewport className={styles.viewport} />
    </RT.Provider>
  );
}
