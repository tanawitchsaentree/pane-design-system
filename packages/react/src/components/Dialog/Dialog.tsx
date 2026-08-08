'use client';

import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconButton } from '../IconButton/IconButton';
import styles from './Dialog.module.css';

export type DialogSize = 'sm' | 'md' | 'lg' | 'full';

export interface DialogRootProps {
  /** Controlled open state. Omit + use `defaultOpen` for uncontrolled usage (BLUEPRINT §7). */
  open?: boolean;
  /** Initial open state for uncontrolled usage. Default `false`. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Renders a non-modal dialog (no focus trap/inert background) when `false`. Default `true` —
   * a Dialog is a blocking modal by definition; set `false` only for the rare "modeless panel"
   * case (Popover/Drawer with `modal=false` cover the common non-blocking overlay needs). */
  modal?: boolean;
  children?: ReactNode;
}

/**
 * Dialog.Root — non-visual state provider (Radix `Dialog`). Focus trap, portal, Escape-to-close,
 * and inert-background-while-open all come from `@radix-ui/react-dialog` per BLUEPRINT §7 ("ห้าม
 * เขียน focus trap ... เอง") — this file supplies only the token-driven visual layer.
 */
export function Root({ children, ...rest }: DialogRootProps) {
  return <DialogPrimitive.Root {...rest}>{children}</DialogPrimitive.Root>;
}
Root.displayName = 'Dialog.Root';

export type DialogTriggerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;

export const Trigger = forwardRef<ElementRef<typeof DialogPrimitive.Trigger>, DialogTriggerProps>(
  function Trigger(props, ref) {
    return <DialogPrimitive.Trigger ref={ref} {...props} />;
  },
);
Trigger.displayName = 'Dialog.Trigger';

export interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** t-shirt width preset (D-018). `'full'` fills the viewport (mobile-sheet-like full screen).
   * Default `'md'`. */
  size?: DialogSize;
  /**
   * Accessible label for the close button (D-002 §touch target: reuses `IconButton`, Wave 2, so
   * the close control automatically gets the 40-64px `size.control.*` hit target instead of a
   * hand-rolled small icon button). Default `'Close dialog'`.
   */
  closeLabel?: string;
  /** Hides the built-in close button — use when the dialog provides its own explicit action
   * buttons instead (e.g. a confirmation dialog with Cancel/Confirm and no top-right X). Default
   * `false`. */
  hideCloseButton?: boolean;
}

/**
 * Dialog.Content — the modal panel. Two-layer render (`DialogPrimitive.Overlay` for the
 * `overlay.scrim` backdrop + `DialogPrimitive.Content` for the panel itself), both inside a
 * `DialogPrimitive.Portal` (Radix default). `shadow.elevation.lg` — the heaviest permitted
 * elevation in the system (braun-flat rule 2: modal is the "most floating" layer) — plus
 * `z-index: var(--ds-z-index-modal)` (1400, BLUEPRINT §4.8).
 * Anatomy: root `div[role=dialog]` (Radix) -> optional close `IconButton` (top-right) -> caller
 * content (expected to include `Dialog.Title` + optionally `Dialog.Description`).
 * A11y: Radix requires a `Dialog.Title` descendant for the dialog's accessible name — if a caller
 * needs a visually-hidden title they should wrap it in this library's `VisuallyHidden`, not omit
 * it, since Radix's own dev-mode warning exists specifically to catch a missing accessible name.
 */
export const Content = forwardRef<ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  function Content(
    { size = 'md', closeLabel = 'Close dialog', hideCloseButton = false, className, children, ...rest },
    ref,
  ) {
    const classes = className ? `${styles.content} ${className}` : styles.content;

    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.overlay} />
        <DialogPrimitive.Content ref={ref} className={classes} data-size={size} data-ds-surface {...rest}>
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
Content.displayName = 'Dialog.Content';

export type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

export const Title = forwardRef<ElementRef<typeof DialogPrimitive.Title>, DialogTitleProps>(
  function Title({ className, ...rest }, ref) {
    const classes = className ? `${styles.title} ${className}` : styles.title;
    return <DialogPrimitive.Title ref={ref} className={classes} {...rest} />;
  },
);
Title.displayName = 'Dialog.Title';

export type DialogDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

export const Description = forwardRef<ElementRef<typeof DialogPrimitive.Description>, DialogDescriptionProps>(
  function Description({ className, ...rest }, ref) {
    const classes = className ? `${styles.description} ${className}` : styles.description;
    return <DialogPrimitive.Description ref={ref} className={classes} {...rest} />;
  },
);
Description.displayName = 'Dialog.Description';

export type DialogCloseProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

export const Close = forwardRef<ElementRef<typeof DialogPrimitive.Close>, DialogCloseProps>(
  function Close(props, ref) {
    return <DialogPrimitive.Close ref={ref} {...props} />;
  },
);
Close.displayName = 'Dialog.Close';

/** Dialog — compound component (`Dialog.Root`/`Trigger`/`Content`/`Title`/`Description`/`Close`),
 * D-018 auto-approve. Built on `@radix-ui/react-dialog`. Reused as-is by `Drawer` (same primitive,
 * different CSS entrance/exit animation — see Drawer.tsx). */
export const Dialog = { Root, Trigger, Content, Title, Description, Close };
