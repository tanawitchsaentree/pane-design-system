# pane-react changelog

Every entry names the component it touches, so each component page in the book can show its own history. The conformance run fails if a component has no entry.

## 0.4.0 (2026-10-28)

- IconButton: a small round pane with Button's material (gloss, rim, pointer glint); quiet, so it no longer lifts on hover. A 44px press area around both sizes.
- Tabs: a carved track; the chosen tab is the blue accent sheet and slides to the tab the reader picks. Unchosen tabs lose their rings (D-023). A 44px press area on every tab.
- Chip: off is a small glass pane; chosen is pressed into the glass with a check and a heavier weight, so chosen chips add no loud marks. A 44px press area.
- Tag: etched into the glass instead of ringed.
- Badge: no fill. Each status tone has its own glyph shape in its colour and the word in the text colour. `dot` now applies to neutral only.
- Avatar: a portrait behind a lens with the pane's rim of light; the white ring on `lg` is replaced by a soft shadow.
- Slider: a carved channel filled with blue to the value, and the Switch's lit bead as the thumb, with a 44px press area on the thumb.
- Button, Select: a 44px press area at the small size too. Input `sm` is the one exception (E-002).
- Tokens: removed `badge.*-bg`, `badge.*-fg`, `badge.neutral-ring`, `tabs.ring`, `chip.ring`, `tag.ring`, `avatar.ring`, `avatar.ring-width`, `slider.track-ring`; added the etch, portrait and press-area tokens.
- Button: redrawn as a small pane (round 2, R-010). The fill is a sheet lit at its top and shaded at its foot, with the pane's own rim, a glint that follows the pointer, and a blue shadow under the accent. Only the loud kinds lift; a press tightens the shadow.
- Switch: a recess carved into the glass with a lit bead (R-007). A press squashes the bead toward its travel.
- Input, Textarea, InputGroup, PinInput: a groove with a lit bottom lip whose edge measures at least 3:1 on glass and on plain pages in both themes (R-009). A search field no longer disappears on white.
- Checkbox, Radio: the box is a carved recess with a 3:1 edge.
- Select: the trigger is Input's groove; the open list's rows nest the sheet corner (radius = sheet radius minus the even 6px inset), are 44px tall, the highlighted row is a lit lens with a pointer glint, and the check leads the chosen row (R-008).
- Tokens: `elevation.cast*`, `elevation.bead`, `elevation.carve*`, `elevation.groove`, `elevation.lens`, `surface.carve`, `surface.knob-shade`, `line.edge`, `action.gloss*`, `action.glint*`, `action.accent-foot`, `action.solid-top`, `action.foot-solid`, and the primitives behind them. `select.item-radius` is removed; the row radius is computed from `select.menu-radius` and `select.menu-inset`.
- Environment: `material="solid"` turns every pane inside opaque and switches the backdrop filter off, for live backdrops such as a 3D scene (D-021).
- Radio: an arrow key pressed and released at once now chooses the option it moves to, as a held key always did (scripted presses, switch devices and some screen readers).
- Checkbox: every prop documented.
- Switch: every prop documented.
- PinInput: every prop documented.

## 0.3.0 (2026-10-27)

- Input: First release, part of the W3 form family drawn as a well in the pane (D-020).
- Textarea: First release, part of the W3 form family drawn as a well in the pane (D-020).
- Checkbox: First release, part of the W3 form family drawn as a well in the pane (D-020).
- Radio: First release, part of the W3 form family drawn as a well in the pane (D-020).
- Switch: First release, part of the W3 form family drawn as a well in the pane (D-020).
- FormField: First release, part of the W3 form family drawn as a well in the pane (D-020).
- Label: First release, part of the W3 form family drawn as a well in the pane (D-020).
- HelperText: First release, part of the W3 form family drawn as a well in the pane (D-020).
- Fieldset: First release, part of the W3 form family drawn as a well in the pane (D-020).
- InputGroup: First release, part of the W3 form family drawn as a well in the pane (D-020).
- PinInput: First release, part of the W3 form family drawn as a well in the pane (D-020).
- Packaging: a semantic `opacity.disabled` token and `elevation.well`, used by every new form control.

## 0.2.0 (2026-10-27)

- Banner: Redrawn from the concept (derivation C, picked by the user) as a line written on the pane with a hairline, no box, no stripe and no tinted disc. Tones are glyph shapes, glyph colours and spoken words. Arriving and dismissing open and close its height. onDismiss now runs after the line has closed.
- Select: First release. The list is a Pane popup drawn from tokens with typeahead and full keyboard support, never the operating system menu.
- Slider: First release, with a visible label and value, a 44px hit area and a white knob that reads in both themes.
- Packaging: `pane-react/styles.css` and `pane-tokens/css` now ship type declarations, so `tsc` passes on TypeScript 6 and later, which check side-effect imports by default.

## 0.1.0 (2026-10-26)

- Environment: First release with three brightness levels. Dim and mid resolve to the bright value until they are calibrated (E-001).
- Card: First release with glass, inset and solid variants and a cover slot. Glass dims the photo behind it instead of greying it (D-010, D-011).
- Card: Light theme lifts and whitens the scene and sets ink text (D-015).
- Avatar: First release with photo, initials fallback and three sizes.
- Button: First release with light, accent and glass variants and the soft hover lift.
- Button: In the light theme the loud solid is ink with white text (D-015).
- IconButton: First release. The type now requires aria-label.
- Tabs: First release, built on Radix Tabs with pill styling.
- Tag: First release, outline small caps label.
- Container: First release with four widths and margins that grow at each breakpoint (D-014).
- Grid: First release with 4, 8 and 12 columns and per breakpoint spans (D-014).
- Stack: First release with row and column direction and the gap scale.
- Badge: First release with five tones and an optional dot.
- Chip: First release with toggle and input forms.
- Banner: First release with four tones, a live option and dismiss.
