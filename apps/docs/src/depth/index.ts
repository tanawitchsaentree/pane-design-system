// Usage-tab content per component. A component missing here renders its first-edition notes and
// fails G-K2 until its depth file is written.
import type { Depth } from './types';
import { AVATAR } from './avatar';
import { BADGE } from './badge';
import { BANNER } from './banner';
import { BUTTON } from './button';
import { CARD } from './card';
import { CHIP } from './chip';
import { ICON_BUTTON } from './icon-button';
import { CHECKBOX, FIELDSET, FORM_FIELD, HELPER_TEXT, INPUT, INPUT_GROUP, LABEL, PIN_INPUT, RADIO, SWITCH, TEXTAREA } from './forms';
import { CONTAINER, ENVIRONMENT, GRID, STACK } from './layout';
import { SELECT, SLIDER } from './select';
import { TABS } from './tabs';
import { TAG } from './tag';
import { MESH } from './mesh';
import { AUTOCOMPLETE, COMBOBOX, CONTEXT_MENU, LISTBOX, MENU, MULTI_SELECT, RADIO_CARDS, RATING, TAG_INPUT } from './wave5';
import { ACCORDION, BOTTOM_NAV, BREADCRUMB, NAVBAR, NAVIGATION_MENU, PAGINATION, SEGMENTED_CONTROL, SIDEBAR, STEPPER, TABLE_OF_CONTENTS } from './wave6';
import { ACTION_SHEET, DIALOG, DRAWER, FAB_DEPTH, POPOVER, PULL_TO_REFRESH, SHEET, SNACKBAR, TOAST, TOOLTIP } from './wave4';
import { HEADING, ICON, IMAGE, KBD, LINK, SKELETON, SPINNER, TEXT } from './wave2';
import { ASPECT_RATIO, BOX, CENTER, DIVIDER, FLEX, SPACER, VISUALLY_HIDDEN } from './wave1';

export const DEPTH: Record<string, Depth> = { SegmentedControl: SEGMENTED_CONTROL, BottomNav: BOTTOM_NAV, Navbar: NAVBAR, Sidebar: SIDEBAR, Breadcrumb: BREADCRUMB, Pagination: PAGINATION, Stepper: STEPPER, Accordion: ACCORDION, NavigationMenu: NAVIGATION_MENU, TableOfContents: TABLE_OF_CONTENTS, Mesh: MESH, Listbox: LISTBOX, Combobox: COMBOBOX, Autocomplete: AUTOCOMPLETE, MultiSelect: MULTI_SELECT, Menu: MENU, ContextMenu: CONTEXT_MENU, RadioCards: RADIO_CARDS, Rating: RATING, TagInput: TAG_INPUT, Dialog: DIALOG, Sheet: SHEET, Drawer: DRAWER, ActionSheet: ACTION_SHEET, Popover: POPOVER, Tooltip: TOOLTIP, Toast: TOAST, Snackbar: SNACKBAR, FAB: FAB_DEPTH, PullToRefresh: PULL_TO_REFRESH, Text: TEXT, Heading: HEADING, Icon: ICON, Link: LINK, Spinner: SPINNER, Skeleton: SKELETON, Kbd: KBD, Image: IMAGE, Box: BOX, Flex: FLEX, Center: CENTER, Spacer: SPACER, Divider: DIVIDER, AspectRatio: ASPECT_RATIO, VisuallyHidden: VISUALLY_HIDDEN, Checkbox: CHECKBOX, Fieldset: FIELDSET, FormField: FORM_FIELD, HelperText: HELPER_TEXT, Input: INPUT, InputGroup: INPUT_GROUP, Label: LABEL, PinInput: PIN_INPUT, Radio: RADIO, Switch: SWITCH, Textarea: TEXTAREA, Avatar: AVATAR, Badge: BADGE, Banner: BANNER, Button: BUTTON, Card: CARD, Chip: CHIP, Container: CONTAINER, Environment: ENVIRONMENT, Grid: GRID, IconButton: ICON_BUTTON, Select: SELECT, Slider: SLIDER, Stack: STACK, Tabs: TABS, Tag: TAG };
