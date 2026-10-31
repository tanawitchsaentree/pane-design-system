import { forwardRef, useId } from 'react';
import * as RG from '@radix-ui/react-toggle-group';
import { cx } from '../../cx';
import styles from './SegmentedControl.module.css';

export interface SegmentedOption { value: string; label: string; disabled?: boolean }

export interface SegmentedControlProps {
  /** The setting it switches, read as its accessible name, such as View or Units. */
  label: string;
  /** Two to five modes. */
  options: SegmentedOption[];
  /** The chosen mode. */
  value?: string;
  /** The starting mode when uncontrolled. */
  defaultValue?: string;
  /** Called when the mode changes. A mode is always chosen; pressing the chosen one keeps it. */
  onValueChange?: (value: string) => void;
  /** `md` (default) or `sm` for toolbars. */
  size?: 'md' | 'sm';
  /** Shows the label above the track, as Select and the fields do, so a segmented control lines up with them in a row of labelled controls. Off by default: a mode switch usually explains itself. */
  showLabel?: boolean;
  /** Extra class on the root. */
  className?: string;
  /** Turns the whole control off, so it cannot be focused or changed and reads as dimmed. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
}

/** A switch between two to five modes of the same view, such as Map and List: the tab track's well with
 *  the chosen mode as chosen glass. It changes how the content is shown, never which content (that is Tabs). */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl({ label, options, value, defaultValue, onValueChange, size = 'md', showLabel = false, className, disabled }, ref) {
  const id = useId();
  const track = (
    <RG.Root ref={ref} type="single" {...(showLabel ? { 'aria-labelledby': `${id}-label` } : { 'aria-label': label })} disabled={disabled} value={value} defaultValue={defaultValue ?? options[0]?.value} onValueChange={(v) => { if (v) onValueChange?.(v); }} data-component="SegmentedControl" className={cx(styles.track, styles[size], className)}>
      {options.map((o) => <RG.Item key={o.value} value={o.value} disabled={o.disabled} className={styles.segment}>{o.label}</RG.Item>)}
    </RG.Root>
  );
  if (!showLabel) return track;
  return <div className={styles.field}><span id={`${id}-label`} className={styles.label}>{label}</span>{track}</div>;
});
