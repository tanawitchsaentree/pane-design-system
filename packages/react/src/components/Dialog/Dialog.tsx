import { Fragment, forwardRef, type ReactNode } from 'react';
import * as RD from '@radix-ui/react-dialog';
import { cx } from '../../cx';
import { Card } from '../Card';
import styles from './Dialog.module.css';

// Behaviour (focus trap, Esc, outside press, scroll lock, aria-modal, labelling) is Radix's. Pane draws
// the overlay as level 3 of the stack (D-025): a scrim dims the scene and the dialog rises onto it.

export interface DialogProps {
  /** The control that opens it, usually a Button. Leave it out and use `open` for a controlled dialog. */
  trigger?: ReactNode;
  /** The dialog's title, its accessible name. */
  title: ReactNode;
  /** One or two sentences under the title, its accessible description. */
  description?: ReactNode;
  /** The body. */
  children?: ReactNode;
  /** Buttons at the foot, the loud action last. Wrap a button in `Dialog.Close` to close on press. */
  actions?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Starting state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when it opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** `md` (default, 480px) or `lg` (640px) for a form. */
  size?: 'md' | 'lg';
  /** Extra class on the dialog pane. */
  className?: string;
  /** Draws it in place, open and not modal, inside its parent: for documentation, previews and screenshots, never in a product flow. */
  preview?: boolean;
}

/** A pane that rises over a dimmed scene and holds the reader until they answer or dismiss it. */
const DialogRoot = forwardRef<HTMLElement, DialogProps>(function Dialog({ trigger, title, description, children, actions, open, defaultOpen, onOpenChange, size = 'md', className, preview }, ref) {
  const Portal = preview ? Fragment : RD.Portal;
  return (
    <RD.Root open={preview ? true : open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={!preview}>
      {trigger != null && <RD.Trigger asChild>{trigger}</RD.Trigger>}
      <Portal>
        {!preview && <RD.Overlay className={styles.scrim} data-component="DialogScrim" />}
        <RD.Content asChild>
          <Card ref={ref} as="section" level={3} data-component="Dialog" className={cx(styles.dialog, size === 'lg' && styles.lg, preview && styles.preview, className)}>
            <RD.Title className={styles.title}>{title}</RD.Title>
            {description != null && <RD.Description className={styles.description}>{description}</RD.Description>}
            {children != null && <div className={styles.body}>{children}</div>}
            {actions != null && <div className={styles.actions}>{actions}</div>}
          </Card>
        </RD.Content>
      </Portal>
    </RD.Root>
  );
});

/** Closes the nearest dialog, sheet or action sheet when its child is pressed. */
const Close = RD.Close;

export const Dialog = Object.assign(DialogRoot, { Close });
