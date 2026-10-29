import { type ReactNode } from 'react';
import * as RT from '@radix-ui/react-toast';
import { cx } from '../../cx';
import styles from './Snackbar.module.css';

export interface SnackbarProps {
  /** Controlled open state. */
  open: boolean;
  /** Called when it opens or closes. */
  onOpenChange: (open: boolean) => void;
  /** One short line: Message archived. */
  message: ReactNode;
  /** One action, usually Undo. `altText` says how to undo without the snackbar, for screen readers. */
  action?: { label: string; altText: string; onClick: () => void };
  /** How long it stays, in milliseconds. Defaults to 4000. */
  duration?: number;
  /** Extra class on the root. */
  className?: string;
  /** Draws it in place, open and not modal, inside its parent: for documentation, previews and screenshots, never in a product flow. */
  preview?: boolean;
}

/** One line at the bottom of a phone screen confirming what just happened, often with Undo. One at a
 *  time: a new one replaces the last. Built on the same announced, pausing toast as Toast. */
export function Snackbar({ open, onOpenChange, message, action, duration = 4000, className, preview }: SnackbarProps) {
  return (
    <RT.Provider swipeDirection="down" duration={duration}>
      <RT.Root open={preview ? true : open} onOpenChange={onOpenChange} duration={preview ? Infinity : undefined} className={cx(styles.bar, className)} data-component="Snackbar">
        <RT.Description className={styles.message}>{message}</RT.Description>
        {action && <RT.Action altText={action.altText} className={styles.action} onClick={action.onClick}>{action.label}</RT.Action>}
      </RT.Root>
      <RT.Viewport className={cx(styles.viewport, preview && styles.previewViewport)} />
    </RT.Provider>
  );
}
