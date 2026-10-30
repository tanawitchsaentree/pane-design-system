import { useId, useMemo, useState, type ReactNode } from 'react';
import * as RP from '@radix-ui/react-popover';
import { cx } from '../../cx';
import { useListNav } from '../Listbox/useListNav';
import list from '../Listbox/Listbox.module.css';
import { useField } from '../FormField';
import styles from './Combobox.module.css';
import type { ListboxOption } from '../Listbox';

/** The text field with a popup listbox behind Combobox, Autocomplete and MultiSelect (WAI-ARIA combobox
 *  pattern): the input keeps focus, the list follows the typing, arrow keys move the highlight. */
export function ComboCore({ label, options, text, onText, chosen, onChoose, placeholder, before, emptyText, filter = true, name, className, component, disabled, readOnly, invalid, required }: {
  label: string; options: ListboxOption[]; text: string; onText: (t: string) => void; chosen: string[]; onChoose: (v: string) => void;
  placeholder?: string; before?: ReactNode; emptyText: string; filter?: boolean; name?: string; className?: string; component: string;
  disabled?: boolean; readOnly?: boolean; invalid?: boolean; required?: boolean;
}) {
  const id = useId();
  const field = useField();
  const off = disabled ?? field?.disabled ?? false;
  const bad = invalid ?? field?.invalid ?? false;
  const [openState, setOpenState] = useState(false);
  // read-only and disabled fields show their value but never open the list
  const open = openState && !off && !readOnly;
  const setOpen = (o: boolean) => setOpenState(o);
  const shown = useMemo(() => (filter && text ? options.filter((o) => o.label.toLowerCase().includes(text.toLowerCase())) : options), [options, text, filter]);
  const nav = useListNav(shown.length, shown.map((o) => o.label), (i) => !!shown[i].disabled);
  const activeId = open && nav.active >= 0 ? `${id}-o${nav.active}` : undefined;
  const pick = (o: ListboxOption) => { if (o.disabled) return; onChoose(o.value); nav.setActive(-1); };
  return (
    <div data-component={component} className={cx(styles.root, className)}>
      {!field && <label htmlFor={`${id}-in`} className={styles.label}>{label}</label>}
      <RP.Root open={open && (shown.length > 0 || text.length > 0)} onOpenChange={setOpen}>
        <RP.Anchor asChild>
          <div className={styles.field}>
            {before}
            <input id={field?.id ?? `${id}-in`} name={name} disabled={off} readOnly={readOnly} required={required ?? field?.required} aria-invalid={bad || undefined} aria-describedby={field?.describedBy} className={styles.input} role="combobox" aria-expanded={open} aria-controls={`${id}-list`} aria-autocomplete={filter ? 'list' : 'none'} aria-activedescendant={activeId}
              autoComplete="off" value={text} placeholder={placeholder}
              onChange={(e) => { onText(e.target.value); setOpen(true); nav.setActive(-1); }}
              onFocus={() => setOpen(true)} onClick={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); } return; }
                if (e.key === 'Enter' && open && nav.active >= 0) { e.preventDefault(); pick(shown[nav.active]); return; }
                if (['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); setOpen(true); nav.onKey(e, false); }
              }} />
            <span className={styles.chevron} aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" /></svg></span>
          </div>
        </RP.Anchor>
        <RP.Portal>
          <RP.Content className={list.sheet} sideOffset={6} align="start" onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => { if ((e.target as Element).closest?.(`[data-combo="${id}"]`)) e.preventDefault(); }}>
            <div id={`${id}-list`} role="listbox" aria-label={label} aria-multiselectable={component === 'MultiSelect' || undefined}>
              {shown.length === 0 && <div className={list.empty} role="presentation">{emptyText}</div>}
              {shown.map((o, i) => (
                <div key={o.value} id={`${id}-o${i}`} role="option" aria-selected={chosen.includes(o.value)} aria-disabled={o.disabled || undefined}
                  className={cx(list.option, i === nav.active && list.active)} onPointerDown={(e) => e.preventDefault()} onPointerMove={() => nav.setActive(i)} onClick={() => pick(o)}>
                  <span className={list.check} aria-hidden="true">{chosen.includes(o.value) && <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>}</span>
                  <span className={list.text}><span className={list.optionLabel}>{o.label}</span>{o.description && <span className={list.description}>{o.description}</span>}</span>
                </div>
              ))}
            </div>
          </RP.Content>
        </RP.Portal>
      </RP.Root>
    </div>
  );
}
