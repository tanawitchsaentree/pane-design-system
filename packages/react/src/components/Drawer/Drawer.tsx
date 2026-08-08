'use client';

import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconButton } from '../IconButton/IconButton';
import styles from './Drawer.module.css';

export type DrawerPlacement = 'left' | 'right' | 'bottom';

export interface DrawerRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children?: ReactNode;
}

/**
 * Drawer.Root — Reuse Check (D-018): a Drawer is the exact same `@radix-ui/react-dialog` state
 * machine as `Dialog.Root` (focus trap/portal/Escape/inert-background all identical) — the ONLY
 * difference between Dialog and Drawer in this system is the CSS entrance/exit animation
 * (Drawer.module.css slides from an edge instead of scaling from center). D-017 folds the old
 * Sheet/BottomSheet role into this component as `placement="bottom"` rather than shipping a
 * separate component.
 */
export function Root({ children, ...rest }: DrawerRootProps) {
  return <DialogPrimitive.Root {...rest}>{children}</DialogPrimitive.Root>;
}
Root.displayName = 'Drawer.Root';

export type DrawerTriggerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;

export const Trigger = forwardRef<ElementRef<typeof DialogPrimitive.Trigger>, DrawerTriggerProps>(
  function Trigger(props, ref) {
    return <DialogPrimitive.Trigger ref={ref} {...props} />;
  },
);
Trigger.displayName = 'Drawer.Trigger';

export interface DrawerContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Which viewport edge the panel slides in from. Default `'right'`. */
  placement?: DrawerPlacement;
  closeLabel?: string;
  hideCloseButton?: boolean;
}

/**
 * Drawer.Content — same overlay/content/portal shape as `Dialog.Content` (D-018 Reuse Check), but
 * `data-placement` drives a translate-based slide-in animation instead of Dialog's center-scale
 * (Drawer.module.css). `left`/`right` panels are full-height and fixed-width; `bottom` (the old
 * Sheet/BottomSheet role, D-017) is full-width and height-capped, matching how a bottom sheet is
 * conventionally sized. Reuses `IconButton` for the close control exactly like Dialog (D-002
 * touch-target consistency across every overlay's close affordance).
 */
export const Content = forwardRef<ElementRef<typeof DialogPrimitive.Content>, DrawerContentProps>(
  function Content(
    { placement = 'right', closeLabel = 'Close drawer', hideCloseButton = false, className, children, ...rest },
    ref,
  ) {
    const classes = className ? `${styles.content} ${className}` : styles.content;

    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.overlay} />
        <DialogPrimitive.Content ref={ref} className={classes} data-placement={placement} {...rest}>
          {!hideCloseButton && (
            <DialogPrimitive.Close asChild className={styles.closeButton}>
              <IconButton aria-label={closeLabel} size="sm" variant="ghost">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="16" height="16">
                  <path
                    d="M3 3L13 13M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </IconButton>
            </DialogPrimitive.Close>
          )}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);
Content.displayName = 'Drawer.Content';

export type DrawerTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

export const Title = forwardRef<ElementRef<typeof DialogPrimitive.Title>, DrawerTitleProps>(
  function Title({ className, ...rest }, ref) {
    const classes = className ? `${styles.title} ${className}` : styles.title;
    return <DialogPrimitive.Title ref={ref} className={classes} {...rest} />;
  },
);
Title.displayName = 'Drawer.Title';

export type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

export const Description = forwardRef<ElementRef<typeof DialogPrimitive.Description>, DrawerDescriptionProps>(
  function Description({ className, ...rest }, ref) {
    const classes = className ? `${styles.description} ${className}` : styles.description;
    return <DialogPrimitive.Description ref={ref} className={classes} {...rest} />;
  },
);
Description.displayName = 'Drawer.Description';

export type DrawerCloseProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

export const Close = forwardRef<ElementRef<typeof DialogPrimitive.Close>, DrawerCloseProps>(
  function Close(props, ref) {
    return <DialogPrimitive.Close ref={ref} {...props} />;
  },
);
Close.displayName = 'Drawer.Close';

/** Drawer — compound component (`Drawer.Root`/`Trigger`/`Content`/`Title`/`Description`/`Close`),
 * D-018 auto-approve, D-017 folds Sheet/BottomSheet into `placement="bottom"`. */
export const Drawer = { Root, Trigger, Content, Title, Description, Close };
