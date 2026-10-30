import { forwardRef, useState } from 'react';
import * as RP from '@radix-ui/react-popover';
import { cx } from '../../cx';
import { Card } from '../Card';
import { Calendar } from '../Calendar';
import type { DateRange } from '../Calendar/dates';
import { useField } from '../FormField';
import sel from '../Select/Select.module.css';
import styles from './DatePicker.module.css';
import { useMessages, useLocale } from '../../i18n/context';

interface Base {
  /** Shown in the field when nothing is chosen, such as Choose a date. */
  placeholder?: string;
  /** The earliest day that can be chosen. */
  min?: Date;
  /** The latest day that can be chosen. */
  max?: Date;
  /** Days that cannot be chosen; they stay visible in the calendar and are read as unavailable. */
  isUnavailable?: (date: Date) => boolean;
  /** A BCP 47 locale for the field's text and the calendar, such as nb-NO. */
  locale?: string;
  /** The first day of the week, 0 for Sunday; 1, Monday, by default. */
  weekStartsOn?: number;
  /** Names the field when it is not inside a FormField. */
  'aria-label'?: string;
  /** Turns the field off. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
  /** Shows the value without letting it change. It can still be focused and read, and it does not open. */
  readOnly?: boolean;
  /** Marks the date as wrong. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Extra class on the field. */
  className?: string;
}
export interface DatePickerSingleProps extends Base {
  /** `single` (default) is one day. */
  mode?: 'single';
  /** The chosen day, when you keep it yourself. */
  value?: Date | null;
  /** The day it starts with. */
  defaultValue?: Date | null;
  /** Called with the chosen day; the calendar closes and focus returns to the field. */
  onValueChange?: (value: Date) => void;
}
export interface DatePickerRangeProps extends Base {
  /** `range` is a first and a last day, such as a stay; the calendar closes once the last day is chosen. */
  mode: 'range';
  /** The chosen range, when you keep it yourself. */
  value?: DateRange;
  /** The range it starts with. */
  defaultValue?: DateRange;
  /** Called with the range after each press; `end` is null until the second day is chosen. */
  onValueChange?: (value: DateRange) => void;
}
export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

/** A field in Select's groove that opens Calendar on a level-4 popover. The field says the chosen day in
 *  words; choosing closes the calendar and puts focus back on the field. In range mode it is a stay: the
 *  first press is the start, the second the end. */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(props, ref) {
  const t = useMessages();
  const { placeholder = t.chooseDate, min, max, isUnavailable, weekStartsOn, disabled, readOnly, invalid, className } = props;
  const locale = props.locale ?? useLocale();
  const field = useField();
  const range = props.mode === 'range';
  const [open, setOpen] = useState(false);
  const [single, setSingle] = useState<Date | null>(!range ? (props as DatePickerSingleProps).defaultValue ?? null : null);
  const [span, setSpan] = useState<DateRange>(range ? (props as DatePickerRangeProps).defaultValue ?? { start: null, end: null } : { start: null, end: null });
  const v1 = !range ? ((props as DatePickerSingleProps).value !== undefined ? (props as DatePickerSingleProps).value ?? null : single) : null;
  const v2 = range ? (props as DatePickerRangeProps).value ?? span : null;
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  const text = !range ? (v1 ? fmt.format(v1) : '') : v2?.start ? `${fmt.format(v2.start)} ${t.dateRangeTo} ${v2.end ? fmt.format(v2.end) : '…'}` : '';
  const shared = { min, max, isUnavailable, locale, weekStartsOn, label: props['aria-label'] ?? t.date };
  return (
    <RP.Root open={open && !readOnly} onOpenChange={(o) => { if (!readOnly) setOpen(o); }}>
      <RP.Trigger asChild>
        <button ref={ref} type="button" data-component="DatePicker" id={field?.id} aria-describedby={field?.describedBy} aria-label={props['aria-label']} role="combobox" aria-expanded={open && !readOnly} aria-haspopup="dialog"
          disabled={disabled ?? field?.disabled} aria-invalid={(invalid ?? field?.invalid) || undefined} aria-required={field?.required || undefined} aria-readonly={readOnly || undefined} data-readonly={readOnly || undefined} className={cx(sel.trigger, sel.md, styles.trigger, className)}>
          <span className={cx(!text && styles.placeholder)}>{text || placeholder}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><rect x="4" y="5.5" width="16" height="14" rx="3" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></svg>
        </button>
      </RP.Trigger>
      <RP.Portal>
        <RP.Content asChild side="bottom" align="start" sideOffset={8} collisionPadding={12}>
          <Card as="section" level={4} aria-label={shared.label} className={styles.pop}>
            {!range
              ? <Calendar {...shared} value={v1} onValueChange={(d) => { const p = props as DatePickerSingleProps; if (p.value === undefined) setSingle(d); p.onValueChange?.(d); setOpen(false); }} />
              : <Calendar {...shared} mode="range" value={v2!} onValueChange={(r) => { const p = props as DatePickerRangeProps; if (p.value === undefined) setSpan(r); p.onValueChange?.(r); if (r.end) setOpen(false); }} />}
          </Card>
        </RP.Content>
      </RP.Portal>
    </RP.Root>
  );
});
