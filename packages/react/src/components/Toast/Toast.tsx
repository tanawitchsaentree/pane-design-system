import { type ReactNode } from 'react';
import * as RT from '@radix-ui/react-toast';
import { cx } from '../../cx';
import styles from './Toast.module.css';
import { useMessages } from '../../i18n/context';

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
  /** `info` (default), `positive` or `critical`: the status mark beside the title. */
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
  return (
    <RT.Provider swipeDirection="right" duration={duration}>
      <RT.Root open={preview ? true : open} onOpenChange={onOpenChange} duration={preview ? Infinity : undefined} className={cx(styles.toast, className)} data-component="Toast" data-tone={tone}>
        <span className={cx(styles.mark, styles[tone])} aria-hidden="true" />
        <div className={styles.text}>
          <RT.Title className={styles.title}>{title}</RT.Title>
          {description != null && <RT.Description className={styles.description}>{description}</RT.Description>}
        </div>
        {action && <RT.Action altText={action.altText} className={styles.action} onClick={action.onClick}>{action.label}</RT.Action>}
        <RT.Close className={styles.close} aria-label={useMessages().dismiss}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></RT.Close>
      </RT.Root>
      <RT.Viewport className={cx(styles.viewport, preview && styles.previewViewport)} />
    </RT.Provider>
  );
}
