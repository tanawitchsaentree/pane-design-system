# @dial/tokens

Design tokens for Dial — [DTCG](https://tr.designtokens.org/format/) JSON source, built with [Style Dictionary](https://styledictionary.com/) into CSS variables, a Tailwind preset, SCSS, TypeScript types, and flat JSON. Three-layer architecture (primitive → semantic → component) and three themes (light, dark, light-contrast-more).

## Install

```bash
npm install @dial/tokens
```

## Usage — CSS variables (most common)

```ts
import '@dial/tokens/css';               // light theme, always active — this is the base
import '@dial/tokens/css/dark';          // adds dark theme, gated behind [data-theme="dark"]
import '@dial/tokens/css/light-contrast-more'; // adds high-contrast light, gated behind [data-theme="light"][data-contrast="more"]
```

Only the light import is unconditional — the other two theme stylesheets define their variables under an attribute selector and do nothing until you set that attribute:

```ts
document.documentElement.setAttribute('data-theme', 'dark');
// or, to switch back:
document.documentElement.removeAttribute('data-theme');
```

`light.css` also includes an automatic `@media (prefers-contrast: more)` block, so OS-level high-contrast preference is honored without setting any attribute — `data-contrast="more"` is only needed for an explicit in-app toggle.

Every component in [`@dial/react`](https://www.npmjs.com/package/@dial/react) consumes these same `--ds-*` variables — importing `@dial/tokens/css` is what makes `@dial/react`'s components render styled instead of unstyled.

## Usage — Tailwind

```js
// tailwind.config.js
module.exports = {
  presets: [require('@dial/tokens/tailwind')],
};
```

## Usage — SCSS / raw JSON

```scss
@import '@dial/tokens/scss'; // light theme; /scss/dark and /scss/light-contrast-more also available
```

```ts
import tokens from '@dial/tokens/json'; // flat JSON, same three theme variants under /json/dark, /json/light-contrast-more
```

## What's in v0.1

Color (warm-neutral ramp + a single scarce brand accent), spacing (8px base unit), typography (flat 1.2 ratio scale, one font family for heading and body), radius, shadow/elevation, motion (duration + easing), border, sizing (including the `size.control.*` scale every interactive component's hit area is built against).

## License

MIT
