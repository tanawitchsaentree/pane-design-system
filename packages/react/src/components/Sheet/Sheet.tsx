import { Fragment, forwardRef, useRef, useState, type ReactNode } from 'react';
import * as RD from '@radix-ui/react-dialog';
import { cx } from '../../cx';
import { Card } from '../Card';
import styles from './Sheet.module.css';

// A dialog that comes in from an edge (Radix Dialog behaviour). From the bottom it is a phone's bottom
// sheet with a grabber you can drag down to close; from the start or end it is a side panel.

export interface SheetProps {
  /** The control that opens it. */
  trigger?: ReactNode;
  /** The sheet's title, its accessible name. */
  title: ReactNode;
  /** A sentence under the title. */
  description?: ReactNode;
  /** The content. */
  children?: ReactNode;
  /** Buttons at the foot. */
  actions?: ReactNode;
  /** `bottom` (default) rises from the bottom edge; `start` and `end` slide in from the sides. */
  side?: 'bottom' | 'start' | 'end';
  /** Controlled open state. */
  open?: boolean;
  /** Starting state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when it opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Hides the title visually while keeping it as the accessible name. */
  hideTitle?: boolean;
  /** Extra class on the root. */
  className?: string;
  /** Draws it in place, open and not modal, inside its parent, for documentation, previews and screenshots, never in a product flow. */
  preview?: boolean;
}

/** A pane that comes in from an edge over a dimmed scene: a bottom sheet on a phone, a side panel on a wide screen. */
export const Sheet = forwardRef<HTMLElement, SheetProps>(function Sheet({ trigger, title, description, children, actions, side = 'bottom', open, defaultOpen, onOpenChange, hideTitle, className, preview }, ref) {
  const Portal = preview ? Fragment : RD.Portal;
  const pane = useRef<HTMLElement | null>(null);
  const drag = useRef<{ y: number; id: number } | null>(null);
  // uncontrolled sheets keep their own open state, so the grabber can close them without a hidden button
  const [inner, setInner] = useState(defaultOpen ?? false);
  const isOpen = preview ? true : open ?? inner;
  const setOpen = (o: boolean) => { if (open === undefined) setInner(o); onOpenChange?.(o); };
  // the grabber: dragging it down more than a quarter of the sheet closes it; less springs back
  const onDown = (e: React.PointerEvent) => { drag.current = { y: e.clientY, id: e.pointerId }; (e.target as Element).setPointerCapture(e.pointerId); };
  const onMove = (e: React.PointerEvent) => { if (!drag.current || !pane.current) return; const dy = Math.max(0, e.clientY - drag.current.y); pane.current.style.translate = `0 ${dy}px`; };
  const onUp = (e: React.PointerEvent) => {
    if (!drag.current || !pane.current) return; const dy = Math.max(0, e.clientY - drag.current.y); drag.current = null;
    pane.current.style.translate = '';
    if (dy > pane.current.getBoundingClientRect().height / 4) setOpen(false);
  };
  return (
    <RD.Root open={isOpen} onOpenChange={setOpen} modal={!preview}>
      {trigger != null && <RD.Trigger asChild>{trigger}</RD.Trigger>}
      <Portal>
        {!preview && <RD.Overlay className={styles.scrim} data-component="SheetScrim" />}
        <RD.Content asChild>
          <Card ref={(n: HTMLElement | null) => { pane.current = n; if (typeof ref === 'function') ref(n); else if (ref) ref.current = n; }} as="section" level={3} data-component="Sheet" data-side={side} className={cx(styles.sheet, styles[side], preview && styles.preview, className)}>
            {side === 'bottom' && <span className={styles.grabber} aria-hidden="true" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />}
            <RD.Title className={cx(styles.title, hideTitle && styles.hidden)}>{title}</RD.Title>
            {description != null && <RD.Description className={styles.description}>{description}</RD.Description>}
            {children != null && <div className={styles.body}>{children}</div>}
            {actions != null && <div className={styles.actions}>{actions}</div>}
          </Card>
        </RD.Content>
      </Portal>
    </RD.Root>
  );
});
