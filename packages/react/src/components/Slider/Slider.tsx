import { forwardRef, useId, useState } from 'react';
import * as RSl from '@radix-ui/react-slider';
import { cx } from '../../cx';
import styles from './Slider.module.css';

// Behaviour (role slider, Arrow/Page/Home/End, pointer drag, aria-valuenow) is Radix's. This file only
// adds the Pane look and a visible label with the current value. Two looks share that behaviour:
// `channel`, a carved channel with a bead, and `fill`, a bar the hand holds whole, with the label and
// value inside it and the value shown as chosen glass (D-026).

export interface SliderProps {
  /** Visible label, also the slider's accessible name. */
  label: string;
  /** Controlled value. */
  value?: number;
  /** Starting value when uncontrolled. */
  defaultValue?: number;
  /** Called on every change while dragging or pressing keys. */
  onValueChange?: (value: number) => void;
  /** Lowest value. Defaults to 0. */
  min?: number;
  /** Highest value. Defaults to 100. */
  max?: number;
  /** Step between values. Defaults to 1. */
  step?: number;
  /** Formats the value shown next to the label and spoken by screen readers, for example a function that adds a unit. */
  format?: (value: number) => string;
  /** `channel` (default) is a thin carved channel with a bead, for forms and players. `fill` is a 56px bar
   *  with the label and value inside, for quick settings stacked in a panel, such as brightness or a timer. */
  variant?: 'channel' | 'fill';
  /** Native-like disabled behaviour. */
  disabled?: boolean;
  /** Extra class on the wrapper. */
  className?: string;
}

export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  { label, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, format = String, variant = 'channel', disabled, className },
  ref,
) {
  const id = useId();
  const [inner, setInner] = useState(defaultValue ?? min);
  const current = value ?? inner;
  const change = ([v]: number[]) => { if (value === undefined) setInner(v); onValueChange?.(v); };
  if (variant === 'fill') return (
    <RSl.Root ref={ref} className={cx(styles.fill, className)} data-component="Slider" data-variant="fill" value={[current]} onValueChange={change} min={min} max={max} step={step} disabled={disabled}>
      <RSl.Track className={styles.fillTrack}><RSl.Range className={styles.fillRange} /></RSl.Track>
      <span className={styles.fillText} aria-hidden="true">
        <span id={`${id}-label`} className={styles.fillLabel}>{label}</span>
        <output className={styles.fillValue}>{format(current)}</output>
      </span>
      <RSl.Thumb className={styles.fillThumb} data-glow="mark" aria-label={label} aria-valuetext={format(current)} />
    </RSl.Root>
  );
  return (
    <div className={cx(styles.root, className)} data-component="Slider">
      <div className={styles.head}>
        <span id={`${id}-label`} className={styles.label}>{label}</span>
        <output className={styles.value} aria-hidden="true">{format(current)}</output>
      </div>
      <RSl.Root ref={ref} className={styles.slider} value={[current]} onValueChange={change} min={min} max={max} step={step} disabled={disabled}>
        <RSl.Track className={styles.track}><RSl.Range className={styles.range} data-glow="soft" /></RSl.Track>
        <RSl.Thumb className={styles.thumb} aria-labelledby={`${id}-label`} aria-valuetext={format(current)} />
      </RSl.Root>
    </div>
  );
});
