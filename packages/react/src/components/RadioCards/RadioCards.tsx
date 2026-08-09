'use client';

import { createContext, forwardRef, useContext, useState } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import styles from './RadioCards.module.css';

/**
 * RadioCards — a "choose 1 of N" control where the whole card is the click target (e.g. picking a
 * plan/tier), backed by nothing but a native `<input type="radio">` group sharing one `name`
 * (D-023: "native HTML form control พอเองไหม" is checked FIRST, before Radix/React Aria, and a
 * radio group is the textbook case where it already does — browsers roll their own roving
 * tabindex and Arrow-key cycling between same-`name` radios for free, exactly the reasoning
 * `Radio.tsx` documents; RadioCards is that same primitive with a bigger, fully-clickable visual,
 * not a new widget with different behavior). Reuse Check (component-engineer.md step 0): grepped
 * `packages/react/src/components/` — `Radio.tsx`/`Checkbox.tsx`/`Switch.tsx` are the only
 * single-native-input selection controls in the system and all three already use the
 * visually-hidden-input-under-a-custom-visual technique; `Listbox`'s React Aria collection stack
 * is the wrong base per D-023 (that's for multi-item collections with a *programmatic* roving
 * tabindex — a radio group's roving focus is the browser's, not ours, to implement). Nothing to
 * extend behavior-wise; only the visual layer is new, so this file only adds markup/CSS on top of
 * the exact same `<label>` -> visually-hidden `<input>` -> visual-sibling anatomy `Radio.tsx`
 * already uses, reusing the SAME `VisuallyHidden` clip pattern via CSS Modules `composes:` (not a
 * duplicated clip-path — see `RadioCards.module.css`'s `.input` rule).
 *
 * API Vocabulary Contract (D-024): RadioCards is a Standalone control (one value, no collection of
 * keyed items to select multiple from — the D-024 test is "ค่าเดียว" vs "หลาย item จาก set ที่มี
 * identity เป็น key"), so it speaks `value`/`defaultValue`/`onChange` like every other Standalone
 * control in the system (Input/Textarea/PinInput's string vocabulary; Checkbox/Radio/Switch's
 * boolean vocabulary is the same family, just a different primitive value type) — NOT
 * `selectedKeys`/`onSelectionChange` (that vocabulary is reserved for the Collection family:
 * Listbox/Select/Combobox/MultiSelect/Menu/ContextMenu/TagInput's suggestion list, none of which
 * this is).
 *
 * Anatomy: root `div[role=radiogroup]` (the group boundary + accessible name — see the
 * `aria-label`/`aria-labelledby` doc below; this is the ARIA Authoring Practices pattern for a
 * radio group that isn't wrapped in a native `<fieldset>`/`<legend>`, which RadioCards
 * deliberately isn't, since its visual is a row/column of standalone cards rather than a bordered
 * fieldset box) -> `RadioCards.Item` children, each rendered as `label.card` (the a11y/click
 * wrapper, carries no border of its own) -> visually-hidden native `input[type=radio]` (shares the
 * root's `name`, so the browser groups it with its siblings) -> `span.cardVisual` (the actual
 * card: border + background + padding + `children`, a sibling of the input so
 * `.input:checked/:focus-visible/:disabled ~ .cardVisual` selectors can drive it — same sibling
 * technique `Radio.tsx`'s `.ring` uses, just applied to a much bigger box) -> `span.indicator`
 * (`aria-hidden`, a small ring badge in the card's corner that fills solid + shows a checkmark
 * glyph when selected — a second non-color cue on top of the card border thickening/darkening,
 * mirroring `Radio.tsx`'s ring+dot visual language and `Listbox.tsx`'s checkmark-on-selected
 * treatment, per BLUEPRINT §7's "non-color cue" requirement).
 *
 * A11y: the native input carries the real `checked`/`disabled` state and receives focus — nothing
 * here reimplements focus/keyboard behavior. Because the label wraps the input AND the entire
 * `children` content, every bit of text inside `RadioCards.Item` becomes that radio's accessible
 * name for free (the native label-wraps-input algorithm), so a card with a title + description
 * needs no extra `aria-label` — this is asserted in `RadioCards.test.tsx` (jsdom-provable: it is a
 * static accessible-name computation, not a focus/keyboard behavior). Arrow-key cycling between
 * cards in the same group and roving tabindex (only one card tabbable at a time when focus isn't
 * inside the group) are native `name`-grouped-radio browser behavior — UNVERIFIED here on purpose
 * (jsdom has no real focus/layout model for this, exactly like `Radio.tsx`'s own honest limit) and
 * instead proven in `packages/conformance/specs/w5-radiocards.spec.ts`. That spec does NOT import
 * `expectRovingTabindex`/`expectArrowNavigation` from `_roving-focus.ts` (verified empirically in a
 * real browser while building this component: native `<input type=radio>` never sets a `tabindex`
 * DOM attribute on any item, before or after focus/Arrow-key movement, unlike React Aria's
 * `useSelectableCollection` which those helpers were written against — pointing them at RadioCards
 * would silently pass without proving anything) — it instead asserts `document.activeElement` and
 * `.checked` directly, which is what native radio-group roving focus actually manifests as.
 *
 * Controlled/uncontrolled (BLUEPRINT §7): `value`+`onChange` for controlled, `defaultValue` for
 * uncontrolled — same duality shape as every other Standalone control in the system.
 */
export interface RadioCardsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'role'> {
  /** Native `name` shared by every `RadioCards.Item`'s underlying radio input — this is the
   * entire mechanism that groups them for the browser's native roving focus/Arrow-key cycling
   * (D-023). Required: a radio group with no shared `name` isn't a group at all. */
  name: string;
  /** Controlled selected value (D-024 Standalone Control vocabulary — always a plain `string`,
   * never a key/Set). Omit + use `defaultValue` for uncontrolled. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Fires with the newly-selected card's `value` whenever selection changes. */
  onChange?: (value: string) => void;
  /** Disables every card in the group at once, regardless of each `RadioCards.Item`'s own
   * `disabled` (D-016 impact note: apply the group-disable pattern `Fieldset` established, even
   * though RadioCards isn't itself a `<fieldset>`). Default `false`. */
  disabled?: boolean;
  /** Marks the group required — sets `aria-required` on the `radiogroup` (mirrors `Input`'s own
   * `required`/`invalid` shape so `FormField` can clone this prop straight onto RadioCards the
   * same way it already does for native controls — see `FormField.tsx`'s `cloneElement`). Default
   * `false`. */
  required?: boolean;
  /** Marks the group invalid (e.g. "you must choose one") — sets `aria-invalid` on the
   * `radiogroup`. `radiogroup` is a valid target for both attributes per the ARIA spec, unlike a
   * plain `div`, which is why these are consumed explicitly here instead of being forwarded
   * blindly through `...rest` (that would otherwise leak a non-standard `invalid` DOM attribute
   * and trigger a React warning — caught by this component's own `RadioCards.test.tsx` "in
   * FormField" test). Default `false`. */
  invalid?: boolean;
  /** Layout direction of the cards. Default `'horizontal'`. */
  orientation?: 'horizontal' | 'vertical';
  children?: ReactNode;
}

interface RadioCardsContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  disabled: boolean;
}

const RadioCardsContext = createContext<RadioCardsContextValue | null>(null);

export interface RadioCardsItemProps extends Omit<ComponentPropsWithoutRef<'label'>, 'onChange'> {
  /** This card's value — becomes the underlying radio input's `value`, and the string handed to
   * the group's `onChange` when this card is picked. Required. */
  value: string;
  /** Disables just this card. Combined (OR'd) with the group's own `disabled` — a card can be
   * individually disabled even while the rest of the group stays interactive. Default `false`. */
  disabled?: boolean;
  /** Card content — title/description/icon/whatever; not a fixed shape. Every bit of text in here
   * becomes this radio's accessible name via the native label-wraps-input algorithm (see module
   * doc's A11y note). */
  children?: ReactNode;
}

/**
 * RadioCards.Item — a single card, declared as a child of `RadioCards`. Must be rendered inside a
 * `RadioCards` (throws otherwise — same "no silent no-op" stance `Listbox.Item`/`Section` take by
 * only being meaningful inside their own collection builder).
 */
const RadioCardsItem = forwardRef<ElementRef<'label'>, RadioCardsItemProps>(function RadioCardsItem(
  { value, disabled: itemDisabled = false, className, children, ...rest },
  ref,
) {
  const ctx = useContext(RadioCardsContext);
  if (!ctx) {
    throw new Error('RadioCards.Item must be rendered inside a RadioCards.');
  }
  const disabled = ctx.disabled || itemDisabled;
  const checked = ctx.value === value;
  const classes = className ? `${styles.card} ${className}` : styles.card;

  return (
    <label ref={ref} className={classes} data-disabled={disabled ? '' : undefined} {...rest}>
      <input
        type="radio"
        className={styles.input}
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => ctx.onChange(value)}
      />
      <span className={styles.cardVisual}>
        {children}
        <span className={styles.indicator} aria-hidden="true">
          {checked ? (
            <svg className={styles.checkIcon} viewBox="0 0 16 16" fill="none">
              <path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
      </span>
    </label>
  );
});

RadioCardsItem.displayName = 'RadioCards.Item';

interface RadioCardsComponent {
  (props: RadioCardsProps & { ref?: React.Ref<HTMLDivElement> }): ReactNode;
  displayName: string;
  Item: typeof RadioCardsItem;
}

/**
 * RadioCards — see module doc above for the full behavior/a11y contract.
 */
export const RadioCards = forwardRef<ElementRef<'div'>, RadioCardsProps>(function RadioCards(
  {
    name,
    value: controlledValue,
    defaultValue,
    onChange,
    disabled = false,
    required = false,
    invalid = false,
    orientation = 'horizontal',
    className,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...rest
  },
  ref,
) {
  if (process.env.NODE_ENV !== 'production' && !ariaLabel && !ariaLabelledby) {
    // eslint-disable-next-line no-console
    console.warn(
      'RadioCards: no aria-label or aria-labelledby. A radio group needs an accessible name of ' +
        'its own (ARIA Authoring Practices\' radiogroup pattern) — screen reader users otherwise ' +
        'hear each card but never learn what the group as a whole is choosing between.',
    );
  }

  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : uncontrolledValue;

  function handleChange(next: string) {
    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next);
  }

  const classes = className ? `${styles.root} ${className}` : styles.root;

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-required={required ? 'true' : undefined}
      aria-invalid={invalid ? 'true' : undefined}
      className={classes}
      data-orientation={orientation}
      {...rest}
    >
      <RadioCardsContext.Provider value={{ name, value, onChange: handleChange, disabled }}>
        {children}
      </RadioCardsContext.Provider>
    </div>
  );
}) as unknown as RadioCardsComponent;

RadioCards.displayName = 'RadioCards';
RadioCards.Item = RadioCardsItem;
