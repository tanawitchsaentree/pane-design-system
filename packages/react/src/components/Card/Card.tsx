'use client';

import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode, Ref } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { AspectRatio } from '../AspectRatio/AspectRatio';
import type { AspectRatioProps } from '../AspectRatio/AspectRatio';
import styles from './Card.module.css';

/**
 * Card — pulled ahead of its catalog slot (was scheduled for a later wave) because
 * `examples/demo-app/src/App.tsx`'s GAP #1 comment shows a real settings page that had to fall
 * back to `Stack` + `Divider` for section grouping with no bordered/elevated container available.
 * Rigor Tier T2 (interactive but no keyboard/focus/overlay complexity of its own — the clickable
 * variant borrows 100% of its keyboard/focus behavior from the native `<button>`/`<a>` element it
 * renders, the same way `Button`/`Link` already do, so there is no focus trap/roving
 * tabindex/portal for this component to prove via Playwright the way Dialog/Popover/Listbox must).
 *
 * D-008 is the single most important constraint on this file: "ห้ามมี drop-shadow ตกแต่งบน
 * card/button/input ปกติ ... shadow สงวนไว้เฉพาะ layer ที่ต้อง 'ลอยจริง' เท่านั้น (modal, popover,
 * toast)". Card sits IN the page flow next to sibling content — it never floats above it — so
 * unlike `dialog.json`/`popover.json`/`toast.json` (which legitimately reference
 * `shadow.elevation.*`), `card.json` has zero shadow tokens. Definition comes entirely from
 * `border.hairline` + a `surface.raised` fill one step lighter than `surface.canvas`, the same
 * "quiet, non-floating panel" language `Fieldset`'s root and `Listbox`'s root already use.
 *
 * Reuse Check (component-engineer.md step 0): grepped `packages/react/src/components/` — no
 * existing component provides bordered/sectioned content grouping with an optional single click
 * target. `RadioCards.Item` is the closest visual precedent (a bordered, clickable card) but is
 * scoped to the "choose 1 of N" radio-group behavior (D-023) and is not reusable as a general
 * content container. `AspectRatio` (Wave 1, D-012) IS reused directly by `Card.Media` below instead
 * of re-implementing ratio math.
 *
 * Anatomy: `Card.Root` (the bordered/radius'd/`overflow: hidden` box) -> any combination of
 * `Card.Media` (edge-to-edge, no padding, first child for a "cover image" layout) / `Card.Header`
 * (padded, bottom hairline, meant for a title + trailing actions row) / `Card.Body` (padded, the
 * main content, flexes to fill remaining space) / `Card.Footer` (padded, top hairline, meant for
 * actions/metadata) — order and presence of the sections is entirely up to the caller (none of them
 * are required, matching `Dialog.Title`/`Dialog.Description` being optional slots rather than a
 * fixed template).
 *
 * A11y (clickable card): the whole-card-is-a-click-target case ("การ์ดสินค้าที่คลิกไปหน้า detail")
 * is solved the same way `Button.tsx`'s `asChild` is — NOT by adding `onClick` to a `<div>` (which
 * is invisible to the keyboard and to assistive tech's "this is actionable" signal). `clickable`
 * (without `asChild`) renders a real native `<button type="button">` wrapping the whole card, which
 * gets Enter/Space activation, a `button` accessible role, and focus-visibility for free from the
 * browser — zero hand-written keyboard code, per BLUEPRINT §7. `clickable` + `asChild` lets the
 * caller supply an `<a href>` (or a framework router `Link`) instead, for the "navigates to a detail
 * page" case specifically, so the card is a real link, not a button that happens to navigate.
 */
export interface CardRootProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Render as the single child element instead of `div`/`button` (Radix-style polymorphism, same
   * contract as `Button`/`Box`/`Link`) — pass an `<a href>` (or a router `Link`) here for a card
   * that navigates to another page, so the whole card is a real anchor, not a `div` with a click
   * handler bolted onto it.
   */
  asChild?: boolean;
  /**
   * Makes the entire card a single click target (e.g. a product card that opens a detail page, or
   * a selectable summary card). Reuses `Button`'s native-element approach instead of inventing new
   * click-target logic: renders a native `<button type="button">` wrapping every section
   * (`Header`/`Body`/`Footer`/`Media`) — or, combined with `asChild`, lets the caller supply an
   * `<a href>` for the navigating-card case. A non-clickable Card (`clickable` omitted/`false`, the
   * default) renders a plain `div`: no role, no tabIndex, nothing implying interactivity. Default
   * `false`.
   */
  clickable?: boolean;
  /**
   * Disables a clickable card via the underlying `<button>`'s native `disabled` (removes it from
   * the tab order, like any other disabled control). Ignored when `clickable` is `false`, and has
   * no effect when combined with `asChild` — an `<a>` has no native `disabled` attribute, the same
   * limitation `Link` doesn't attempt to paper over either; disable that case by conditionally
   * omitting `href`/the click handler instead. Default `false`.
   */
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * Card.Root — the bordered/radius'd container. `overflow: hidden` so `Card.Media` placed first
 * clips to the root's own `radius.lg` corners for free, without `Card.Media` needing its own
 * radius token.
 */
export const CardRoot = forwardRef<ElementRef<'div'>, CardRootProps>(function CardRoot(
  { asChild = false, clickable = false, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = className ? `${styles.card} ${className}` : styles.card;
  const sharedProps = {
    className: classes,
    'data-clickable': clickable ? '' : undefined,
    ...rest,
  };

  if (asChild) {
    return (
      <Slot ref={ref} {...sharedProps}>
        {children}
      </Slot>
    );
  }

  if (clickable) {
    // Card.Root's declared props (`ComponentPropsWithoutRef<'div'>`) cover the common
    // non-clickable case; a clickable card renders a `<button>` instead, whose DOM prop surface
    // (e.g. `disabled`, event handler element-generic types) is a strict subset of what a `div`
    // accepts for everything this component actually forwards (`onClick`, `aria-*`, `data-*`,
    // `className`, `style`) — cast once here rather than widening `CardRootProps` itself, same
    // trade-off `Button`'s own `asChild` ref typing already accepts in this system.
    const buttonProps = sharedProps as unknown as ComponentPropsWithoutRef<'button'>;
    return (
      <button
        ref={ref as unknown as Ref<ElementRef<'button'>>}
        type="button"
        disabled={disabled}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }

  return (
    <div ref={ref} {...sharedProps}>
      {children}
    </div>
  );
});
CardRoot.displayName = 'Card.Root';

export interface CardSectionProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
}

/** Card.Header — padded section with a bottom hairline, meant for a title plus trailing actions
 * (e.g. `<Heading level={3}>…</Heading>` + an `IconButton` menu trigger) laid out with `Flex`. */
export const CardHeader = forwardRef<ElementRef<'div'>, CardSectionProps>(function CardHeader(
  { className, ...rest },
  ref,
) {
  const classes = className ? `${styles.header} ${className}` : styles.header;
  return <div ref={ref} className={classes} {...rest} />;
});
CardHeader.displayName = 'Card.Header';

/** Card.Body — padded main-content section, flexes to fill the remaining space so
 * `Card.Footer`/`Card.Header` stay pinned to the edges of an otherwise fixed-height card (e.g. a
 * grid of equal-height cards). */
export const CardBody = forwardRef<ElementRef<'div'>, CardSectionProps>(function CardBody(
  { className, ...rest },
  ref,
) {
  const classes = className ? `${styles.body} ${className}` : styles.body;
  return <div ref={ref} className={classes} {...rest} />;
});
CardBody.displayName = 'Card.Body';

/** Card.Footer — padded section with a top hairline, meant for actions/metadata pinned to the
 * bottom of the card. */
export const CardFooter = forwardRef<ElementRef<'div'>, CardSectionProps>(function CardFooter(
  { className, ...rest },
  ref,
) {
  const classes = className ? `${styles.footer} ${className}` : styles.footer;
  return <div ref={ref} className={classes} {...rest} />;
});
CardFooter.displayName = 'Card.Footer';

export interface CardMediaProps extends Omit<AspectRatioProps, 'ratio'> {
  /**
   * Optional fixed ratio — reuses Wave 1's `AspectRatio` (D-012) directly instead of Card
   * re-implementing ratio math. Omit to let the media size itself naturally (e.g. an image that
   * already has an intrinsic/CSS-controlled height).
   */
  ratio?: AspectRatioProps['ratio'];
  children?: ReactNode;
}

/**
 * Card.Media — edge-to-edge section (no padding) for a cover image or profile picture. Place it
 * first among `Card.Root`'s children for the common "image on top" layout; for "image on the
 * side", put `Card.Media` and `Card.Body` as siblings inside a `Flex` (Wave 1) instead of adding a
 * new orientation prop here — Card doesn't own row/column layout, `Flex` already does.
 * Clips to `Card.Root`'s own corner radius via the root's `overflow: hidden`, so this component
 * carries no radius token of its own. When a `ratio` is given, wraps `AspectRatio`, whose own CSS
 * (`AspectRatio.module.css`) absolutely-positions and fills the single child — so an `<img>` (or
 * this library's own `Image`) passed as `children` fills the frame; without `ratio`, children are
 * rendered as-is and expected to size themselves (e.g. a fixed-height `<img>`).
 */
export const CardMedia = forwardRef<ElementRef<'div'>, CardMediaProps>(function CardMedia(
  { ratio, className, children, ...rest },
  ref,
) {
  const classes = className ? `${styles.media} ${className}` : styles.media;

  if (ratio === undefined) {
    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <AspectRatio ref={ref} ratio={ratio} className={classes} {...rest}>
      {children}
    </AspectRatio>
  );
});
CardMedia.displayName = 'Card.Media';

/**
 * Card — compound component (`Card.Root`/`Header`/`Body`/`Footer`/`Media`), same shape as
 * `Dialog`/`Popover` (`export const X = { Root, ... }`). No BATCH API REVIEW checkpoint for this
 * one-off pull-forward (auto-approved per the same D-013/D-015/D-018 pattern used for every other
 * wave in this system) — API decisions documented inline above instead.
 */
export const Card = { Root: CardRoot, Header: CardHeader, Body: CardBody, Footer: CardFooter, Media: CardMedia };
