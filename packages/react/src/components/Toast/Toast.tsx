'use client';

import { createContext, forwardRef, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ElementRef, ReactNode } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { IconButton } from '../IconButton/IconButton';
import styles from './Toast.module.css';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  /** Semantic tone — drives the accent bar + icon color via `toast.json` (`color.feedback.*`,
   * already-locked D-006 tokens, no new hue introduced). Default `'default'`. */
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. Default `5000` (matches Radix's own default and the D-018 brief's
   * "เวลาที่สมเหตุสมผล"). Pass `Infinity` for a toast that only dismisses via the close button or
   * `action`. */
  duration?: number;
  /** Optional secondary control (e.g. an "Undo" button) rendered next to the close button. Must
   * be a `Toast.Action`-compatible element — this library re-exports `ToastAction` below for that
   * purpose since Radix requires `altText` on it for a11y. */
  action?: ReactNode;
}

interface ToastRecord extends ToastOptions {
  id: string;
  open: boolean;
}

interface ToastContextValue {
  toasts: ToastRecord[];
  /** Queues a new toast and returns its id (usable with `dismiss`). */
  toast: (options: ToastOptions) => string;
  /** Dismisses a toast before its natural duration elapses. */
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let idCounter = 0;
const nextId = () => `toast-${++idCounter}-${Date.now()}`;

export interface ToastProviderProps {
  children?: ReactNode;
  /** Default auto-dismiss delay (ms) for toasts that don't specify their own `duration`. Default
   * `5000`. */
  duration?: number;
  /** Which screen corner/edge the stack renders in. Default `'bottom-right'`. */
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Author-localized label announced to screen readers for the toast landmark region (Radix). */
  label?: string;
}

/**
 * ToastProvider — mount once near the app root (BLUEPRINT §7 provider pattern). Wraps
 * `@radix-ui/react-toast`'s `Provider`+`Viewport` (swipe-to-dismiss, auto-dismiss pause-on-hover/
 * focus, and the `aria-live` announcer region all come from Radix per BLUEPRINT §7 — no hand-
 * rolled focus/timer logic here) and exposes `useToast()` to the rest of the tree via context so
 * any descendant component can trigger a toast without prop-drilling a callback down to it.
 * Stacking: new toasts are appended to the end of the internal array and the viewport is a plain
 * flex column, so the newest toast renders closest to the screen edge it entered from and pushes
 * earlier ones inward — the conventional stacking order most toast systems use.
 * z-index: `var(--ds-z-index-toast)` (1700, BLUEPRINT §4.8) — the highest layer in the system, so
 * a toast is never hidden behind a Dialog/Popover/Drawer that happens to be open at the same time.
 */
export function ToastProvider({ children, duration = 5000, placement = 'bottom-right', label }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, open: false } : t)));
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId();
    setToasts((prev) => [...prev, { ...options, id, open: true }]);
    return id;
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);
  const [side, align] = placement.split('-') as ['top' | 'bottom', 'left' | 'right'];

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider duration={duration} label={label}>
        {children}
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            className={styles.root}
            data-variant={t.variant ?? 'default'}
            open={t.open}
            duration={t.duration ?? duration}
            onOpenChange={(open) => {
              if (!open) {
                dismiss(t.id);
                // Let the exit animation (duration-fast) finish before unmounting from the DOM.
                window.setTimeout(() => removeToast(t.id), 150);
              }
            }}
          >
            <span className={styles.accent} aria-hidden="true" />
            <div className={styles.body}>
              {t.title && <ToastPrimitive.Title className={styles.title}>{t.title}</ToastPrimitive.Title>}
              {t.description && (
                <ToastPrimitive.Description className={styles.description}>
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
            {t.action}
            <ToastPrimitive.Close aria-label="Dismiss notification" className={styles.closeButton} asChild>
              <IconButton aria-label="Dismiss notification" size="sm" variant="ghost">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="14" height="14">
                  <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </IconButton>
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className={styles.viewport} data-side={side} data-align={align} />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
ToastProvider.displayName = 'ToastProvider';

/**
 * useToast — the hook every consumer calls to trigger a toast (`toast({ title, description,
 * variant, duration, action })`) or dismiss one early (`dismiss(id)`). Throws descriptively if
 * called outside `ToastProvider` rather than silently no-op-ing.
 */
export function useToast(): Pick<ToastContextValue, 'toast' | 'dismiss'> {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast() must be called inside a <ToastProvider>.');
  }
  return { toast: ctx.toast, dismiss: ctx.dismiss };
}

/**
 * Internal — Snackbar (Reuse Check, D-018) reads the raw toast list to enforce its own
 * single-instance semantics on top of the same provider/context rather than duplicating state.
 * Not part of the public API surface (not exported from the package barrel).
 */
export function useToastInternal(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast() must be called inside a <ToastProvider>.');
  }
  return ctx;
}

export type ToastActionElementProps = Parameters<typeof ToastPrimitive.Action>[0];

/**
 * ToastAction — re-exported Radix action button (e.g. "Undo") for use as a toast's `action` prop.
 * Radix requires `altText` (a screen-reader-only description of what the button does) since the
 * visible label alone ("Undo") may not carry enough context out of visual context.
 */
export const ToastAction = forwardRef<ElementRef<typeof ToastPrimitive.Action>, ToastActionElementProps>(
  function ToastAction({ className, ...rest }, ref) {
    const classes = className ? `${styles.action} ${className}` : styles.action;
    return <ToastPrimitive.Action ref={ref} className={classes} {...rest} />;
  },
);
ToastAction.displayName = 'ToastAction';
