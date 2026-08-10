// Barrel manifest — the ONLY file that decides what's in `packages/react/src/index.ts` and in
// what order. Component agents never touch the root index.ts (see tooling/generate-barrel.mjs's
// header for why); a batch adds its components here once, at the end, then runs the generator.
//
// Each block's `header` becomes a comment in the generated file; `components` lists directory
// names under `src/components/` in build order — the generator reads each one's OWN `index.ts`
// (already the single source of truth for that component's public exports) rather than
// duplicating export lists here.

export const BARREL_MANIFEST = [
  {
    header: `Wave 1 (W1 Layout+Primitives, D-012): Box, Flex, Stack, Grid, Container, Center, Spacer,
Divider, AspectRatio, VisuallyHidden. Built in dependency order (ds-conventions):
Box -> Flex -> {Stack, Center} -> {Grid, Container, Spacer, Divider, AspectRatio} -> VisuallyHidden.`,
    components: ['Box', 'Flex', 'Stack', 'Center', 'Grid', 'Container', 'Spacer', 'Divider', 'AspectRatio', 'VisuallyHidden'],
  },
  {
    header: `Wave 2 (W2 Atoms-Core, D-013): Text, Heading, Icon, Button, IconButton, Link, Badge, Avatar,
Spinner, Skeleton, Kbd, Image. Built in the order recommended by production-run (least- to
most-dependent): Text/Heading/Icon/Kbd/Badge (independent) -> Button -> IconButton (extends
Button) -> Link -> Avatar -> Spinner -> Skeleton -> Image (uses AspectRatio from Wave 1).`,
    components: ['Text', 'Heading', 'Icon', 'Kbd', 'Badge', 'Spinner', 'Button', 'IconButton', 'Link', 'Avatar', 'Skeleton', 'Image'],
  },
  {
    // Shared token-shaped prop types (not a component — lives at src/types.ts).
    raw: `export type {
  SpaceToken,
  FontSizeToken,
  FontWeightToken,
  TextColorToken,
  IconSizeToken,
  AvatarSizeToken,
  ControlSizeToken,
  RadiusToken,
  ColorRoleToken,
  ActionIntent,
} from './types';`,
  },
  {
    header: `Wave 3 (W3 Forms-Core, D-015): Label, HelperText, Input, Textarea, Checkbox, Radio, Switch,
Fieldset, InputGroup, FormField, PinInput. Built in the order recommended by production-run
(least- to most-dependent): Label/HelperText (reuse Text) -> Input -> Textarea (mirrors Input)
-> Checkbox -> Radio (mirrors Checkbox) -> Switch -> Fieldset -> InputGroup (reuses Flex from
Wave 1) -> FormField (composes Label+control+HelperText) -> PinInput (most complex, built last).`,
    components: ['Label', 'HelperText', 'Input', 'Textarea', 'Checkbox', 'Radio', 'Switch', 'Fieldset', 'InputGroup', 'FormField', 'PinInput'],
  },
  {
    header: `Wave 4 (W4 Web Overlays, D-018/D-017): Popover, Tooltip, Dialog, Drawer, Toast, Snackbar. Built
in the order recommended by production-run (establish the Radix-Popper pattern first, then the
Radix-Dialog pattern, then the provider pattern): Popover -> Tooltip (share positioning
primitive shape) -> Dialog (heaviest, most-depended-on by later waves) -> Drawer (reuses
Dialog's Radix state machine, only the CSS entrance/exit animation differs, D-018) -> Toast
(provider pattern) -> Snackbar (reuses Toast's ToastProvider/context, D-018 Reuse Check).`,
    components: ['Popover', 'Tooltip', 'Dialog', 'Drawer', 'Toast', 'Snackbar'],
  },
  {
    header: `Wave 5 (W5 Selection, D-022): Listbox is the template for the rest of the wave (Select,
Combobox, MultiSelect, TagInput's suggestion popup reuse its React Aria collection/behavior
pattern and its Roving Focus conformance contract — see packages/conformance/specs/_patterns/
roving-focus.md — RadioCards/Rating do NOT: D-023 assigns them to native \`<input type=radio>\`
instead, having no React Aria collection underneath at all). First component in the system
built on React Aria instead of Radix (Radix has no standalone listbox primitive).`,
    components: ['Listbox'],
  },
  {
    header: `RadioCards (D-023: native <input type=radio> grouped by \`name\`, no Radix/React Aria — a radio
group's roving focus/Arrow-key cycling is native browser behavior, same reasoning as Radio.tsx)
(D-024: Standalone Control vocabulary — \`value\`/\`defaultValue\`/\`onChange\`, NOT
\`selectedKeys\`/\`onSelectionChange\`, since it has one value, not a keyed collection).`,
    components: ['RadioCards'],
  },
  {
    header: `D-023: RadioCards, Rating are Standalone Controls (D-024) built on native \`<input
type=radio>\` grouped by \`name\` (same technique as Radio/Checkbox/Switch), not on the React
Aria collection stack Listbox introduced above — see Rating.tsx's own doc comment for the full
engine-choice reasoning.`,
    components: ['Rating'],
  },
  {
    header: `Wave 7 (W7 Data Display): Table (basic) — plain native <table>/<thead>/<tbody>/<tr>/<th>/<td>,
no behavior library (browser gives correct screen reader semantics for free). Deliberately NOT
sortable/filterable/virtualized/column-resizable — that scope belongs to W9's DataGrid
(TanStack Table + TanStack Virtual), a different component on the other side of the T2/T3 Rigor
Tier boundary (see packages/spec/table.md).`,
    components: ['Table'],
  },
  {
    header: `Wave 7 (Data Display): Stat. T1 static (re-classified from the batch's default T2 — see
Stat.tsx's module doc: no onClick/onChange/user-driven state, so it fails the T1-vs-T2 test in
ds-conventions ("ไม่มี interactivity จริงเลย = T1"), same class as Badge/Skeleton, not
Button/Card). Reuse Check: composes Text (every text role) + Icon (trend glyph) — no font/SVG
sizing re-implemented.`,
    components: ['Stat'],
  },
  {
    header: `Wave 7 (Data Display): Alert. T2 (interactive only in the trivial "has a native <button>"
sense via its optional dismiss control — no focus trap/roving tabindex/overlay, per
ds-conventions Rigor Tiers table), so no conformance spec (Playwright)/Gate Proof mutation is
required. Reuse Check: no existing component owned this anatomy — Toast/Snackbar are
transient+portal-rendered (wrong shape for a persistent in-flow banner), Badge has no
title/description/dismiss slots. Colors are 100% reused from Toast's variant.* (color.feedback.*)
and Badge's role.*.subtleBg/subtleText — no new hue introduced (see alert.json's
$description for the full contrast self-check table, including one inherited E-001-class
exception for the 'default' variant's accent bar, same token+role as Toast's own).`,
    components: ['Alert'],
  },
  {
    header: `Card — pulled ahead of its catalog wave (see demo-app GAP #1: settings-page sections had no
bordered container and fell back to Stack+Divider). T2 (clickable variant borrows 100% of its
keyboard/focus behavior from the native <button>/<a> it renders, same as Button/Link — no focus
trap/roving tabindex/overlay of its own), so no conformance spec (Playwright)/Gate Proof
mutation required. Reuse Check: no existing component owned this anatomy — RadioCards.Item is
the closest bordered-clickable-card precedent but is scoped to radio-group selection (D-023),
not reusable as a general container; Card.Media reuses AspectRatio (D-012) directly instead of
re-implementing ratio math. D-008 note: zero shadow.* tokens in card.json — Card sits in the
page flow, it never floats above it, unlike Dialog/Popover/Toast.`,
    components: ['Card'],
  },
];
