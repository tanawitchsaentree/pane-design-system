// @dial/react — public entry point.
// Wave 1 (W1 Layout+Primitives, D-012): Box, Flex, Stack, Grid, Container, Center, Spacer,
// Divider, AspectRatio, VisuallyHidden. Built in dependency order (ds-conventions):
// Box -> Flex -> {Stack, Center} -> {Grid, Container, Spacer, Divider, AspectRatio} -> VisuallyHidden.

export { Box } from './components/Box';
export type { BoxProps } from './components/Box';

export { Flex } from './components/Flex';
export type { FlexProps, FlexDirection, FlexAlign, FlexJustify, FlexWrap } from './components/Flex';

export { Stack } from './components/Stack';
export type { StackProps, StackDirection } from './components/Stack';

export { Center } from './components/Center';
export type { CenterProps } from './components/Center';

export { Grid } from './components/Grid';
export type { GridProps, GridResponsiveColumns } from './components/Grid';

export { Container } from './components/Container';
export type { ContainerProps, ContainerSize } from './components/Container';

export { Spacer } from './components/Spacer';
export type { SpacerProps } from './components/Spacer';

export { Divider } from './components/Divider';
export type { DividerProps, DividerOrientation, DividerVariant } from './components/Divider';

export { AspectRatio } from './components/AspectRatio';
export type { AspectRatioProps, AspectRatioPreset } from './components/AspectRatio';

export { VisuallyHidden } from './components/VisuallyHidden';
export type { VisuallyHiddenProps } from './components/VisuallyHidden';

// Wave 2 (W2 Atoms-Core, D-013): Text, Heading, Icon, Button, IconButton, Link, Badge, Avatar,
// Spinner, Skeleton, Kbd, Image. Built in the order recommended by production-run (least- to
// most-dependent): Text/Heading/Icon/Kbd/Badge (independent) -> Button -> IconButton (extends
// Button) -> Link -> Avatar -> Spinner -> Skeleton -> Image (uses AspectRatio from Wave 1).

export { Text } from './components/Text';
export type { TextProps } from './components/Text';

export { Heading } from './components/Heading';
export type { HeadingProps, HeadingLevel, HeadingSize } from './components/Heading';

export { Icon } from './components/Icon';
export type { IconProps } from './components/Icon';

export { Kbd } from './components/Kbd';
export type { KbdProps } from './components/Kbd';

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';

export { Spinner } from './components/Spinner';
export type { SpinnerProps } from './components/Spinner';

export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant } from './components/Button';

export { IconButton } from './components/IconButton';
export type { IconButtonProps } from './components/IconButton';

export { Link } from './components/Link';
export type { LinkProps, LinkVariant } from './components/Link';

export { Avatar } from './components/Avatar';
export type { AvatarProps, AvatarShape } from './components/Avatar';

export { Skeleton } from './components/Skeleton';
export type { SkeletonProps, SkeletonVariant } from './components/Skeleton';

export { Image } from './components/Image';
export type { ImageProps } from './components/Image';

export type {
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
} from './types';

// Wave 3 (W3 Forms-Core, D-015): Label, HelperText, Input, Textarea, Checkbox, Radio, Switch,
// Fieldset, InputGroup, FormField, PinInput. Built in the order recommended by production-run
// (least- to most-dependent): Label/HelperText (reuse Text) -> Input -> Textarea (mirrors Input)
// -> Checkbox -> Radio (mirrors Checkbox) -> Switch -> Fieldset -> InputGroup (reuses Flex from
// Wave 1) -> FormField (composes Label+control+HelperText) -> PinInput (most complex, built last).

export { Label } from './components/Label';
export type { LabelProps } from './components/Label';

export { HelperText } from './components/HelperText';
export type { HelperTextProps, HelperTextTone } from './components/HelperText';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { Textarea } from './components/Textarea';
export type { TextareaProps, TextareaResize } from './components/Textarea';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Radio } from './components/Radio';
export type { RadioProps } from './components/Radio';

export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

export { Fieldset } from './components/Fieldset';
export type { FieldsetProps } from './components/Fieldset';

export { InputGroup } from './components/InputGroup';
export type { InputGroupProps } from './components/InputGroup';

export { FormField } from './components/FormField';
export type { FormFieldProps } from './components/FormField';

export { PinInput } from './components/PinInput';
export type { PinInputProps } from './components/PinInput';

// Wave 4 (W4 Web Overlays, D-018/D-017): Popover, Tooltip, Dialog, Drawer, Toast, Snackbar. Built
// in the order recommended by production-run (establish the Radix-Popper pattern first, then the
// Radix-Dialog pattern, then the provider pattern): Popover -> Tooltip (share positioning
// primitive shape) -> Dialog (heaviest, most-depended-on by later waves) -> Drawer (reuses
// Dialog's Radix state machine, only the CSS entrance/exit animation differs, D-018) -> Toast
// (provider pattern) -> Snackbar (reuses Toast's ToastProvider/context, D-018 Reuse Check).

export { Popover } from './components/Popover';
export type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverAnchorProps,
  PopoverContentProps,
  PopoverCloseProps,
  PopoverArrowProps,
} from './components/Popover';

export { Tooltip } from './components/Tooltip';
export type {
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipContentProps,
} from './components/Tooltip';

export { Dialog } from './components/Dialog';
export type {
  DialogSize,
  DialogRootProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
} from './components/Dialog';

export { Drawer } from './components/Drawer';
export type {
  DrawerPlacement,
  DrawerRootProps,
  DrawerTriggerProps,
  DrawerContentProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  DrawerCloseProps,
} from './components/Drawer';

export { ToastProvider, useToast, ToastAction } from './components/Toast';
export type {
  ToastOptions,
  ToastVariant,
  ToastProviderProps,
  ToastActionElementProps,
} from './components/Toast';

export { useSnackbar } from './components/Snackbar';
export type { SnackbarOptions } from './components/Snackbar';

// Wave 5 (W5 Selection, D-022): Listbox is the template for the rest of the wave (Select,
// Combobox, MultiSelect, TagInput's suggestion popup reuse its React Aria collection/behavior
// pattern and its Roving Focus conformance contract — see packages/conformance/specs/_patterns/
// roving-focus.md — RadioCards/Rating do NOT: D-023 assigns them to native `<input type=radio>`
// instead, having no React Aria collection underneath at all). First component in the system
// built on React Aria instead of Radix (Radix has no standalone listbox primitive).

export { Listbox } from './components/Listbox';
export type { ListboxProps, Key } from './components/Listbox';

// RadioCards (D-023: native <input type=radio> grouped by `name`, no Radix/React Aria — a radio
// group's roving focus/Arrow-key cycling is native browser behavior, same reasoning as Radio.tsx)
// (D-024: Standalone Control vocabulary — `value`/`defaultValue`/`onChange`, NOT
// `selectedKeys`/`onSelectionChange`, since it has one value, not a keyed collection).

export { RadioCards } from './components/RadioCards';
export type { RadioCardsProps, RadioCardsItemProps } from './components/RadioCards';

// D-023: RadioCards, Rating are Standalone Controls (D-024) built on native `<input
// type=radio>` grouped by `name` (same technique as Radio/Checkbox/Switch), not on the React
// Aria collection stack Listbox introduced above — see Rating.tsx's own doc comment for the full
// engine-choice reasoning.

export { Rating } from './components/Rating';
export type { RatingProps } from './components/Rating';

// Wave 7 (W7 Data Display): Table (basic) — plain native <table>/<thead>/<tbody>/<tr>/<th>/<td>,
// no behavior library (browser gives correct screen reader semantics for free). Deliberately NOT
// sortable/filterable/virtualized/column-resizable — that scope belongs to W9's DataGrid
// (TanStack Table + TanStack Virtual), a different component on the other side of the T2/T3 Rigor
// Tier boundary (see packages/spec/table.md).

export { Table } from './components/Table';
export type {
  TableRootProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderCellProps,
  TableCellProps,
} from './components/Table';

// Wave 7 (Data Display): Stat. T1 static (re-classified from the batch's default T2 — see
// Stat.tsx's module doc: no onClick/onChange/user-driven state, so it fails the T1-vs-T2 test in
// ds-conventions ("ไม่มี interactivity จริงเลย = T1"), same class as Badge/Skeleton, not
// Button/Card). Reuse Check: composes Text (every text role) + Icon (trend glyph) — no font/SVG
// sizing re-implemented.

export { Stat } from './components/Stat';
export type { StatProps, StatTrend, StatTrendDirection } from './components/Stat';

// Wave 7 (Data Display): Alert. T2 (interactive only in the trivial "has a native <button>"
// sense via its optional dismiss control — no focus trap/roving tabindex/overlay, per
// ds-conventions Rigor Tiers table), so no conformance spec (Playwright)/Gate Proof mutation is
// required. Reuse Check: no existing component owned this anatomy — Toast/Snackbar are
// transient+portal-rendered (wrong shape for a persistent in-flow banner), Badge has no
// title/description/dismiss slots. Colors are 100% reused from Toast's variant.* (color.feedback.*)
// and Badge's role.*.subtleBg/subtleText — no new hue introduced (see alert.json's
// $description for the full contrast self-check table, including one inherited E-001-class
// exception for the 'default' variant's accent bar, same token+role as Toast's own).

export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';

// Card — pulled ahead of its catalog wave (see demo-app GAP #1: settings-page sections had no
// bordered container and fell back to Stack+Divider). T2 (clickable variant borrows 100% of its
// keyboard/focus behavior from the native <button>/<a> it renders, same as Button/Link — no focus
// trap/roving tabindex/overlay of its own), so no conformance spec (Playwright)/Gate Proof
// mutation required. Reuse Check: no existing component owned this anatomy — RadioCards.Item is
// the closest bordered-clickable-card precedent but is scoped to radio-group selection (D-023),
// not reusable as a general container; Card.Media reuses AspectRatio (D-012) directly instead of
// re-implementing ratio math. D-008 note: zero shadow.* tokens in card.json — Card sits in the
// page flow, it never floats above it, unlike Dialog/Popover/Toast.

export { Card } from './components/Card';
export type { CardRootProps, CardSectionProps, CardMediaProps } from './components/Card';
