import { forwardRef, useEffect, useRef, type ReactNode } from 'react';
import * as RP from '@radix-ui/react-popover';
import { Card } from '../Card';
import { Button } from '../Button';
import { cx } from '../../cx';
import styles from './CoachMark.module.css';
import { useMessages } from '../../i18n/context';

export interface CoachMarkProps {
  /** The thing being pointed out; the mark is anchored to it and does not change it. */
  children: ReactNode;
  /** Shows the mark. Show one at a time, in order, and only on a first visit or after a change. */
  open: boolean;
  /** What the thing does, in a few words, such as Filter by place. */
  title: string;
  /** One sentence on why it helps. */
  description?: ReactNode;
  /** This mark's place in the tour, from 1; with `total` it reads 2 of 4. */
  step?: number;
  /** How many marks the tour has. */
  total?: number;
  /** Called by Next, or Done on the last mark. */
  onNext: () => void;
  /** Called by Skip tour and by Esc; the tour should not come back by itself. */
  onSkip: () => void;
  /** Which side of the thing the mark opens on; below by default. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Draws the card in place under the thing, for documentation, previews and screenshots, never in a product flow. */
  preview?: boolean;
}

/** A small level-4 card anchored to one thing on the page, saying what it does, with Next and Skip tour.
 *  It never covers the page with a scrim and never blocks the thing it points at; Esc skips, and focus
 *  moves to the card when it opens and back to the page when the tour ends. */
export const CoachMark = forwardRef<HTMLDivElement, CoachMarkProps>(function CoachMark({ children, open, title, description, step, total, onNext, onSkip, side = 'bottom', preview }, ref) {
  const t = useMessages();
  const head = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (open && !preview) requestAnimationFrame(() => head.current?.focus()); }, [open, preview]);
  const last = step !== undefined && total !== undefined && step >= total;
  const body = (
    <>
      {step !== undefined && total !== undefined && <span className={styles.count}>{t.of(step, total)}</span>}
      <p ref={head} tabIndex={-1} className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.actions}>
        {!last && <Button variant="glass" size="sm" onClick={onSkip}>{t.skipTour}</Button>}
        <Button variant="light" size="sm" onClick={onNext}>{last ? t.done : t.next}</Button>
      </div>
    </>
  );
  if (preview) return (
    <span className={styles.previewWrap}>
      <span className={styles.anchor} data-coached={open || undefined} data-glow={open ? 'soft' : undefined}>{children}</span>
      {open && <Card ref={ref} as="section" level={4} data-component="CoachMark" aria-label={title} className={cx(styles.card, styles.preview)}>{body}</Card>}
    </span>
  );
  return (
    <RP.Root open={open} onOpenChange={(o) => { if (!o) onSkip(); }}>
      <RP.Anchor asChild><span className={styles.anchor} data-coached={open || undefined} data-glow={open ? 'soft' : undefined}>{children}</span></RP.Anchor>
      <RP.Portal>
        <RP.Content asChild side={side} align="center" sideOffset={12} collisionPadding={12} onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          <Card ref={ref} as="section" level={4} data-component="CoachMark" aria-label={title} className={styles.card}>
            {body}
            <RP.Arrow className={styles.arrow} width={16} height={8} />
          </Card>
        </RP.Content>
      </RP.Portal>
    </RP.Root>
  );
});
