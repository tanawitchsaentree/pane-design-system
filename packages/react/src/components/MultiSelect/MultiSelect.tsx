import { useState } from 'react';
import { Chip } from '../Chip';
import { ComboCore } from '../Combobox/ComboCore';
import type { ListboxOption } from '../Listbox';
import { useMessages } from '../../i18n/context';

export interface MultiSelectProps {
  /** The accessible name. */
  label: string;
  /** The options, in the order they are shown. */
  options: ListboxOption[];
  /** The chosen values. */
  value?: string[];
  /** The starting value when uncontrolled. */
  defaultValue?: string[];
  /** Called when the value changes. */
  onValueChange?: (value: string[]) => void;
  /** A hint inside the empty field. It never replaces the label. */
  placeholder?: string;
  /** Shown when nothing matches what was typed. */
  emptyText?: string;
  /** Extra class on the root. */
  className?: string;
  /** Turns the field off. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
  /** Shows the value without letting it change; it can still be focused and read. */
  readOnly?: boolean;
  /** Marks the value as wrong. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Says the field must be filled. Inside a FormField, its `required` sets this for you. */
  required?: boolean;
}

/** Choose several values from a long list: a field that filters as you type, each chosen value a chip in
 *  the field that can be removed. Backspace in an empty field removes the last chip. */
export function MultiSelect({ label, options, value, defaultValue, onValueChange, placeholder, emptyText: emptyTextIn, className, disabled, readOnly, invalid, required }: MultiSelectProps) {
  const t = useMessages();
  const emptyText = emptyTextIn ?? t.noMatches;
  const [inner, setInner] = useState<string[]>(defaultValue ?? []);
  const chosen = value ?? inner;
  const [text, setText] = useState('');
  const set = (next: string[]) => { if (value === undefined) setInner(next); onValueChange?.(next); };
  const toggle = (v: string) => { set(chosen.includes(v) ? chosen.filter((x) => x !== v) : [...chosen, v]); setText(''); };
  const chips = chosen.map((v) => options.find((o) => o.value === v)).filter(Boolean).map((o) => (
    <Chip key={o!.value} onRemove={readOnly || disabled ? undefined : () => toggle(o!.value)} removeLabel={o!.label}>{o!.label}</Chip>
  ));
  return (
    <div onKeyDown={(e) => { if (e.key === 'Backspace' && !text && chosen.length && (e.target as HTMLElement).tagName === 'INPUT') set(chosen.slice(0, -1)); }}>
      <ComboCore disabled={disabled} readOnly={readOnly} invalid={invalid} required={required} component="MultiSelect" label={label} options={options} text={text} onText={setText} chosen={chosen} onChoose={toggle} placeholder={chosen.length ? undefined : placeholder} before={chips} emptyText={emptyText} className={className} />
    </div>
  );
}
