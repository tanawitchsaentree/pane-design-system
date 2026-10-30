import { forwardRef, useId, useState } from 'react';
import * as RSl from '@radix-ui/react-slider';
import { cx } from '../../cx';
import sl from '../Slider/Slider.module.css';
import styles from './RangeSlider.module.css';
import { useMessages } from '../../i18n/context';

export interface RangeSliderProps {
  /** Visible label for the pair, such as Price; each bead is named from it, Price minimum and Price maximum. */
  label: string;
  /** The low and the high end, when you keep them yourself. */
  value?: [number, number];
  /** The low and the high end it starts with; the whole range by default. */
  defaultValue?: [number, number];
  /** Called with both ends on every change while dragging or pressing keys. */
  onValueChange?: (value: [number, number]) => void;
  /** Lowest value. Defaults to 0. */
  min?: number;
  /** Highest value. Defaults to 100. */
  max?: number;
  /** Step between values. Defaults to 1. */
  step?: number;
  /** How many steps must stay between the two beads, so the range never closes to nothing; 1 by default. */
  minGap?: number;
  /** Formats each end where it is shown and spoken, for example a function that adds a currency. */
  format?: (value: number) => string;
  /** Turns the control off, so neither bead can be focused or moved. */
  disabled?: boolean;
  /** Extra class on the wrapper. */
  className?: string;
}

/** Slider's carved channel with two beads, for a range such as a price from and to. The filled part runs
 *  between the beads and glows softly in dark like Slider's; each bead is its own slider for the keyboard
 *  and is named for its end. */
export const RangeSlider = forwardRef<HTMLSpanElement, RangeSliderProps>(function RangeSlider(
  { label, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, minGap = 1, format = String, disabled, className },
  ref,
) {
  const t = useMessages();
  const id = useId();
  const [inner, setInner] = useState<[number, number]>(defaultValue ?? [min, max]);
  const current = value ?? inner;
  const change = (v: number[]) => { const pair: [number, number] = [v[0], v[1]]; if (value === undefined) setInner(pair); onValueChange?.(pair); };
  return (
    <div className={cx(sl.root, className)} data-component="RangeSlider">
      <div className={sl.head}>
        <span id={`${id}-label`} className={sl.label}>{label}</span>
        <output className={cx(sl.value, styles.pair)} aria-hidden="true">{format(current[0])}<span className={styles.to}>{t.dateRangeTo}</span>{format(current[1])}</output>
      </div>
      <RSl.Root ref={ref} className={sl.slider} value={current} onValueChange={change} min={min} max={max} step={step} minStepsBetweenThumbs={minGap} disabled={disabled}>
        <RSl.Track className={sl.track}><RSl.Range className={sl.range} data-glow="soft" /></RSl.Track>
        <RSl.Thumb className={sl.thumb} aria-label={t.rangeMinimum(label)} aria-valuetext={format(current[0])} />
        <RSl.Thumb className={sl.thumb} aria-label={t.rangeMaximum(label)} aria-valuetext={format(current[1])} />
      </RSl.Root>
    </div>
  );
});
