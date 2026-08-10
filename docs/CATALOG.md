# Component Catalog — 103 ตัว จัดเป็น 10 waves ตาม dependency
> ทุกตัวต้องครบ Anatomy Contract 9 ข้อ · X-class = ยืน engine ที่พิสูจน์แล้ว (คอลัมน์ engine) ห่อด้วย token ของ system

**W1 Layout+Primitives (10):** Box, Stack, Grid, Container, Spacer, Divider, VisuallyHidden, AspectRatio, Center, Flex
**W2 Atoms-Core (12):** Text, Heading, Icon, Button, IconButton, Link, Badge, Avatar, Spinner, Skeleton, Kbd, Image
**W3 Forms-Core (11):** Input, Textarea, Checkbox, Radio, Switch, Label, FormField, HelperText, Fieldset, InputGroup, PinInput
**W4 Web Overlays (6, was 10 — D-017 ตัด mobile-only ออกเพราะ D-002=web-first):** Dialog/Modal, Drawer (รวม role ของ Sheet/BottomSheet เป็น variant), Popover, Tooltip, Toast, Snackbar
**W5 Selection (9, was 10 — D-022 ยุบ Autocomplete เข้า Combobox เป็น `aria-autocomplete` mode ตาม ARIA spec):** Listbox, Select, Combobox(รองรับ autocomplete: none/list/both), MultiSelect, Menu/Dropdown, ContextMenu, RadioCards, Rating, TagInput
**W6 Navigation (11):** Tabs, BottomNav, Navbar, Sidebar, Breadcrumb, Pagination, Stepper, SegmentedControl, Accordion, NavigationMenu, Anchor/TOC
**W7 Data Display (11):** Card, Table(basic), List, DescriptionList, Stat, Timeline, Tag/Chip, Alert/Banner, EmptyState, Progress, Meter
**W8 Advanced Input (10):** Slider, RangeSlider, NumberInput, FileUpload, Dropzone, ColorPicker, Editable, PasswordInput, SearchInput, OTPFlow
**W9 X-class (12):** DataGrid[TanStack Table+Virtual], TreeView[headless-tree], DatePicker/Calendar/RangePicker[React Aria], TimePicker, Charts×4: Line/Bar/Pie/Sparkline[visx/ECharts+chart tokens], Carousel[Embla], VirtualList[TanStack Virtual], TransferList
**W10 Patterns+Shell (11):** CommandPalette[cmdk], RichTextEditor[TipTap], Form(orchestration)[react-hook-form], Wizard, AppShell, AuthForms, SettingsLayout, NotificationCenter, Onboarding/CoachMark, KanbanBoard[dnd-kit], Feed

รวม 103 (เดิม 108 — D-017 ตัด Sheet/BottomSheet ไปรวมเป็น variant ของ Drawer, ตัด ActionSheet/FAB/PullToRefresh ออกเพราะ mobile-only ขัด D-002 web-first, D-022 ยุบ Autocomplete เข้า Combobox) · แต่ละ wave = 1 BATCH API REVIEW = 1 checkpoint ของ user
