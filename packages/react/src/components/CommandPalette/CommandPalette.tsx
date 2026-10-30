import { Fragment, forwardRef, useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import * as RD from '@radix-ui/react-dialog';
import { cx } from '../../cx';
import { Card } from '../Card';
import { Kbd } from '../Kbd';
import dlg from '../Dialog/Dialog.module.css';
import styles from './CommandPalette.module.css';
import { useMessages } from '../../i18n/context';

export interface Command {
  /** Unique within the palette. */
  id: string;
  /** What the command does, as a verb first, such as Open settings. */
  label: string;
  /** The heading the command is listed under, such as Navigation or Prints. */
  group?: string;
  /** Other words that should find it, such as preferences for Open settings. */
  keywords?: string[];
  /** The keys that run it outside the palette, such as ['⌘', ',']; shown at the row's end. */
  shortcut?: string[];
  /** A glyph at the row's start; it is not read. */
  icon?: ReactNode;
  /** Runs the command; the palette closes first. */
  onSelect: () => void;
}

export interface CommandPaletteProps {
  /** The commands, in the order they are listed when nothing is typed. */
  commands: Command[];
  /** Open state, when you keep it yourself. */
  open?: boolean;
  /** Called when the palette opens or closes, including from the shortcut and Esc. */
  onOpenChange?: (open: boolean) => void;
  /** Opens the palette on ⌘K or Ctrl+K anywhere on the page; on by default. */
  hotkey?: boolean;
  /** The words in the empty field; Type a command or search by default. */
  placeholder?: string;
  /** Shown when nothing matches; No commands match by default. */
  empty?: string;
  /** Draws it in place, open and not modal, inside its parent. Use it for documentation, previews and screenshots, never in a product flow. */
  preview?: boolean;
}

const score = (c: Command, q: string) => {
  if (!q) return 1;
  const hay = [c.label, ...(c.keywords ?? []), c.group ?? ''].join(' ').toLowerCase();
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.every((w) => hay.includes(w))) return 0;
  return c.label.toLowerCase().startsWith(words[0]) ? 3 : hay.split(/\s+/).some((x) => x.startsWith(words[0])) ? 2 : 1;
};

/** Every action in reach of the keyboard: ⌘K opens a level-3 pane over the scrim with a field and the
 *  commands under it, grouped. Typing filters, arrow keys move the highlight while focus stays in the
 *  field, Enter runs, Esc closes and focus goes back where it was. */
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(function CommandPalette({ commands, open, onOpenChange, hotkey = true, placeholder: placeholderIn, empty: emptyIn, preview }, ref) {
  const t = useMessages();
  const placeholder = placeholderIn ?? t.commandPlaceholder;
  const empty = emptyIn ?? t.commandEmpty;
  const id = useId();
  const [inner, setInner] = useState(false);
  const isOpen = preview ? true : open ?? inner;
  const set = (v: boolean) => { if (open === undefined) setInner(v); onOpenChange?.(v); };
  const [q, setQ] = useState('');
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (!hotkey || preview) return;
    // with two palettes on a page (the site's search and a demo), the first one to take the key wins
    const on = (e: KeyboardEvent) => { if (!e.defaultPrevented && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); set(!isOpen); } };
    window.addEventListener('keydown', on); return () => window.removeEventListener('keydown', on);
  });
  useEffect(() => { if (!isOpen) { setQ(''); setAt(0); } }, [isOpen]);
  const shown = useMemo(() => commands.map((c, i) => ({ c, s: score(c, q), i })).filter((x) => x.s > 0).sort((a, b) => (q ? b.s - a.s : 0) || a.i - b.i).map((x) => x.c), [commands, q]);
  const groups = useMemo(() => { const m = new Map<string, Command[]>(); for (const c of shown) { const g = q ? t.results : c.group ?? t.commands; m.set(g, [...(m.get(g) ?? []), c]); } return [...m]; }, [shown, q]);
  const flat = groups.flatMap(([, cs]) => cs);
  const Portal = preview ? Fragment : RD.Portal;
  const run = (c: Command) => { set(false); setTimeout(c.onSelect, 0); };
  return (
    <RD.Root open={isOpen} onOpenChange={set} modal={!preview}>
      <Portal>
        {!preview && <RD.Overlay className={dlg.scrim} />}
        <RD.Content asChild aria-describedby={undefined}>
          <Card ref={ref} as="div" level={3} data-component="CommandPalette" className={cx(styles.root, preview && styles.preview)}>
            <RD.Title className={styles.hidden}>{t.commandPalette}</RD.Title>
            <div className={styles.field}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5.5 5.5" /></svg>
              <input className={styles.input} role="combobox" aria-expanded aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={flat[at] ? `${id}-${flat[at].id}` : undefined}
                aria-label={t.command} placeholder={placeholder} value={q} autoFocus={!preview}
                onChange={(e) => { setQ(e.target.value); setAt(0); }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setAt((a) => Math.min(flat.length - 1, a + 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setAt((a) => Math.max(0, a - 1)); }
                  if (e.key === 'Home') { e.preventDefault(); setAt(0); } if (e.key === 'End') { e.preventDefault(); setAt(flat.length - 1); }
                  if (e.key === 'Enter' && flat[at]) { e.preventDefault(); run(flat[at]); }
                }} />
            </div>
            {flat.length === 0 && <p className={styles.empty} role="status">{empty}</p>}
            <div id={`${id}-list`} role="listbox" aria-label={t.commands} className={styles.list} hidden={flat.length === 0}>
              {groups.map(([g, cs], gi) => (
                <div key={g} role="group" aria-labelledby={`${id}-g-${gi}`} className={styles.group}>
                  <p id={`${id}-g-${gi}`} className={styles.heading} role="presentation">{g}</p>
                  {cs.map((c) => { const i = flat.indexOf(c); return (
                    <div key={c.id} id={`${id}-${c.id}`} role="option" aria-selected={i === at} className={cx(styles.row, i === at && styles.on)}
                      onPointerMove={() => setAt(i)} onClick={() => run(c)}>
                      {c.icon && <span className={styles.icon} aria-hidden="true">{c.icon}</span>}
                      <span className={styles.label}>{c.label}</span>
                      {c.shortcut && <span className={styles.keys} aria-label={t.shortcut(c.shortcut.join(' '))}>{c.shortcut.map((k) => <Kbd key={k}>{k}</Kbd>)}</span>}
                    </div>); })}
                </div>
              ))}
            </div>
            <p className={styles.foot} aria-hidden="true"><Kbd>↑</Kbd><Kbd>↓</Kbd> {t.toMove} · <Kbd>↵</Kbd> {t.toRun} · <Kbd>{t.escKey}</Kbd> {t.toClose}</p>
          </Card>
        </RD.Content>
      </Portal>
    </RD.Root>
  );
});
