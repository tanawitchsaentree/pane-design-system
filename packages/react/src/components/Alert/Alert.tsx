import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { IconButton } from '../IconButton/IconButton';
import styles from './Alert.module.css';

export type AlertVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Default icon per variant (braun-flat non-color-cue rule: variants must stay distinguishable
 * without color, e.g. `forced-colors`/grayscale, so each variant gets a genuinely different
 * glyph — not just a re-tinted copy of the same shape). Only used when the caller doesn't pass
 * an explicit `icon` prop. All paths are 16x16 view-boxes drawn with `currentColor` so they pick
 * up `variant.*.accent`/`titleText` via the `.icon` CSS rule below — no icon set dependency
 * (Reuse Check: this repo ships no icon set, per Icon.tsx's own doc comment, so Alert draws its
 * own small inline set exactly like Toast/Dialog/Drawer/Checkbox/Rating/RadioCards already do).
 */
const DEFAULT_ICONS: Record<AlertVariant, ReactNode> = {
  // Info-style filled circle with a dot — the "no particular feedback" neutral case.
  default: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="5.25" r="0.9" fill="currentColor" />
      <path d="M8 7.75V11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Checkmark in a circle.
  success: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.25 8.25L7.25 10.25L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Exclamation triangle — distinct silhouette (not a circle) so shape alone separates it.
  warning: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2.25L14.25 13.25H1.75L8 2.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6.5V9.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.25" r="0.9" fill="currentColor" />
    </svg>
  ),
  // Octagon (stop-sign silhouette) with an X — distinct from both circle and triangle.
  danger: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.5 1.75H10.5L14.25 5.5V10.5L10.5 14.25H5.5L1.75 10.5V5.5L5.5 1.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6 6L10 10M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Square with an "i" — distinct silhouette from the neutral default's circle.
  info: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="5.25" r="0.9" fill="currentColor" />
      <path d="M8 7.75V11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export interface AlertProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Semantic tone (D-006 roles, reused 1:1 from Toast's `variant.*` + Badge's `role.*` tokens —
   * no new hue). Drives the accent bar, tinted background, and default icon glyph. Default
   * `'default'` (neutral, "no particular feedback" — matches Toast's own `'default'` meaning). */
  variant?: AlertVariant;
  /** Heading. Optional — a description-only alert (no title) is valid for a short one-line
   * message. `Omit<'title'>` on the native div props above — Alert's `title` is display content
   * (a `ReactNode`), not the native HTML `title` tooltip attribute (a `string`). */
  title?: ReactNode;
  /**
   * Icon slot. Defaults to a variant-specific glyph (see `DEFAULT_ICONS`) so every variant stays
   * visually distinct even without color (braun-flat non-color-cue rule — verify by imagining
   * the screen in grayscale: circle+check vs triangle vs octagon+X vs square+i vs circle+dot are
   * still four/five different silhouettes). Pass `null` to omit the icon slot entirely, or any
   * other node to override the default glyph.
   */
  icon?: ReactNode;
  /** Body content (description). */
  children?: ReactNode;
  /** Shows a close button when `true`. Default `false`. */
  dismissible?: boolean;
  /** Called when the close button is activated. Required when `dismissible` is `true` — Alert
   * has no internal open/closed state of its own (unlike Toast's provider-managed stack), the
   * caller owns visibility, matching a plain static block with no portal/animation machinery. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. Default `'Dismiss alert'`. */
  dismissLabel?: string;
}

/**
 * Alert — persistent, in-flow feedback banner (Wave 7 Data Display). T2 rigor tier: interactive
 * only in the trivial "has a native `<button>`" sense (the dismiss control) — no focus trap, no
 * roving tabindex, no overlay/portal, so no conformance spec (Playwright)/Gate Proof mutation is
 * required for it (see ds-conventions/SKILL.md Rigor Tiers table).
 * Reuse Check (component-engineer.md item 0): grepped `packages/react/src/components/` — no
 * existing component owns this anatomy. Toast/Snackbar are transient + portal-rendered + auto-
 * dismissing (wrong shape for "stays inline until the page/data changes"); Badge is a tiny
 * single-line label with no title/description/dismiss slots. Built as a new, single (non-
 * compound) component per the brief — its internal structure is simpler than Card/Dialog's
 * multi-slot compound API and doesn't need one.
 * Anatomy: root `div` (role="alert", border + variant-tinted background, `border-inline-start`
 * accent bar per braun-flat/D-008 "hairline replaces decorative shadow for definition" — no
 * `shadow.elevation.*` here since Alert is a static in-flow block, not a floating layer) -> icon
 * slot -> body (title + description) -> optional dismiss button (plain `IconButton`, not a
 * Radix/React Aria primitive — a close button has no special keyboard contract beyond what a
 * native `<button>` already provides, same reasoning D-023 item 1 applies to native form
 * controls).
 * A11y: `role="alert"` (implicit `aria-live="assertive"` + `aria-atomic="true"` per the ARIA
 * spec) so assistive tech announces the message when it mounts — appropriate for Alert's
 * "important, needs attention now" positioning (distinct from Toast's own `aria-live` region,
 * which is deliberately less interruptive). The dismiss button carries its own
 * `dismissLabel`/`aria-label` since it has no visible text.
 */
export const Alert = forwardRef<ElementRef<'div'>, AlertProps>(function Alert(
  {
    variant = 'default',
    title,
    icon,
    children,
    dismissible = false,
    onDismiss,
    dismissLabel = 'Dismiss alert',
    className,
    ...rest
  },
  ref,
) {
  const classes = className ? `${styles.alert} ${className}` : styles.alert;
  const resolvedIcon = icon === undefined ? DEFAULT_ICONS[variant] : icon;

  return (
    <div ref={ref} className={classes} data-variant={variant} role="alert" {...rest}>
      {resolvedIcon !== null && <span className={styles.icon}>{resolvedIcon}</span>}
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        {children && <div className={styles.description}>{children}</div>}
      </div>
      {dismissible && (
        <IconButton
          aria-label={dismissLabel}
          size="sm"
          variant="ghost"
          className={styles.closeButton}
          onClick={onDismiss}
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="14" height="14">
            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </IconButton>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';
