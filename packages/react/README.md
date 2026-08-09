# @dial/react

React components for Dial — a Braun-derived design system (calm, restrained, accent-scarce). Presentational primitives styled entirely through CSS variables from [`@dial/tokens`](https://www.npmjs.com/package/@dial/tokens); behavior for anything with real keyboard/focus complexity is borrowed from [Radix UI](https://www.radix-ui.com/) or [React Aria](https://react-spectrum.adobe.com/react-aria/), never hand-rolled.

## Install

```bash
npm install @dial/react @dial/tokens react react-dom
```

`@dial/tokens` is **required**, not optional — every component's stylesheet references `var(--ds-*)` custom properties that only `@dial/tokens`'s own CSS defines. Installing `@dial/react` alone gives you unstyled markup with no error to tell you why.

## Setup

Import both stylesheets once, near your app's root (order doesn't matter — they don't overlap):

```tsx
import '@dial/tokens/css';
import '@dial/react/styles.css';
```

For dark mode, also import `@dial/tokens/css/dark` and set `document.documentElement.setAttribute('data-theme', 'dark')` — see [`@dial/tokens`'s README](https://www.npmjs.com/package/@dial/tokens) for the full theme-switching details (including the high-contrast variant).

## Usage

```tsx
import { FormField, Input, Button, Stack } from '@dial/react';

function SignInForm() {
  return (
    <Stack gap="400">
      <FormField label="Email" required>
        <Input type="email" placeholder="jane@example.com" />
      </FormField>
      <Button intent="primary">Sign in</Button>
    </Stack>
  );
}
```

Every form control follows the same controlled/uncontrolled duality as its native HTML counterpart (`value`/`onChange` or `defaultValue`), and every component that manages a collection of items (`Listbox`) speaks a consistent `selectedKeys`/`onSelectionChange` vocabulary instead of leaking whichever behavior engine sits underneath it.

## What's in v0.1 ("S")

**Layout** — `Box`, `Flex`, `Stack`, `Grid`, `Container`, `Center`, `Spacer`, `Divider`, `AspectRatio`, `VisuallyHidden`

**Atoms** — `Text`, `Heading`, `Icon`, `Button`, `IconButton`, `Link`, `Badge`, `Avatar`, `Spinner`, `Skeleton`, `Kbd`, `Image`

**Forms** — `Label`, `HelperText`, `Input`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `Fieldset`, `InputGroup`, `FormField`, `PinInput`

**Overlays** — `Popover`, `Tooltip`, `Dialog`, `Drawer`, `ToastProvider`/`useToast`, `useSnackbar`

**Selection (partial)** — `Listbox`, `RadioCards`, `Rating`

44 named exports in total. Every one has passed this system's full accessibility gate: real-browser keyboard/focus tests (not just jsdom), a non-color cue for every state that isn't conveyed by color alone, forced-colors mode support, and WCAG AA contrast verified against the actual built token values.

## What's NOT in v0.1 yet

- **Select, Combobox, MultiSelect, TagInput, Menu/Dropdown, ContextMenu** — the rest of the Selection wave; in progress
- **Card, Alert, Table** — planned for v0.2
- **Navigation** (Tabs, Breadcrumbs, Pagination, NavMenu) and richer **data display** (Table sorting/filtering, Timeline, Stat) — planned for v0.3
- **X-class components** (DataGrid, Charts, DatePicker, RichText editor) — planned for v1.0, each wrapping a proven headless engine rather than being hand-built

See the repo's roadmap for the full S → M → L → XL plan.

## Peer dependencies

```json
{ "react": "^18.3.1 || ^19.0.0", "react-dom": "^18.3.1 || ^19.0.0" }
```

## License

MIT
