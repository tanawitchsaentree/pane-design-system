import { forwardRef, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Input, type InputProps } from '../Input';
import { InputGroup } from '../InputGroup';
import { IconButton } from '../IconButton';
import styles from './SearchInput.module.css';
import { useMessages } from '../../i18n/context';

export interface SearchInputProps extends Omit<InputProps, 'type' | 'size' | 'value' | 'defaultValue' | 'onChange'> {
  /** Names the field for screen readers when there is no visible label, such as Search prints. */
  'aria-label'?: string;
  /** The query, when you keep it yourself. */
  value?: string;
  /** The query it starts with. */
  defaultValue?: string;
  /** Called with the query on every change, for search as you type. */
  onValueChange?: (value: string) => void;
  /** Called with the query when the reader presses Enter, for search on submit. */
  onSearch?: (value: string) => void;
  /** The words on the clear button for screen readers; Clear search by default. */
  clearLabel?: string;
}

/** A search field: a magnifier at its start, a clear button at its end once there is a query. Enter
 *  searches, Esc clears, and clearing puts focus back in the field so the next query can be typed. */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput({ value, defaultValue, onValueChange, onSearch, clearLabel: clearLabelIn, className, onKeyDown, ...rest }, ref) {
  const t = useMessages();
  const clearLabel = clearLabelIn ?? t.clearSearch;
  const [inner, setInner] = useState(defaultValue ?? '');
  const q = value ?? inner;
  const set = (v: string) => { if (value === undefined) setInner(v); onValueChange?.(v); };
  const input = useRef<HTMLInputElement | null>(null);
  const clear = () => { set(''); input.current?.focus(); };
  return (
    <InputGroup data-component="SearchInput" role="search" className={className}
      start={<svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5.5 5.5" /></svg>}
      end={q ? <IconButton variant="ghost" aria-label={clearLabel} onClick={clear}><svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><path d="M7 7l10 10M17 7 7 17" /></svg></IconButton> : undefined}>
      <Input
        ref={(el) => { input.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }}
        type="search" enterKeyHint="search" value={q}
        onChange={(e: ChangeEvent<HTMLInputElement>) => set(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') onSearch?.(q);
          if (e.key === 'Escape' && q) { e.preventDefault(); clear(); }
          onKeyDown?.(e);
        }}
        className={styles.input} {...rest} />
    </InputGroup>
  );
});
