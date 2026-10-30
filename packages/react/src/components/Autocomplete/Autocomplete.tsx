import { useState } from 'react';
import { ComboCore } from '../Combobox/ComboCore';
import { useMessages } from '../../i18n/context';

export interface AutocompleteProps {
  /** The field's label. */
  label: string;
  /** Suggestions shown as the reader types. */
  suggestions: string[];
  /** The text. Any text is allowed; a suggestion only fills it in. */
  value?: string;
  /** The starting value when uncontrolled. */
  defaultValue?: string;
  /** Called when the value changes. */
  onValueChange?: (value: string) => void;
  /** A hint inside the empty field. It never replaces the label. */
  placeholder?: string;
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

/** A text field that suggests as you type. The reader may pick a suggestion or keep their own words,
 *  such as a place, a tag or a search; for a value that must come from the list, use Combobox. */
export function Autocomplete({ label, suggestions, value, defaultValue, onValueChange, placeholder, name, className, disabled, readOnly, invalid, required }: AutocompleteProps) {
  const t = useMessages();
  const [inner, setInner] = useState(defaultValue ?? '');
  const text = value ?? inner;
  const set = (t: string) => { if (value === undefined) setInner(t); onValueChange?.(t); };
  return (
    <ComboCore disabled={disabled} readOnly={readOnly} invalid={invalid} required={required} component="Autocomplete" label={label} options={suggestions.map((s) => ({ value: s, label: s }))} text={text} onText={set} chosen={[]} placeholder={placeholder}
      emptyText={t.keepTyping} name={name} className={className} onChoose={(v) => set(v)} />
  );
}
