'use client';

import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import styles from './Tooltip.module.css';

export interface TooltipProviderProps {
  /** Delay (ms) before the tooltip opens on hover. Radix default 700ms; kept as the default here
   * too — no evidence to override it. */
  delayDuration?: number;
  /** Once any tooltip has opened, how long (ms) a subsequent tooltip skips the delay when moving
   * between trigger elements. Radix default 300ms. */
  skipDelayDuration?: number;
  children?: ReactNode;
}

/**
 * Tooltip.Provider — required ancestor for every `Tooltip.Root` in a subtree (Radix requirement —
 * shares hover-intent timing across sibling tooltips). Mount once near the app root; wrapping it
 * again around an individual story/demo (as this wave's stories do) is harmless.
 */
export function Provider({ children, ...rest }: TooltipProviderProps) {
  return <TooltipPrimitive.Provider {...rest}>{children}</TooltipPrimitive.Provider>;
}
Provider.displayName = 'Tooltip.Provider';

export interface TooltipRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Per-instance override of `Provider`'s `delayDuration`. */
  delayDuration?: number;
  children?: ReactNode;
}

/**
 * Tooltip.Root — non-visual state provider (Radix `Tooltip`). D-002 web-first: hover is a
 * first-class trigger here (Radix's default — no mobile-first "tap only" adaptation needed per
 * D-002's explicit carve-out for Tooltip). Radix also opens on keyboard focus for free, so the
 * hover-first stance never leaves keyboard users without access to the hint.
 */
export function Root({ children, ...rest }: TooltipRootProps) {
  return <TooltipPrimitive.Root {...rest}>{children}</TooltipPrimitive.Root>;
}
Root.displayName = 'Tooltip.Root';

export type TooltipTriggerProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>;

/** Tooltip.Trigger — the element the hint is attached to (hover/focus, borrowed from Radix). */
export const Trigger = forwardRef<ElementRef<typeof TooltipPrimitive.Trigger>, TooltipTriggerProps>(
  function Trigger(props, ref) {
    return <TooltipPrimitive.Trigger ref={ref} {...props} />;
  },
);
Trigger.displayName = 'Tooltip.Trigger';

export interface TooltipContentProps
  extends Omit<ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, 'side'> {
  side?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Tooltip.Content — the hint bubble. Deliberately small and shadow-free (no `shadow.elevation` —
 * D-018 brief: a tooltip is "a text hint บางๆ", not a floating panel that needs elevation weight;
 * `role.neutral.solid` + `text.onRoleSolid` (tooltip.json) already gives it enough visual pop
 * against any background without a shadow).
 * A11y: Radix renders this as `role="tooltip"`, associated to the trigger via `aria-describedby`,
 * and dismisses on Escape/trigger-blur automatically (BLUEPRINT §7 — no hand-rolled dismissal).
 */
export const Content = forwardRef<ElementRef<typeof TooltipPrimitive.Content>, TooltipContentProps>(
  function Content({ side = 'top', sideOffset = 6, className, children, ...rest }, ref) {
    const classes = className ? `${styles.content} ${className}` : styles.content;
    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content ref={ref} side={side} sideOffset={sideOffset} className={classes} {...rest}>
          {children}
          <TooltipPrimitive.Arrow className={styles.arrow} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  },
);
Content.displayName = 'Tooltip.Content';

/** Tooltip — compound component (`Tooltip.Provider`/`Root`/`Trigger`/`Content`), D-018
 * auto-approve. Built on `@radix-ui/react-tooltip`. */
export const Tooltip = { Provider, Root, Trigger, Content };
