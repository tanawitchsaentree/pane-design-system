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
import { APP_SHELL, AUTH_FORM, COACH_MARK, COMMAND_PALETTE, FEED, FORM, KANBAN_BOARD, NOTIFICATION_CENTER, RICH_TEXT_EDITOR, SETTINGS_LAYOUT, WIZARD } from './wave10';
import { BAR_CHART, RADAR_CHART, SCALE, CALENDAR, CAROUSEL, DATA_GRID, DATE_PICKER, HEATMAP, LINE_CHART, SPARKLINE, TIME_PICKER, TRANSFER_LIST, TREE_VIEW, VIRTUAL_LIST } from './wave9';
import { COLOR_PICKER, DROPZONE, EDITABLE, FILE_UPLOAD, NUMBER_INPUT, OTP_FLOW, PASSWORD_INPUT, RANGE_SLIDER, SEARCH_INPUT } from './wave8';
import { DESCRIPTION_LIST, EMPTY_STATE, LIST, METER, PROGRESS, STAT, TABLE, TIMELINE } from './wave7';
import { ACCORDION, BOTTOM_NAV, BREADCRUMB, NAVBAR, NAVIGATION_MENU, PAGINATION, SEGMENTED_CONTROL, SIDEBAR, STEPPER, TABLE_OF_CONTENTS } from './wave6';
import { ACTION_SHEET, DIALOG, DRAWER, FAB_DEPTH, POPOVER, PULL_TO_REFRESH, SHEET, SNACKBAR, TOAST, TOOLTIP } from './wave4';
import { HEADING, ICON, IMAGE, KBD, LINK, SKELETON, SPINNER, TEXT } from './wave2';
import { ASPECT_RATIO, BOX, CENTER, DIVIDER, FLEX, SPACER, VISUALLY_HIDDEN } from './wave1';

export const DEPTH: Record<string, Depth> = { Scale: SCALE, RadarChart: RADAR_CHART, Form: FORM, Wizard: WIZARD, AuthForm: AUTH_FORM, CommandPalette: COMMAND_PALETTE, NotificationCenter: NOTIFICATION_CENTER, CoachMark: COACH_MARK, KanbanBoard: KANBAN_BOARD, Feed: FEED, AppShell: APP_SHELL, SettingsLayout: SETTINGS_LAYOUT, RichTextEditor: RICH_TEXT_EDITOR, Calendar: CALENDAR, DatePicker: DATE_PICKER, TimePicker: TIME_PICKER, TreeView: TREE_VIEW, Carousel: CAROUSEL, VirtualList: VIRTUAL_LIST, TransferList: TRANSFER_LIST, DataGrid: DATA_GRID, BarChart: BAR_CHART, LineChart: LINE_CHART, Sparkline: SPARKLINE, Heatmap: HEATMAP, PasswordInput: PASSWORD_INPUT, SearchInput: SEARCH_INPUT, NumberInput: NUMBER_INPUT, RangeSlider: RANGE_SLIDER, Editable: EDITABLE, FileUpload: FILE_UPLOAD, Dropzone: DROPZONE, ColorPicker: COLOR_PICKER, OTPFlow: OTP_FLOW, Progress: PROGRESS, Meter: METER, Stat: STAT, EmptyState: EMPTY_STATE, Timeline: TIMELINE, DescriptionList: DESCRIPTION_LIST, List: LIST, Table: TABLE, SegmentedControl: SEGMENTED_CONTROL, BottomNav: BOTTOM_NAV, Navbar: NAVBAR, Sidebar: SIDEBAR, Breadcrumb: BREADCRUMB, Pagination: PAGINATION, Stepper: STEPPER, Accordion: ACCORDION, NavigationMenu: NAVIGATION_MENU, TableOfContents: TABLE_OF_CONTENTS, Mesh: MESH, Listbox: LISTBOX, Combobox: COMBOBOX, Autocomplete: AUTOCOMPLETE, MultiSelect: MULTI_SELECT, Menu: MENU, ContextMenu: CONTEXT_MENU, RadioCards: RADIO_CARDS, Rating: RATING, TagInput: TAG_INPUT, Dialog: DIALOG, Sheet: SHEET, Drawer: DRAWER, ActionSheet: ACTION_SHEET, Popover: POPOVER, Tooltip: TOOLTIP, Toast: TOAST, Snackbar: SNACKBAR, FAB: FAB_DEPTH, PullToRefresh: PULL_TO_REFRESH, Text: TEXT, Heading: HEADING, Icon: ICON, Link: LINK, Spinner: SPINNER, Skeleton: SKELETON, Kbd: KBD, Image: IMAGE, Box: BOX, Flex: FLEX, Center: CENTER, Spacer: SPACER, Divider: DIVIDER, AspectRatio: ASPECT_RATIO, VisuallyHidden: VISUALLY_HIDDEN, Checkbox: CHECKBOX, Fieldset: FIELDSET, FormField: FORM_FIELD, HelperText: HELPER_TEXT, Input: INPUT, InputGroup: INPUT_GROUP, Label: LABEL, PinInput: PIN_INPUT, Radio: RADIO, Switch: SWITCH, Textarea: TEXTAREA, Avatar: AVATAR, Badge: BADGE, Banner: BANNER, Button: BUTTON, Card: CARD, Chip: CHIP, Container: CONTAINER, Environment: ENVIRONMENT, Grid: GRID, IconButton: ICON_BUTTON, Select: SELECT, Slider: SLIDER, Stack: STACK, Tabs: TABS, Tag: TAG };
