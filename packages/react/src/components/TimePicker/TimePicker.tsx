import { forwardRef, useMemo } from 'react';
import { Select } from '../Select';
import { useMessages, useLocale } from '../../i18n/context';

export interface TimePickerProps {
  /** Visible label, also the field's accessible name, such as Pick-up time. */
  label: string;
  /** Hides the label visually when the context already says it; it is still read. */
  hideLabel?: boolean;
  /** The chosen time as HH:MM in 24 hours, such as 09:30, when you keep it yourself. */
  value?: string;
  /** The time it starts with, as HH:MM. */
  defaultValue?: string;
  /** Called with the chosen time as HH:MM. */
  onValueChange?: (value: string) => void;
  /** Minutes between the times offered; 15 by default. */
  step?: number;
  /** The earliest time offered, as HH:MM; 00:00 by default. */
  min?: string;
  /** The latest time offered, as HH:MM; 23:59 by default. */
  max?: string;
  /** A BCP 47 locale for how times read, such as en-US for 9:30 AM or nb-NO for 09:30. */
  locale?: string;
  /** Shown when nothing is chosen, such as Choose a time. */
  placeholder?: string;
  /** Turns the field off. */
  disabled?: boolean;
  /** Shows the value without letting it change. It can still be focused and read, and it does not open. */
  readOnly?: boolean;
  /** Name for form submission; the value is sent as HH:MM. */
  name?: string;
  /** Extra class on the wrapper. */
  className?: string;
}

const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const hhmm = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;

/** A time chosen from a list at a fixed step, in Select's groove and sheet: typing the first digits jumps
 *  to them and the times read in the reader's own clock. A list beats a free field for appointments and
 *  pick-ups, where only some times exist; it is Select underneath, so it has no look of its own. */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker({ step = 15, min = '00:00', max = '23:59', locale: localeIn, placeholder: placeholderIn, ...rest }, ref) {
  const t = useMessages();
  const placeholder = placeholderIn ?? t.chooseTime;
  const locale = localeIn ?? useLocale();
  const options = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' });
    const out: { value: string; label: string }[] = [];
    for (let n = toMin(min); n <= toMin(max); n += step) { const d = new Date(2000, 0, 1, Math.floor(n / 60), n % 60); out.push({ value: hhmm(n), label: fmt.format(d) }); }
    return out;
  }, [step, min, max, locale]);
  return <div ref={ref} data-component="TimePicker"><Select options={options} placeholder={placeholder} {...rest} /></div>;
});
