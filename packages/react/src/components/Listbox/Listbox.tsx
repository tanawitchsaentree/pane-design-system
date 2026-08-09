'use client';

import { forwardRef, useRef } from 'react';
import type { ElementRef, ReactNode } from 'react';
import { Item, Section } from '@react-stately/collections';
import { useListState } from '@react-stately/list';
import { useListBox, useListBoxSection, useOption } from '@react-aria/listbox';
import type { CollectionChildren, Key, Node } from '@react-types/shared';
import styles from './Listbox.module.css';

/**
 * Listbox — the W5 (Selection) template component. Behavior/a11y is 100% borrowed from React
 * Aria (`@react-stately/list`'s `useListState` + `@react-aria/listbox`'s `useListBox`/`useOption`/
 * `useListBoxSection`) per BLUEPRINT §7 / component-engineer.md ("ห้ามเขียน ... roving tabindex
 * เอง") — this is the first component in the system to reach for React Aria instead of Radix,
 * because Radix has no standalone listbox primitive (only bundled inside its Select). Everything
 * below is either (a) wiring React Aria's collection/state/behavior hooks together, or (b) the
 * token-driven visual layer on top of the DOM props those hooks return, or (c) translating React
 * Aria's own vocabulary into Dial's public Collection Vocabulary (D-024) at the props boundary —
 * no keyboard handler, focus index, or typeahead buffer is written by hand anywhere in this file.
 *
 * API Vocabulary Contract (D-024): every Collection-family component (Listbox, Select, Combobox,
 * MultiSelect, Menu/Dropdown, ContextMenu, TagInput's suggestion list) speaks `selectedKeys` /
 * `defaultSelectedKeys` / `onSelectionChange` / `disabledKeys` regardless of which engine sits
 * underneath — Menu/ContextMenu (Radix-based per D-023) must translate Radix's own prop names to
 * this vocabulary at their own props boundary, the same way this file translates React Aria's
 * `Selection` type (which can be the literal string `'all'`) into a plain `Set<Key>` before it
 * ever reaches a caller's `onSelectionChange` — see `normalizeSelection` below.
 *
 * Reuse Check (component-engineer.md step 0): grepped `packages/react/src/components/` for any
 * existing selection/listbox/roving-tabindex behavior before starting — none exists. Popover only
 * supplies positioning/dismissal (Radix `react-popover`), not option semantics; Radio/Checkbox/
 * Switch are single native-input selection controls (native browser roving focus per-`name`
 * group), not multi-item collections with programmatic roving `tabindex`. Nothing to reuse or
 * extend; a new component is warranted.
 *
 * Anatomy: root `ul[role=listbox]` (via `useListBox`) -> `Listbox.Item` children (each rendered
 * as `li[role=option]` via `useOption`, containing the option's label text and, when selected, a
 * checkmark glyph — non-color cue per BLUEPRINT §7, see Listbox.module.css `.checkmark`) and/or
 * `Listbox.Section` children (each rendered as `li[role=presentation]` -> optional heading ->
 * `ul[role=group]` via `useListBoxSection`, grouping a labelled run of options — ARIA technically
 * disallows headings as direct listbox children, so the heading is hidden from assistive tech via
 * `role="presentation"` and only serves as the group's *visual* label; the group's actual
 * accessible name comes from `aria-labelledby` pointing at that same hidden heading element,
 * exactly as `useListBoxSection` wires it).
 *
 * A11y: root carries `role="listbox"` + an accessible name (see `aria-label`/`aria-labelledby`
 * doc below for the FormField-aware required/optional split). Each option carries `role="option"`
 * + `aria-selected` synced to real selection state (not a CSS class) + roving `tabindex` — all
 * from `useOption`/`useListBox`. Bootstrap state: before any option has ever been focused, the
 * root `ul` itself is `tabindex=0` and every option is `tabindex=-1` (ARIA Authoring Practices'
 * documented roving-tabindex startup state — Tab lands on the listbox container first); the
 * instant an option is focused (click or Tab-in-then-Arrow), tabindex moves onto that option (root
 * becomes `-1`, that option becomes `0`) and stays there as Arrow keys move it between options —
 * confirmed by `Listbox.test.tsx` (jsdom-provable click-focus transition) and
 * `w5-listbox.spec.ts`'s `expectRovingTabindex`/`expectTabOut` (real-browser Arrow-key/Tab
 * transitions, the latter proven via a round-trip Shift+Tab-in assertion after a compound-
 * invariant investigation — see that file's Gate Proof log item 7). Arrow Up/Down move the active
 * option and do NOT wrap (React Aria's `useSelectableCollection` defaults `shouldFocusWrap` to
 * `false`; this component does not override that default — verified by reading the resolved
 * `@react-aria/selection` source directly: package.json specifies `^3.13.6` for
 * `@react-aria/listbox`, but the lockfile actually resolves its `@react-aria/selection` dependency
 * to `3.28.1`, whose implementation now lives inside the bundled `react-aria` package at
 * `react-aria/dist/private/selection/useSelectableCollection.js` — checked that exact file, not an
 * older cached copy or the docs). Home/End jump to the first/last option. Typing a character jumps
 * to the next option whose text starts with it (React Aria's built-in `useTypeSelect`, wired
 * automatically inside `useSelectableCollection` — nothing added here). `Mod+A` (Cmd/Ctrl+A) selects
 * every option when `selectionMode="multiple"` (React Aria's built-in select-all, confirmed firing
 * in a real browser) — this is the actual use case behind the `'all'` value `Selection` can take;
 * see `normalizeSelection` for how that string never leaks into this component's public callback.
 * Scroll-into-view when an off-screen option is focused is also automatic (`useSelectableCollection`
 * calls `scrollIntoViewport` from `@react-aria/utils`) but **only when the focus change's modality
 * is `'keyboard'`** — confirmed by direct experimentation: a raw `element.focus()` call (no keydown
 * involved) leaves `scrollTop` unchanged, while pressing an actual arrow/Home/End key scrolls the
 * container. This only works in a real browser; jsdom has no scroll layout, so it is proven in
 * `packages/conformance/specs/w5-listbox.spec.ts` (which drives focus via `page.keyboard.press`,
 * not `el.focus()`), not `Listbox.test.tsx` (Honesty Rule).
 *
 * Controlled/uncontrolled (BLUEPRINT §7): `selectedKeys`/`onSelectionChange` for controlled,
 * `defaultSelectedKeys` for uncontrolled — `useListState` supplies this duality already; this
 * component's own addition on top is normalizing every `Selection` value (which can be the string
 * `'all'`) to a plain `ReadonlySet<Key>` before it crosses either boundary, so no caller of this
 * component ever has to branch on `'all'` vs a real Set — see `normalizeSelection`.
 *
 * Performance ceiling (no virtualization): this component (and, by inheritance, every W5 sibling
 * that reuses this collection pattern) renders every `Listbox.Item`/`Listbox.Section` child as a
 * real DOM node — there is no windowing/virtualization render-prop. This is an accepted ceiling,
 * not an oversight: Select/Combobox in this system are specced to stay comfortable up to roughly
 * **300-500 options** (the point where unvirtualized list benchmarks commonly start showing
 * scroll-jank on mid-range hardware); past that, a future virtualized variant (e.g. wrapping
 * `react-aria`'s own `useVirtualizer`-compatible layout delegate) would need its own component,
 * not a silent prop added here. Recorded in `packages/spec/listbox.md`'s Accessibility section so
 * Select/Combobox's specs can cite the same ceiling instead of re-deriving it.
 */

export interface ListboxProps {
  /** `'single'` (default) or `'multiple'`. Mirrors ARIA listbox's `aria-multiselectable`. */
  selectionMode?: 'single' | 'multiple';
  /**
   * Controlled selected keys (D-024 Collection Vocabulary). Always a plain `ReadonlySet<Key>` —
   * never the literal string `'all'`, even though the user can select everything via `Mod+A` or a
   * future "select all" affordance; this component normalizes that internally (see module doc)
   * so no caller ever has to special-case it. Omit + use `defaultSelectedKeys` for uncontrolled.
   */
  selectedKeys?: ReadonlySet<Key>;
  /** Initial selected keys for uncontrolled usage — same `ReadonlySet<Key>` shape as `selectedKeys`. */
  defaultSelectedKeys?: ReadonlySet<Key>;
  /** Fires whenever selection changes (user interaction, `Mod+A`, or programmatic). Always a
   * plain `ReadonlySet<Key>` — see `selectedKeys` doc. */
  onSelectionChange?: (keys: ReadonlySet<Key>) => void;
  /**
   * Keys of options that cannot be focused, selected, or otherwise interacted with (D-024
   * Collection Vocabulary — the single vocabulary decision for "disabled" across every
   * Collection-family component). This is the *only* way to disable an option: there is no
   * per-`Listbox.Item` `isDisabled` prop, so disabled state always lives in one data-driven place
   * a caller can derive from a data source, instead of being scattered across JSX call sites.
   */
  disabledKeys?: Iterable<Key>;
  /**
   * Accessible name for the listbox root. **Required only when this Listbox is used standalone**
   * (outside a `FormField`) — a listbox with no label at all is a real, if easy to make,
   * accessibility bug (BLUEPRINT §7). When nested directly inside `FormField`, omit both this and
   * `aria-labelledby`: `FormField` clones its child with `aria-labelledby` pointing at its own
   * generated label id, exactly the way it already wires `Input`/`Textarea`/`Checkbox` — passing
   * an explicit `aria-label` here too would give the option list *two* competing accessible names,
   * which `packages/conformance/specs/w5-listbox.spec.ts`'s `FormField integration` test asserts
   * against (a screen reader must announce the field's name exactly once, not twice).
   */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** `Listbox.Item`/`Listbox.Section` children (React Aria Collection API — see those exports
   * below). */
  children: CollectionChildren<object>;
  className?: string;
}

/**
 * Listbox.Item — a single option, declared as a child of `Listbox` (or `Listbox.Section`). This
 * is a thin re-export of `@react-stately/collections`'s `Item` (React Aria's Collection API): it
 * renders nothing itself at the JSX level — `useListState`'s internal `CollectionBuilder` walks
 * these elements at render time to build the actual option collection that `Listbox` iterates
 * over and `useOption` attaches behavior to. Re-exported under the `Listbox.Item` name (not bare
 * `Item`) so every W5 sibling that reuses this same collection pattern (Select/Combobox/
 * MultiSelect/TagInput's suggestion popup — NOT RadioCards, which D-023 assigns to native
 * `<input type=radio>` instead, having no React Aria collection underneath it at all) can follow
 * one consistent `<Family.Item>` naming convention instead of everyone importing a bare `Item`
 * from React Aria directly. (RadioCards still borrows the `<Family.Item>` naming convention for
 * its own `RadioCards.Item` — just not this file's implementation.)
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

/**
 * Listbox.Section — a labelled group of `Listbox.Item` children (React Aria Collection API's
 * `Section`, re-exported the same way `Listbox.Item` re-exports `Item` — see that doc for why the
 * `<Family.X>` naming convention exists). Required in the template now, not deferred: Select and
 * Combobox both need grouped options (e.g. "Recent" / "All countries") and every sibling in this
 * wave must reuse this exact grouping shape rather than each inventing its own, per the same
 * lesson `roving-focus.md` already documents about VisuallyHidden's duplicated clip-path.
 */
interface ListboxSectionProps {
  key?: Key;
  /** Visible heading text for the group. Omit only if `aria-label` is given instead (a section
   * still needs *some* accessible name even with no visible heading). */
  title?: ReactNode;
  /** Accessible name for the group when there is no visible `title` — mirrors `Listbox`'s own
   * `aria-label`/`aria-labelledby` split at the section level. */
  'aria-label'?: string;
  /** `Listbox.Item` children belonging to this group. */
  children: CollectionChildren<object>;
}

const ListboxSection = Section as unknown as ((props: ListboxSectionProps) => ReactNode) & {
  getCollectionNode: (props: ListboxSectionProps, context?: unknown) => Generator<unknown>;
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

interface ListboxSectionRenderProps {
  item: Node<object>;
  state: ReturnType<typeof useListState<object>>;
}

/**
 * Internal section renderer — calls `useListBoxSection` (React Aria) for the group/heading DOM
 * props (see module doc's Anatomy note for the `role="presentation"` + `aria-labelledby` wiring),
 * then walks `item.childNodes` to render each nested `Option`.
 */
function ListboxSectionRender({ item, state }: ListboxSectionRenderProps) {
  const { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: item.rendered,
    'aria-label': item['aria-label'],
  });

  return (
    <li {...itemProps} className={styles.section}>
      {item.rendered ? (
        <span {...headingProps} className={styles.sectionHeading}>
          {item.rendered}
        </span>
      ) : null}
      <ul {...groupProps} className={styles.sectionGroup}>
        {[...item.childNodes].map((node) => (
          <Option key={node.key} item={node} state={state} />
        ))}
      </ul>
    </li>
  );
}

interface ListboxComponent {
  (props: ListboxProps & { ref?: React.Ref<HTMLUListElement> }): ReactNode;
  displayName: string;
  Item: typeof ListboxItem;
  Section: typeof ListboxSection;
}

/**
 * Normalizes React Aria's `Selection` type (a `Set<Key>`, OR the literal string `'all'` when
 * every item is selected — e.g. via `Mod+A`) into a plain `ReadonlySet<Key>` by resolving `'all'`
 * against the live collection's actual keys. This is the one place `'all'` is allowed to exist in
 * this file; it never crosses the `selectedKeys`/`defaultSelectedKeys`/`onSelectionChange` props
 * boundary, so callers of `Listbox` (and, by the same pattern, every W5 sibling) never have to
 * write an `if (keys === 'all')` branch just to use this component (item 4 of the API review).
 */
function normalizeSelection(
  selection: 'all' | Set<Key>,
  collection: { getKeys(): Iterable<Key> },
): ReadonlySet<Key> {
  return selection === 'all' ? new Set(collection.getKeys()) : selection;
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
  if (process.env.NODE_ENV !== 'production' && !ariaLabel && !ariaLabelledby) {
    // eslint-disable-next-line no-console
    console.warn(
      'Listbox: no aria-label or aria-labelledby. This is only safe when nested directly inside ' +
        'FormField (which supplies aria-labelledby automatically) — a standalone Listbox needs one ' +
        'of the two, or screen reader users get an unlabelled option list.',
    );
  }

  const state = useListState<object>({
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange: onSelectionChange
      ? (keys) => onSelectionChange(normalizeSelection(keys, state.collection))
      : undefined,
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
      {[...state.collection].map((item) =>
        item.type === 'section' ? (
          <ListboxSectionRender key={item.key} item={item} state={state} />
        ) : (
          <Option key={item.key} item={item} state={state} />
        ),
      )}
    </ul>
  );
}) as unknown as ListboxComponent;

Listbox.displayName = 'Listbox';
Listbox.Item = ListboxItem;
Listbox.Section = ListboxSection;

export type { Key } from '@react-types/shared';
