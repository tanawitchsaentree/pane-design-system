import { useState } from 'react';
import { ComboCore } from './ComboCore';
import type { ListboxOption } from '../Listbox';
import { useMessages } from '../../i18n/context';

export interface ComboboxProps {
  /** The field's label, its accessible name. */
  label: string;
  /** The options, in the order they are shown. */
  options: ListboxOption[];
  /** The chosen value. */
  value?: string;
  /** The starting value when uncontrolled. */
  defaultValue?: string;
  /** Called when the value changes. */
  onValueChange?: (value: string) => void;
  /** A hint inside the empty field. It never replaces the label. */
  placeholder?: string;
  /** Shown when nothing matches what was typed. Defaults to "No matches". */
  emptyText?: string;
  /** Name for the value in a native form. */
  name?: string;
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

/** Choose one value from a long list by typing to narrow it: a field that filters as you type, with the
 *  list under it. The value must be one of the options; for free text with suggestions use Autocomplete. */
export function Combobox({ label, options, value, defaultValue, onValueChange, placeholder, emptyText: emptyTextIn, name, className, disabled, readOnly, invalid, required }: ComboboxProps) {
  const t = useMessages();
  const emptyText = emptyTextIn ?? t.noMatches;
  const [inner, setInner] = useState(defaultValue ?? '');
  const current = value ?? inner;
  const [text, setText] = useState(options.find((o) => o.value === current)?.label ?? '');
  return (
    <ComboCore disabled={disabled} readOnly={readOnly} invalid={invalid} required={required} component="Combobox" label={label} options={options} text={text} onText={setText} chosen={current ? [current] : []} placeholder={placeholder} emptyText={emptyText} name={name} className={className}
      onChoose={(v) => { if (value === undefined) setInner(v); setText(options.find((o) => o.value === v)?.label ?? ''); onValueChange?.(v); }} />
  );
}
