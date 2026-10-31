// The component families, in reading order. Split from components-data so the nav can fold by family
// without loading every chapter's prose and examples.
export const CATEGORIES: Array<{ title: string; blurb: string; names: string[] }> = [
  { title: 'Layout', blurb: 'Where things go, from the page width and its columns to the space between items.', names: ['Container', 'Grid', 'Stack', 'Flex', 'Box', 'Center', 'Spacer', 'Divider', 'AspectRatio', 'VisuallyHidden'] },
  { title: 'Type', blurb: 'The words on the glass, with the headings, links, icons and keys that sit among them.', names: ['Heading', 'Text', 'Link', 'Icon', 'Kbd'] },
  { title: 'Surfaces and media', blurb: 'What content sits on, from the scene and the glass to colour and pictures.', names: ['Environment', 'Card', 'Mesh', 'Image', 'Carousel'] },
  { title: 'Actions', blurb: 'What the reader does, from the one loud action to a row of icons.', names: ['Button', 'IconButton', 'FAB', 'ButtonGroup', 'SplitButton'] },
  { title: 'Navigation', blurb: 'Where the reader is and how they move, through bars, docks, paths, pages and steps.', names: ['Tabs', 'SegmentedControl', 'Navbar', 'NavigationMenu', 'Sidebar', 'BottomNav', 'Breadcrumb', 'Pagination', 'Stepper', 'Accordion', 'TableOfContents'] },
  { title: 'Selection', blurb: 'Choosing from a set, in place or from a list that opens.', names: ['Chip', 'Select', 'Listbox', 'Combobox', 'Autocomplete', 'MultiSelect', 'Menu', 'ContextMenu', 'RadioCards', 'Rating', 'TagInput', 'TransferList'] },
  { title: 'Identity and status', blurb: 'Who something belongs to, what it is about and what state it is in.', names: ['Avatar', 'Tag', 'Badge', 'Banner'] },
  { title: 'Data display', blurb: 'Numbers, facts, rows and tables that the reader reads and compares.', names: ['Stat', 'Meter', 'Scale', 'ConfidenceChip', 'Progress', 'DescriptionList', 'List', 'Table', 'Timeline', 'EmptyState', 'DataGrid', 'TreeView', 'VirtualList'] },
  { title: 'Charts', blurb: 'Amounts, trends and patterns drawn in the data palette, each with a table view.', names: ['BarChart', 'LineChart', 'RadarChart', 'Sparkline', 'Heatmap'] },
  { title: 'Diagrams', blurb: 'Steps, links and messages between things, each with words for every part.', names: ['NodeCard', 'NetworkGraph', 'SequenceDiagram'] },
  { title: 'Working with AI', blurb: 'A conversation, an agent at work, a person taking over and the source of each claim.', names: ['ChatMessage', 'ChatComposer', 'AgentStatus', 'HumanHandoff', 'Citation'] },
  { title: 'Patterns', blurb: 'Whole steps built from the components before them, such as forms, tours, boards and the app shell.', names: ['Form', 'Wizard', 'AuthForm', 'CommandPalette', 'NotificationCenter', 'CoachMark', 'KanbanBoard', 'Feed', 'AppShell', 'SettingsLayout', 'RichTextEditor'] },
  { title: 'Loading', blurb: 'What the reader sees while content is on its way.', names: ['Spinner', 'Skeleton', 'PullToRefresh'] },
  { title: 'Overlays', blurb: 'Panes above the page at levels 3 and 4 of the stack, from a dialog to a tooltip.', names: ['Dialog', 'Sheet', 'Drawer', 'ActionSheet', 'Popover', 'Tooltip', 'Toast', 'Snackbar'] },
  { title: 'Form fields', blurb: 'Text the reader types, with its label, its help and its group.', names: ['Label', 'HelperText', 'FormField', 'Fieldset', 'Input', 'Textarea', 'InputGroup', 'PinInput'] },
  { title: 'Choices and values', blurb: 'On or off, one of a few, or an amount set by feel.', names: ['Checkbox', 'Radio', 'Switch', 'Slider'] },
  { title: 'Inputs', blurb: 'Values beyond plain text, such as secrets, searches, numbers, ranges, files, colours and codes.', names: ['PasswordInput', 'SearchInput', 'NumberInput', 'RangeSlider', 'Editable', 'FileUpload', 'Dropzone', 'ColorPicker', 'OTPFlow', 'Calendar', 'DatePicker', 'TimePicker'] },
];
