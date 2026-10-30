import { forwardRef, useState } from 'react';
import * as RR from '@radix-ui/react-radio-group';
import { cx } from '../../cx';
import { Input } from '../Input';
import { InputGroup } from '../InputGroup';
import styles from './ColorPicker.module.css';
import { useMessages } from '../../i18n/context';

export interface ColorSwatch {
  /** The colour as a hex value, such as #3A6EA5. */
  value: string;
  /** Its name, read aloud and shown on hover, such as Fjord blue. A colour is never chosen by sight alone. */
  name: string;
}

export interface ColorPickerProps {
  /** Names what the colour is for, such as Album colour. */
  label: string;
  /** The colours to choose from. */
  swatches: ColorSwatch[];
  /** The chosen colour as a hex value, when you keep it yourself. */
  value?: string;
  /** The colour it starts with. */
  defaultValue?: string;
  /** Called with the hex value when a swatch is chosen or a valid hex is typed. */
  onValueChange?: (value: string) => void;
  /** Adds a hex field under the swatches for a colour that is not among them. */
  custom?: boolean;
  /** Extra class on the wrapper. */
  className?: string;
  /** Turns the whole control off, so it cannot be focused or changed and reads as dimmed. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
}

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
const norm = (v: string) => { const m = v.trim().match(HEX); if (!m) return null; const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1]; return `#${h.toUpperCase()}`; };

/** Choosing a colour for the reader's own content, a tag or an album, never for the interface (P1: the
 *  system owns no hue; this picks one that belongs to the content). Swatches are round radios with names,
 *  the chosen one ringed and checked; a hex field takes any other colour. */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker({ label, swatches, value, defaultValue, onValueChange, custom, className, disabled }, ref) {
  const t = useMessages();
  const [inner, setInner] = useState(defaultValue ?? swatches[0]?.value ?? '');
  const current = norm(value ?? inner) ?? '';
  const [draft, setDraft] = useState<string | null>(null);
  const set = (v: string) => { const n = norm(v); if (!n) return; if (value === undefined) setInner(n); onValueChange?.(n); };
  const named = swatches.find((s) => norm(s.value) === current);
  return (
    <div ref={ref} data-component="ColorPicker" data-not-token="" className={cx(styles.root, className)}>
      <RR.Root aria-label={label} disabled={disabled} value={named ? norm(named.value)! : ''} onValueChange={set} orientation="horizontal" className={styles.swatches}>
        {swatches.map((s) => (
          <RR.Item key={s.value} value={norm(s.value)!} aria-label={s.name} title={s.name} className={styles.item} style={{ ['--pane-swatch' as string]: s.value }}>
            <RR.Indicator className={styles.check}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></RR.Indicator>
          </RR.Item>
        ))}
      </RR.Root>
      {custom && (
        <InputGroup start={<span className={styles.preview} style={{ ['--pane-swatch' as string]: norm(draft ?? '') ?? current }} aria-hidden="true" />}>
          <Input disabled={disabled} aria-label={t.hexValue(label)} value={draft ?? current} spellCheck={false} autoCapitalize="off" className={styles.hex}
            aria-invalid={draft !== null && !norm(draft) ? true : undefined}
            onChange={(e) => { setDraft(e.target.value); if (norm(e.target.value)) set(e.target.value); }}
            onBlur={() => setDraft(null)} />
        </InputGroup>
      )}
      <span className={styles.name} aria-live="polite">{named ? named.name : current}</span>
    </div>
  );
});
