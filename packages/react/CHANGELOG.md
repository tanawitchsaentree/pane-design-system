# @dial/react

## 0.1.0

First public release ("S" tier — see the repo root's roadmap for what M/L/XL add next).

44 components covering Layout, Atoms, Forms, Overlays, and a partial Selection wave:

- **Layout**: Box, Flex, Stack, Grid, Container, Center, Spacer, Divider, AspectRatio, VisuallyHidden
- **Atoms**: Text, Heading, Icon, Button, IconButton, Link, Badge, Avatar, Spinner, Skeleton, Kbd, Image
- **Forms**: Label, HelperText, Input, Textarea, Checkbox, Radio, Switch, Fieldset, InputGroup, FormField, PinInput
- **Overlays**: Popover, Tooltip, Dialog, Drawer, Toast (`ToastProvider`/`useToast`), Snackbar (`useSnackbar`)
- **Selection (partial)**: Listbox, RadioCards, Rating

Every component: real-browser keyboard/focus conformance tests (not just jsdom), a non-color cue for every state, forced-colors mode support, and WCAG AA contrast verified against the actual built token values — not hand-calculated estimates.
