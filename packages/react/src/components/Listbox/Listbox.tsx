'use client';

import { forwardRef, useRef } from 'react';
import type { ElementRef, ReactNode } from 'react';
import { Item } from '@react-stately/collections';
import { useListState } from '@react-stately/list';
import { useListBox, useOption } from '@react-aria/listbox';
import type { CollectionChildren, Key, Node, Selection } from '@react-types/shared';
import styles from './Listbox.module.css';

/**
 * Listbox — the W5 (Selection) template component. Behavior/a11y is 100% borrowed from React
 * Aria (`@react-stately/list`'s `useListState` + `@react-aria/listbox`'s `useListBox`/`useOption`)
 * per BLUEPRINT §7 / component-engineer.md ("ห้ามเขียน ... roving tabindex เอง") — this is the
 * first component in the system to reach for React Aria instead of Radix, because Radix has no
 * standalone listbox primitive (only bundled inside its Select). Everything below is either (a)
 * wiring React Aria's collection/state/behavior hooks together, or (b) the token-driven visual
 * layer on top of the DOM props those hooks return. No keyboard handler, focus index, or
 * typeahead buffer is written by hand anywhere in this file.
 *
 * Reuse Check (component-engineer.md step 0): grepped `packages/react/src/components/` for any
 * existing selection/listbox/roving-tabindex behavior before starting — none exists. Popover only
 * supplies positioning/dismissal (Radix `react-popover`), not option semantics; Radio/Checkbox/
 * Switch are single native-input selection controls (native browser roving focus per-`name`
 * group), not multi-item collections with programmatic roving `tabindex`. Nothing to reuse or
 * extend; a new component is warranted.
 *
 * Anatomy: root `ul[role=listbox]` (via `useListBox`) -> `Listbox.Item` children, each rendered
 * as `li[role=option]` (via `useOption`) containing the option's label text and, when selected, a
 * checkmark glyph (non-color cue per BLUEPRINT §7 — see Listbox.module.css `.checkmark`; the
 * checkmark's presence/absence is the cue, not merely a background/text color swap).
 *
 * A11y: root carries `role="listbox"` + the caller-supplied `aria-label`/`aria-labelledby`
 * (**required** — this component never assumes an adjacent visible `<label>` the way a native
 * `<select>` might). Each option carries `role="option"` + `aria-selected` synced to real
 * selection state (not a CSS class) + roving `tabindex` — all from `useOption`/`useListBox`.
 * Bootstrap state: before any option has ever been focused, the root `ul` itself is `tabindex=0`
 * and every option is `tabindex=-1` (ARIA Authoring Practices' documented roving-tabindex startup
 * state — Tab lands on the listbox container first); the instant an option is focused (click or
 * Tab-in-then-Arrow), tabindex moves onto that option (root becomes `-1`, that option becomes
 * `0`) and stays there as Arrow keys move it between options — confirmed by `Listbox.test.tsx`
 * (jsdom-provable click-focus transition) and `w5-listbox.spec.ts`'s `expectRovingTabindex`
 * (real-browser Arrow-key transitions). Arrow Up/Down move the active option and do NOT wrap
 * (React Aria's `useSelectableCollection` defaults `shouldFocusWrap` to `false`; this component
 * does not override that default — verified by reading the resolved `@react-aria/selection`
 * source directly (package.json specifies `^3.13.6` for `@react-aria/listbox`, but the lockfile
 * actually resolves its `@react-aria/selection` dependency to `3.28.1`, whose implementation now
 * lives inside the bundled `react-aria` package at
 * `react-aria/dist/private/selection/useSelectableCollection.js` — checked that exact file, not
 * an older cached copy or the docs). Home/End jump to the first/last option. Typing a character
 * jumps to the next option whose text starts with it (React Aria's built-in `useTypeSelect`,
 * wired automatically inside `useSelectableCollection` — nothing added here). Scroll-into-view
 * when an off-screen option is focused is also automatic (`useSelectableCollection` calls
 * `scrollIntoViewport` from `@react-aria/utils`) but **only when the focus change's modality is
 * `'keyboard'`** — confirmed by direct experimentation: a raw `element.focus()` call (no keydown
 * involved) leaves `scrollTop` unchanged, while pressing an actual arrow/Home/End key scrolls the
 * container. This only works in a real browser; jsdom has no scroll layout, so it is proven in
 * `packages/conformance/specs/w5-listbox.spec.ts` (which drives focus via `page.keyboard.press`,
 * not `el.focus()`), not `Listbox.test.tsx` (Honesty Rule).
 *
 * Controlled/uncontrolled (BLUEPRINT §7): `selectedKeys`/`onSelectionChange` for controlled,
 * `defaultSelectedKeys` for uncontrolled — this is `useListState`'s own controlled/uncontrolled
 * duality, not something this component re-implements.
 */

export interface ListboxProps {
  /** `'single'` (default) or `'multiple'`. Mirrors ARIA listbox's `aria-multiselectable`. */
  selectionMode?: 'single' | 'multiple';
  /** Controlled selected keys. Omit + use `defaultSelectedKeys` for uncontrolled (BLUEPRINT §7). */
  selectedKeys?: 'all' | Iterable<Key>;
  /** Initial selected keys for uncontrolled usage. */
  defaultSelectedKeys?: 'all' | Iterable<Key>;
  /** Fires whenever selection changes (user interaction or programmatic). */
  onSelectionChange?: (keys: Selection) => void;
  /** Keys of options that cannot be focused, selected, or otherwise interacted with. */
  disabledKeys?: Iterable<Key>;
  /**
   * Accessible name for the listbox root. **Required** — see A11y note above.
   */
  'aria-label': string;
  'aria-labelledby'?: string;
  /** `Listbox.Item` children (React Aria Collection API — see `Listbox.Item` below). */
  children: CollectionChildren<object>;
  className?: string;
}

/**
 * Listbox.Item — a single option, declared as a child of `Listbox`. This is a thin re-export of
 * `@react-stately/collections`'s `Item` (React Aria's Collection API): it renders nothing itself
 * at the JSX level — `useListState`'s internal `CollectionBuilder` walks these elements at render
 * time to build the actual option collection that `Listbox` iterates over and `useOption`
 * attaches behavior to. Re-exported under the `Listbox.Item` name (not bare `Item`) so every W5
 * sibling that reuses this same collection pattern (Select/Combobox/MultiSelect/RadioCards/
 * TagInput) can follow one consistent `<Family.Item>` naming convention instead of everyone
 * importing a bare `Item` from React Aria directly.
 */
interface ListboxItemProps {
  key?: Key;
  /** Text shown for the option. */
  children: ReactNode;
  /** String used for typeahead matching when `children` isn't plain text. */
  textValue?: string;
  'aria-label'?: string;
}

const ListboxItem = Item as unknown as ((props: ListboxItemProps) => ReactNode) & {
  getCollectionNode: (props: ListboxItemProps, context?: unknown) => Generator<unknown>;
};

interface OptionProps {
  item: Node<object>;
  state: ReturnType<typeof useListState<object>>;
}

/**
 * Internal option renderer — calls `useOption` (React Aria) to get role/aria-selected/tabindex/
 * event-handler DOM props, then wraps them in the token-driven visual markup. Not exported: the
 * public surface only ever hands options to `Listbox` via `Listbox.Item` children, matching how
 * React Aria's own consumers structure this same split.
 */
function Option({ item, state }: OptionProps) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, isSelected, isDisabled, isFocusVisible } = useOption(
    { key: item.key },
    state,
    ref,
  );

  return (
    <li
      {...optionProps}
      ref={ref}
      className={styles.option}
      data-selected={isSelected ? '' : undefined}
      data-disabled={isDisabled ? '' : undefined}
      data-focus-visible={isFocusVisible ? '' : undefined}
    >
      <span className={styles.optionLabel}>{item.rendered}</span>
      {isSelected ? (
        <svg className={styles.checkmark} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </li>
  );
}

interface ListboxComponent {
  (props: ListboxProps & { ref?: React.Ref<HTMLUListElement> }): ReactNode;
  displayName: string;
  Item: typeof ListboxItem;
}

/**
 * Listbox — see module doc above for the full behavior/a11y contract. `selectionMode` defaults to
 * `'single'`.
 */
export const Listbox = forwardRef<HTMLUListElement, ListboxProps>(function Listbox(
  {
    selectionMode = 'single',
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disabledKeys,
    className,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
  },
  forwardedRef,
) {
  const state = useListState<object>({
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disabledKeys,
    children,
  });

  const listboxRef = useRef<HTMLUListElement | null>(null) as { current: HTMLUListElement | null };
  const { listBoxProps } = useListBox(
    { selectionMode, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby },
    state,
    listboxRef,
  );

  const classes = className ? `${styles.root} ${className}` : styles.root;

  return (
    <ul
      {...listBoxProps}
      ref={(node) => {
        listboxRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) (forwardedRef as { current: HTMLUListElement | null }).current = node;
      }}
      className={classes}
    >
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}) as unknown as ListboxComponent;

Listbox.displayName = 'Listbox';
Listbox.Item = ListboxItem;

export type { Key, Selection } from '@react-types/shared';
