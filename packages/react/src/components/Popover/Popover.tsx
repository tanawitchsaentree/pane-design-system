'use client';

import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import styles from './Popover.module.css';

export interface PopoverRootProps {
  /** Controlled open state. Omit + use `defaultOpen` for uncontrolled usage (BLUEPRINT §7). */
  open?: boolean;
  /** Initial open state for uncontrolled usage. Default `false`. */
  defaultOpen?: boolean;
  /** Fires whenever the open state changes (user click-outside/Escape, or programmatic). */
  onOpenChange?: (open: boolean) => void;
  /** Renders `PopoverContent` in a focus-trapping modal layer (Radix `modal` prop). Default `false`
   * — a popover is usually a lightweight auxiliary panel, not a blocking dialog (that's Dialog's
   * job); set `true` for the rare popover that must behave like a mini-modal. */
  modal?: boolean;
  children?: ReactNode;
}

/**
 * Popover.Root — non-visual state/context provider (Radix `Popover`). Behavior (open/close,
 * positioning, click-outside dismissal) is 100% borrowed from `@radix-ui/react-popover` per
 * BLUEPRINT §7 ("ห้ามเขียน focus trap ... เอง") — this file only supplies the token-driven
 * visual layer on top of `PopoverPrimitive.Content`.
 */
export function Root({ children, ...rest }: PopoverRootProps) {
  return <PopoverPrimitive.Root {...rest}>{children}</PopoverPrimitive.Root>;
}
Root.displayName = 'Popover.Root';

export type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>;

/** Popover.Trigger — forwards straight to the Radix trigger (already forwardRef'd upstream, kept
 * as a thin re-export so the compound API is `Popover.Trigger` like every other part). */
export const Trigger = forwardRef<ElementRef<typeof PopoverPrimitive.Trigger>, PopoverTriggerProps>(
  function Trigger(props, ref) {
    return <PopoverPrimitive.Trigger ref={ref} {...props} />;
  },
);
Trigger.displayName = 'Popover.Trigger';

export type PopoverAnchorProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>;

/** Popover.Anchor — optional positioning reference distinct from the trigger (Radix feature),
 * useful when the visual anchor point differs from the element that opens the popover. */
export const Anchor = forwardRef<ElementRef<typeof PopoverPrimitive.Anchor>, PopoverAnchorProps>(
  function Anchor(props, ref) {
    return <PopoverPrimitive.Anchor ref={ref} {...props} />;
  },
);
Anchor.displayName = 'Popover.Anchor';

export interface PopoverContentProps
  extends Omit<ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, 'side'> {
  /** Preferred edge to render against the trigger (Radix `side`). Default `'bottom'`. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Renders in a `document.body` portal (Radix default behavior) unless explicitly disabled by
   * the caller wrapping this in their own `PopoverPrimitive.Portal` — kept implicit here so the
   * common case needs zero extra markup. Default `true`. */
  portal?: boolean;
}

/**
 * Popover.Content — the floating panel (D-018/braun-flat: `shadow.elevation.md`, permitted here
 * because a popover is one of the explicit "floats above content" layers per braun-flat rule 2).
 * `z-index: var(--ds-z-index-popover)` (1500, BLUEPRINT §4.8) so it always stacks above modal
 * content that might render it (e.g. a popover triggered from inside a Dialog) but below toast.
 * Anatomy: root `div[role=dialog]` (Radix sets this) rendered through a portal.
 * A11y: focus stays on the trigger by default (non-modal); Escape and click-outside close it
 * (both wired by Radix, not hand-rolled per BLUEPRINT §7).
 */
export const Content = forwardRef<ElementRef<typeof PopoverPrimitive.Content>, PopoverContentProps>(
  function Content({ side = 'bottom', sideOffset = 8, portal = true, className, children, ...rest }, ref) {
    const classes = className ? `${styles.content} ${className}` : styles.content;
    const content = (
      <PopoverPrimitive.Content
        ref={ref}
        side={side}
        sideOffset={sideOffset}
        className={classes}
        data-ds-surface
        {...rest}
      >
        {children}
      </PopoverPrimitive.Content>
    );
    return portal ? <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal> : content;
  },
);
Content.displayName = 'Popover.Content';

export type PopoverCloseProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>;

/** Popover.Close — dismiss button for content that wants an explicit close affordance (most
 * popovers rely on click-outside/Escape instead; this is opt-in). */
export const Close = forwardRef<ElementRef<typeof PopoverPrimitive.Close>, PopoverCloseProps>(
  function Close(props, ref) {
    return <PopoverPrimitive.Close ref={ref} {...props} />;
  },
);
Close.displayName = 'Popover.Close';

export type PopoverArrowProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>;

/** Popover.Arrow — optional visual pointer back to the trigger. */
export const Arrow = forwardRef<ElementRef<typeof PopoverPrimitive.Arrow>, PopoverArrowProps>(
  function Arrow({ className, ...rest }, ref) {
    const classes = className ? `${styles.arrow} ${className}` : styles.arrow;
    return <PopoverPrimitive.Arrow ref={ref} className={classes} {...rest} />;
  },
);
Arrow.displayName = 'Popover.Arrow';

/** Popover — compound component (`Popover.Root`/`Trigger`/`Anchor`/`Content`/`Close`/`Arrow`),
 * D-018 auto-approve. Built on `@radix-ui/react-popover` for positioning/focus/dismissal. */
export const Popover = { Root, Trigger, Anchor, Content, Close, Arrow };
