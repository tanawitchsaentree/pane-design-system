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
