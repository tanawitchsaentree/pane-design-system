'use client';

import { useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { useToastInternal } from '../Toast/Toast';

/**
 * Snackbar — Reuse Check (D-018): implemented as a thin wrapper around the SAME `ToastProvider`/
 * context Toast already provides (`useToastInternal`), NOT a separate provider/portal/viewport.
 * Judgment call: a fully independent Snackbar component would duplicate every piece of Toast's
 * infrastructure (Radix provider, portal, viewport, auto-dismiss timer, swipe-to-dismiss) for a
 * component whose only real difference from Toast is usage convention — so `useSnackbar()`
 * reuses `useToast()`'s underlying `toast`/`dismiss` machinery and layers two API differences on
 * top, matching the brief's "message เดียว ไม่ stack หลายใบพร้อมกัน":
 *   1. No `title` — a snackbar is "message สั้นบรรทัดเดียว" (renders through `description` only).
 *   2. Single-instance: calling `show()` again while a previous snackbar-shown toast is still open
 *      dismisses that previous one first, so at most one snackbar-triggered toast is ever visible
 *      at a time (a plain Toast triggered elsewhere in the app is untouched — this only tracks
 *      instances created via THIS hook, so mixing Toast and Snackbar in the same app is safe).
 * Still requires a `ToastProvider` ancestor (the same one Toast uses) — there is no separate
 * `SnackbarProvider` to mount.
 */
export interface SnackbarOptions {
  /** Single-line message — the entire point of a snackbar (no separate title, unlike Toast). */
  message: ReactNode;
  /** At most one secondary action (e.g. "Retry"), consistent with the brief's "action เดียว". */
  action?: ReactNode;
  /** Auto-dismiss delay in ms. Default `5000` (same default as Toast/Radix). */
  duration?: number;
}

export function useSnackbar(): { show: (options: SnackbarOptions) => void; hide: () => void } {
  const { toast, dismiss } = useToastInternal();
  const currentIdRef = useRef<string | null>(null);

  const show = useCallback(
    ({ message, action, duration }: SnackbarOptions) => {
      if (currentIdRef.current) {
        dismiss(currentIdRef.current);
      }
      currentIdRef.current = toast({ description: message, action, duration, variant: 'default' });
    },
    [toast, dismiss],
  );

  const hide = useCallback(() => {
    if (currentIdRef.current) {
      dismiss(currentIdRef.current);
      currentIdRef.current = null;
    }
  }, [dismiss]);

  return { show, hide };
}
