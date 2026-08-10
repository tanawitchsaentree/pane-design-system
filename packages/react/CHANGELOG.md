# dial-react

## 0.1.0

First public release ("S" tier — see `docs/ROADMAP.md` for what M/L/XL add next).

48 components covering Layout, Atoms, Forms, Overlays, a partial Selection wave, and a slice of Data Display pulled forward ahead of catalog order because a real page needed it (see `examples/demo-app`):

- **Layout**: Box, Flex, Stack, Grid, Container, Center, Spacer, Divider, AspectRatio, VisuallyHidden
- **Atoms**: Text, Heading, Icon, Button, IconButton, Link, Badge, Avatar, Spinner, Skeleton, Kbd, Image
- **Forms**: Label, HelperText, Input, Textarea, Checkbox, Radio, Switch, Fieldset, InputGroup, FormField, PinInput
- **Overlays**: Popover, Tooltip, Dialog, Drawer, Toast (`ToastProvider`/`useToast`), Snackbar (`useSnackbar`)
- **Selection (partial)**: Listbox, RadioCards, Rating
- **Data Display (partial)**: Card, Alert, Table, Stat

Every component: real-browser keyboard/focus conformance tests where the component's behavior actually needs one (T3 rigor tier — Listbox, Dialog, etc.), a non-color cue for every state, forced-colors mode support, and WCAG AA contrast verified against the actual built token values — not hand-calculated estimates.
