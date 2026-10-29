import { forwardRef, type ReactNode } from 'react';
import * as RP from '@radix-ui/react-popover';
import { cx } from '../../cx';
import { Card } from '../Card';
import styles from './Popover.module.css';

export interface PopoverProps {
  /** The control that opens it. */
  trigger: ReactNode;
  /** A short title, the popover's accessible name. */
  title?: ReactNode;
  /** The content. */
  children?: ReactNode;
  /** Which side of the trigger it opens on. Defaults to bottom; it flips when there is no room. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Alignment along that side. */
  align?: 'start' | 'center' | 'end';
  /** Controlled open state. */
  open?: boolean;
  /** Starting state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when it opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Extra class on the root. */
  className?: string;
  /** Draws it in place, open and not modal, inside its parent: for documentation, previews and screenshots, never in a product flow. */
  preview?: boolean;
}

/** Context in a small pane at level 4 (D-025) next to its trigger, without dimming the screen: details,
 *  a short form, an explanation. It closes on Esc and on a press outside, and focus returns to the trigger. */
export const Popover = forwardRef<HTMLElement, PopoverProps>(function Popover({ trigger, title, children, side = 'bottom', align = 'center', open, defaultOpen, onOpenChange, className, preview }, ref) {
  if (preview) return <div className={styles.previewWrap}>{trigger}<Card ref={ref} as="section" level={4} data-component="Popover" aria-label={typeof title === 'string' ? title : undefined} className={cx(styles.popover, styles.preview, className)}>{title != null && <p className={styles.title}>{title}</p>}{children}</Card></div>;
  return (
    <RP.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <RP.Trigger asChild>{trigger}</RP.Trigger>
      <RP.Portal>
        <RP.Content asChild side={side} align={align} sideOffset={8} collisionPadding={12}>
          <Card ref={ref} as="section" level={4} data-component="Popover" aria-label={typeof title === 'string' ? title : undefined} className={cx(styles.popover, className)}>
            {title != null && <p className={styles.title}>{title}</p>}
            {children}
          </Card>
        </RP.Content>
      </RP.Portal>
    </RP.Root>
  );
});
