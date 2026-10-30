// Barrel manifest — the ONLY file that decides what's in src/index.ts and in what order
// (see tooling/generate-barrel.mjs).
export const BARREL_MANIFEST = [
  {
    header: `Layout (D-014): Container, Grid/GridItem, Stack — columns, gutters, margins and breakpoints from tokens.`,
    components: ['Container', 'Grid', 'Stack', 'Box', 'Flex', 'Center', 'Spacer', 'Divider', 'AspectRatio', 'VisuallyHidden'],
  },
  {
    header: `Anchor A — the parts of the profile card: Environment, Card, Avatar, Button, IconButton, Tabs, Tag.`,
    components: ['Environment', 'Card', 'Avatar', 'Button', 'IconButton', 'Tabs', 'Tag'],
  },
  {
    header: `Status (D-014): Badge, Chip, Banner.`,
    components: ['Badge', 'Chip', 'Banner'],
  },
  {
    header: `Form controls (D-017): Select, Slider — Radix behaviour, Pane look, never the OS menu.`,
    components: ['Select', 'Slider'],
  },
  {
    header: `W3 forms (D-020): the well in the pane. Field parts first, because the controls read FormField's context.`,
    components: ['Label', 'HelperText', 'FormField', 'Fieldset', 'Input', 'Textarea', 'InputGroup', 'PinInput', 'Checkbox', 'Radio', 'Switch'],
  },
  {
    header: `Media (D-029): Mesh — a mesh gradient for scenes, covers and icons, never a control's fill.`,
    components: ['Mesh'],
  },
  {
    header: `Wave 2 atoms (0.7.0): type, links, keys, pictures and loading.`,
    components: ['Text', 'Heading', 'Icon', 'Link', 'Kbd', 'Image', 'Spinner', 'Skeleton'],
  },
  {
    header: `Wave 4 overlays (0.7.0): the stack's levels 3 and 4 (D-025) on Radix behaviour.`,
    components: ['Dialog', 'Sheet', 'Drawer', 'ActionSheet', 'Popover', 'Tooltip', 'Toast', 'Snackbar', 'FAB', 'PullToRefresh'],
  },
  {
    header: `Wave 5 selection (0.7.0): Select’s sheet and Input’s groove, on the WAI-ARIA patterns.`,
    components: ['Listbox', 'Combobox', 'Autocomplete', 'MultiSelect', 'Menu', 'ContextMenu', 'RadioCards', 'Rating', 'TagInput'],
  },
  {
    header: `Wave 6 navigation (0.7.0): the tab track, glass bars and the chosen pane.`,
    components: ['SegmentedControl', 'BottomNav', 'Navbar', 'Sidebar', 'Breadcrumb', 'Pagination', 'Stepper', 'Accordion', 'NavigationMenu', 'TableOfContents'],
  },
  {
    header: `Wave 7 data display (0.7.0): the carved channel, level-2 panes and hairline rows.`,
    components: ['Progress', 'Meter', 'Stat', 'EmptyState', 'Timeline', 'DescriptionList', 'List', 'Table'],
  },
  {
    header: `Wave 8 inputs (0.7.0): Input's groove, Slider's channel and named swatches.`,
    components: ['PasswordInput', 'SearchInput', 'NumberInput', 'RangeSlider', 'Editable', 'FileUpload', 'Dropzone', 'ColorPicker', 'OTPFlow'],
  },
  {
    header: `Wave 9 complex data (0.7.0): round days, the chosen pane, Table's grid and the data palette (D-031).`,
    components: ['Calendar', 'DatePicker', 'TimePicker', 'TreeView', 'Carousel', 'VirtualList', 'TransferList', 'DataGrid', 'BarChart', 'LineChart', 'Sparkline', 'Heatmap'],
  },
  {
    header: `Wave 10 patterns (0.7.0): compositions of the waves before, with the error summary, palette and board.`,
    components: ['Form', 'Wizard', 'AuthForm', 'CommandPalette', 'NotificationCenter', 'CoachMark', 'KanbanBoard', 'Feed', 'AppShell', 'SettingsLayout', 'RichTextEditor'],
  },
  {
    header: `Indicators (0.7.0): a stepped scale on Slider's channel, and the radar profile on the data palette.`,
    components: ['Scale', 'RadarChart'],
  },
  {
    header: `Diagrams and evidence (0.7.0): a confidence chip on the sequential ramp, a canvas node, a network graph and a sequence diagram.`,
    components: ['ConfidenceChip', 'NodeCard', 'NetworkGraph', 'SequenceDiagram'],
  },
  {
    header: `Language (0.7.0): one catalog for every word a component shows or speaks, English by default, Thai included.`,
    components: ['PaneProvider'],
  },
];
