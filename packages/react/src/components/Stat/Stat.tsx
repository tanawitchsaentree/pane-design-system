import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { Text } from '../Text/Text';
import { Icon } from '../Icon/Icon';
import styles from './Stat.module.css';

export type StatTrendDirection = 'up' | 'down' | 'neutral';

export interface StatTrend {
  /** Direction — drives both the trend row's color (`color.feedback.*` via `stat.json`, D-006)
   * and which icon glyph renders. Color is never the only cue: `up`/`down`/`neutral` each render a
   * genuinely different glyph shape (ascending diagonal+corner-arrowhead / descending
   * diagonal+corner-arrowhead / flat horizontal line) so the distinction survives forced-colors
   * and grayscale rendering, per D-001/D-006 accent-scarcity + non-color-cue rule. */
  direction: StatTrendDirection;
  /** The visible trend copy, e.g. `'+12% this month'`. Rendered as plain text next to the icon —
   * this string itself carries no direction semantics on its own, which is why the icon needs an
   * accessible `label` (see `TREND_LABEL` below) rather than being purely decorative. */
  value: string;
}

export interface StatProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Caption identifying what the value measures, e.g. `'Total revenue'`. Rendered above the
   * value via `Text` (quiet, `subtle` color) — never re-implemented as raw font styling. */
  label: string;
  /** The statistic itself, e.g. `'$12,450'`. Typed `ReactNode` (not `string`) so callers can hand
   * in pre-formatted markup (e.g. a `<Fragment>` mixing a currency symbol at a different weight)
   * without Stat needing to know about number-formatting concerns. */
  value: ReactNode;
  /** Optional up/down/neutral trend indicator rendered under the value. Omit entirely when there
   * is no comparison period to show. */
  trend?: StatTrend;
  /** Optional supporting copy under the trend (or under the value, if no trend is given), e.g.
   * `'Compared to last month'`. */
  description?: string;
}

const TREND_LABEL: Record<StatTrendDirection, string> = {
  up: 'Trending up',
  down: 'Trending down',
  neutral: 'No change',
};

/**
 * Trend glyphs — deliberately three *different* shapes (not the same arrow recolored), so the
 * up/down/neutral distinction is legible without color: an ascending diagonal line with its
 * corner-arrowhead at the top-right, a descending diagonal line with its corner-arrowhead at the
 * bottom-right, and a flat horizontal line with no diagonal or arrowhead at all for `neutral`.
 */
function TrendUpGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 11L6.5 7L9 9.5L13.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 5H13.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendDownGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 5L6.5 9L9 6.5L13.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11H13.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendNeutralGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 8H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const TREND_GLYPH: Record<StatTrendDirection, () => ReturnType<typeof TrendUpGlyph>> = {
  up: TrendUpGlyph,
  down: TrendDownGlyph,
  neutral: TrendNeutralGlyph,
};

/**
 * Stat — a single label + value + optional trend statistic tile (Wave 7 Data Display).
 * Rigor tier: **T1 static** (re-classified from the batch's default T2 label — see Stat.tsx's own
 * commit note / handoff for the reasoning). Stat has no `onClick`/`onChange` and no state that
 * changes in response to user action; the trend's color is a `data-direction` attribute driven
 * purely by the `trend` prop the caller passes in, not by any interaction Stat itself handles —
 * per ds-conventions's T1-vs-T2 boundary ("ไม่มี interactivity จริงเลย = T1"), that makes this a
 * display-only component like Badge/Skeleton, not an interactive one like Button/Card.
 * Anatomy: root `div` -> label (`Text`, subtle) -> value (`Text`, large/bold) -> optional trend
 * row (`Icon` + `Text`) -> optional description (`Text`, subtle).
 * Reuse Check: composes `Text` for every text role (label/value/trend/description) and `Icon` for
 * the trend glyph — no font styling or SVG-sizing is re-implemented here.
 * Value is rendered via `Text`, not `Heading` — deliberately: Stat is commonly repeated several
 * times in a row (e.g. a KPI tile grid) with no natural heading-level context of its own, so
 * injecting an `h1`-`h6` here would force every consumer to reason about document outline just to
 * drop a number on the page. A caller that specifically wants heading semantics for a given Stat's
 * value can still get them by wrapping their own `<Heading asChild>` around the `value` node they
 * pass in.
 * A11y: the trend icon is never purely decorative — it carries direction meaning the visible
 * `trend.value` string does not (e.g. `'+12%'` alone doesn't say which way is good), so it always
 * gets an accessible `label` (`'Trending up'`/`'Trending down'`/`'No change'`) via `Icon`'s own
 * `role="img"`/`aria-label` contract, per Icon.tsx's documented "icon carries meaning on its own"
 * case. No other implicit ARIA role is applied — Stat is static content, not a live region; a
 * caller polling/streaming a Stat's value should wrap it in their own live region, same guidance
 * Badge already gives for the same reason.
 */
export const Stat = forwardRef<ElementRef<'div'>, StatProps>(function Stat(
  { label, value, trend, description, className, ...rest },
  ref,
) {
  const classes = className ? `${styles.stat} ${className}` : styles.stat;
  const TrendGlyph = trend ? TREND_GLYPH[trend.direction] : null;

  return (
    <div ref={ref} className={classes} {...rest}>
      <Text size="sm" weight="medium" color="subtle" className={styles.label}>
        {label}
      </Text>
      <Text size="3xl" weight="bold" color="default" className={styles.value}>
        {value}
      </Text>
      {trend && TrendGlyph && (
        <span className={styles.trendRow} data-direction={trend.direction}>
          <Icon size="sm" label={TREND_LABEL[trend.direction]}>
            <TrendGlyph />
          </Icon>
          <Text asChild size="sm" weight="medium" color="subtle">
            <span>{trend.value}</span>
          </Text>
        </span>
      )}
      {description && (
        <Text size="sm" color="subtle" className={styles.description}>
          {description}
        </Text>
      )}
    </div>
  );
});

Stat.displayName = 'Stat';
