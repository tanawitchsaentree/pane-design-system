# pane-react changelog

Every entry names the component it touches, so each component page in the book can show its own history. The conformance run fails if a component has no entry.

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
