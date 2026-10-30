import { useState, type ReactElement, type ReactNode } from 'react';
import * as RT from '@radix-ui/react-tooltip';
import { cx } from '../../cx';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  /** The control it describes. It must be focusable, such as an IconButton. */
  children: ReactElement;
  /** A few words on what the control does or what a mark means. */
  content: ReactNode;
  /** Which side it appears on. Defaults to top. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Draws it in place, open and not modal, inside its parent, for documentation, previews and screenshots, never in a product flow. */
  preview?: boolean;
}

/** A few words next to a control, shown on hover and on keyboard focus, and on a tap on touch screens,
 *  where there is no hover (wave 4: "Tooltip (tap)"). It never holds anything the reader must act on. */
export function Tooltip({ children, content, side = 'top', preview }: TooltipProps) {
  const [open, setOpen] = useState(false);
  if (preview) return <span className={styles.previewWrap}><span className={cx(styles.tip, styles.preview)} data-component="Tooltip" role="tooltip">{content}</span>{children}</span>;
  return (
    <RT.Provider delayDuration={300}>
      <RT.Root open={open} onOpenChange={setOpen}>
        <RT.Trigger asChild onPointerDown={(e) => { if (e.pointerType === 'touch') setOpen((o) => !o); }}>{children}</RT.Trigger>
        <RT.Portal>
          <RT.Content side={side} sideOffset={6} collisionPadding={8} className={styles.tip} data-component="Tooltip">{content}</RT.Content>
        </RT.Portal>
      </RT.Root>
    </RT.Provider>
  );
}
