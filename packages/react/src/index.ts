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
