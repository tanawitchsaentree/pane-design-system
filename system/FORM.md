# FORM — Dial's form language, derived from the measured Braun reference (Phase 2.5)

> **REWRITE, not a patch** — per the `dial-braun-rederivation` order's derivation-order step 1.
> The previous version of this file was written from a text description of the Braun lineage with
> no reference image attached (the `form-language` order, 2026-08-13, earlier the same day). This
> version replaces it entirely, built from real measurements taken against the actual reference
> image the operator attached (`system/refs/braun-catalog-reference.png` — a 22-device Braun
> product illustration grid). Every claim below that could be measured, was — pixel sampling,
> corner-radius ratios, gradient scans — not re-asserted from memory of what Braun hardware
> "generally" looks like. Locked via `/lock-decision` as **D-030**.
>
> Sits between Phase 1 (Foundations — spacing/type/color/radius/shadow, D-001–D-010, color values
> re-derived under D-028) and Phase 2 (Tokens). Foundations answered "what are the raw values" —
> this file answers "what does a control look like as an object," per component CLASS, in
> geometry + tokens, never adjectives.

## A correction the measurement forced — read this before the class tables below

The previous version of this file (and the order that produced this rewrite) assumed the reference
shows "a real, functional dual highlight/shadow from the extrusion itself" on every raised key —
literal photographed hardware depth. **Direct pixel measurement of the actual attached image shows
this is not quite right, and the difference matters for what gets built.**

The reference is a flat vector/icon illustration set (thin outline strokes, flat fills), not a
photograph. Measured directly: a horizontal and vertical pixel scan straight through the audio1
knob's fill (RGB sampled every 4-5px across ~150px of the knob's diameter) shows **no internal
gradient at all** — the fill holds at a near-constant RGB (≈230,113,61) from edge to edge, with
only a thin dark outline stroke at the boundary. There is no light-face/dark-face dual-tone
happening inside the knob shape itself.

What IS real and measured: a genuine, subtle **cast shadow on the body immediately around the
knob** — sampling a ring of points at a fixed radius around the knob's edge shows the body's fill
darkening from its normal ≈(213,210,204) down to ≈(197,190,180) and ≈(159,156,152) at points below
and below-left of the knob, while points above/above-right stay close to the clean body tone. This
is a real, directional, measured shadow — just cast BY the raised object onto the surface beneath
it, not rendered as a two-tone gradient across the object's own face.

**What this changes:** the depth treatment for the control class is a real, directional drop
shadow (the object casts a shadow onto its surroundings) plus a crisp outline stroke at its own
edge — not a neumorphic soft dual-tone gradient across the control's own fill. This is closer to a
"flat object + real cast shadow" language than to full skeuomorphic modeling. `shadow.raised.*`
(below) is specified accordingly: a directional single shadow (offset toward the light source's
opposite corner, per the measured darkening direction), not a two-color highlight+shadow pair.

## Component classes

Unchanged from the prior derivation — every component belongs to exactly one of five classes, the
class (not the individual component) gets the form treatment.

| Class | Definition | Examples in Dial's catalog |
|---|---|---|
| **control** | pressable — a discrete action the user triggers once | Button, IconButton, Switch, Checkbox, Radio, RadioCards |
| **input** | receiving — accepts and holds a value over time | Input, Textarea, Select, Combobox, PinInput, InputGroup |
| **surface** | containing — groups other content, itself inert | Card, Fieldset, Dialog, Drawer, Popover |
| **display** | reading — presents information, no interaction | Text, Heading, Badge, Avatar, Stat, Table |
| **separator** | dividing — marks a boundary with no content of its own | Divider, Spacer |

## Measured evidence (this section replaces guesswork with numbers)

- **Corner radius ratio:** measured directly on two independent device bodies (the clock unit and
  the tuner1 unit) by walking the top-left corner curve pixel-by-pixel until the edge goes flat.
  Clock: radius ≈20-22px on a 192px-wide body → ratio ≈0.10-0.11. Tuner1: radius ≈22-24px on a
  195px-wide body → ratio ≈0.11-0.12. **Converged measurement: corner radius ≈ 10-12% of the
  device body's own width** — a soft, generous rounding, well short of a pill, consistent with
  Dial's existing `radius.md`(12px)/`radius.lg`(16px) scale at typical control sizes (40-64px per
  D-004) — no new radius token needed, D-008's existing radius scale already lands in the right
  range; this measurement just confirms it rather than inventing a new number.
- **Accent chroma/hue:** OKLCH(L=0.676, C=0.160, H=42.5°), measured directly from the knob's flat
  fill (see D-028 for the full color re-derivation this fed into).
- **Cast shadow direction and strength:** darkest sampled point around a raised knob sits at
  roughly 90-135° (below/below-left in image coordinates) from the knob's center, at ~15-25%
  darker than the clean body tone at that same radius — a real but SUBTLE directional shadow, not
  a strong 3D render.
- **Label placement:** the reference's tuner1 unit shows "FM"/"AM" labels as small text sitting
  directly beside (not beneath) their own small round buttons — this is a real, different label
  convention from the earlier draft's assumption of "beneath icon-keys." No device in this
  reference grid shows a label physically underneath a key; that assumption is corrected below.
- **LCD/display treatment:** two distinct display languages are present, not one — (1) a segmented
  digital display (clock, tuner1's frequency readout) rendered as a pale warm-grey recessed panel
  with dark segment-style glyphs, and (2) a genuine green CRT-style readout (the "GOOD LUCK" screen
  unit) at measured OKLCH ≈(L=0.74-0.78, C=0.08-0.09, H≈140-141°) on a near-black surround. Both
  read as a recessed instrument window, consistent with the input class's inset treatment below.

## Per-class form treatment

### control (pressable)

- **Silhouette:** circular for round physical controls (knob-style), or a rounded rectangle at the
  measured ≈10-12%-of-width corner radius for rocker/rectangular keys — never a sharp rectangle,
  never a full pill unless the control is genuinely binary-toggle shaped (Switch's track — a real
  slide-switch shape, not a stretched button).
- **Depth treatment:** raised via a real DIRECTIONAL cast shadow (`shadow.raised.sm`), not a
  neumorphic two-tone gradient across the control's own fill — the measurement above found no
  internal gradient on the reference's own knobs, only a crisp outline plus a shadow cast onto the
  surrounding surface. `shadow.raised.sm` should be a single offset shadow (e.g. blur+y-offset
  toward the direction opposite the implied light source), tuned to the measured ~15-25% darkening
  strength — subtle, not heavy.
- **Corner logic:** ≈10-12% of the control's own rendered width, which already falls inside D-008's
  existing `radius.md`/`radius.lg` steps at typical control sizes — no new radius token needed.
- **Label placement — CORRECTED from the prior draft:** the reference shows labels sitting BESIDE
  small controls (tuner1's FM/AM buttons), not beneath them. The prior draft's "label beneath
  icon-key" claim was not supported by direct measurement against this specific reference and is
  retracted. IconButton's caption gap (if ever built) should place a caption to the side or below
  the whole control as a separate `display`-class element, matching this system's own existing
  label-placement conventions elsewhere, not a hardware-engraving metaphor this reference doesn't
  actually show.
- **Pressed/checked physical metaphor:** pressed = inset, not just "fill one stop darker." The
  physical key would move INTO the panel when pressed even though this specific reference doesn't
  show a pressed state directly (it's a static illustration set) — the visual analog is
  `shadow.inset.sm` replacing `shadow.raised.sm` (the shadow flips to appear cast INTO the surface,
  not just deepens) plus fill one stop darker as a secondary cue. Checked/on state for a binary
  control follows the same inset-metaphor, held rather than transient.
- **NEVER rules:**
  1. Never render `box-shadow: none` on a control's resting state if the control's class demands
     depth (G-F1's exact measurable check).
  2. Never use color alone to distinguish pressed from resting — the inset/raised swap must be
     present even where a fill-shift also happens.
  3. Never render a two-tone gradient ACROSS a control's own fill to simulate depth — the measured
     reference does not do this; depth here comes from a cast shadow plus a crisp edge stroke, not
     from shading the fill itself. This is the specific way this order's depth treatment differs
     from full neumorphism (`docs/style-recipes/neumorphism.md`), which does shade the fill.

### input (receiving)

- **Silhouette:** rectangular, softly rounded at the same measured ≈10-12% ratio, a channel set
  INTO the panel rather than a raised key — the reference's digital-display windows (clock, tuner
  frequency readout) are recessed panels, not extruded, consistent with "receiving" rather than
  "acting."
- **Depth treatment:** inset, always, not raised — `shadow.inset.sm` at rest (a permanently-
  recessed channel), never a raised state. Focus state deepens the inset slightly (one step)
  rather than flipping direction, since there's no raised state to flip from.
- **Corner logic:** same measured ratio as control class.
- **Label placement:** above the field (current `FormField`/`Label` pattern) — unchanged, already
  correct for this class.
- **Pressed/checked physical metaphor:** not applicable — filled/unfilled and valid/invalid are
  this class's real state axis (D-014/D-015's contrast work already covers this).
- **NEVER rules:**
  1. Never render an input with a raised (control-class) depth treatment — a field that looks
     pressable invites the wrong interaction model.
  2. Never make the inset effect purely a decorative border-color trick — it must be a real
     measurable depth token (G-F1 applies here too).

### surface (containing)

- **Silhouette:** stays flat, per D-008/D-029 — this class is the one place the original rule was
  already correctly applied and needs no change. A card/panel is the panel material itself, not an
  object placed on the panel.
- **Depth treatment:** flat fill + `border.interactive` (D-025's Card boundary fix) — no depth
  token for this class. D-029 (this order's shadow-policy supersede) explicitly keeps surface class
  shadow-free; only control/input classes gained structural depth.
- **Corner logic:** unchanged.
- **Pressed/checked physical metaphor:** n/a unless the surface itself is clickable (uses the
  control class's own hover/press cue on its border/fill, not a shadow).
- **NEVER rules:**
  1. Never add a raised/inset depth cue to this class just because control/input classes gained
     one — the panel-vs-key distinction the reference actually shows depends on this exemption.

### display (reading)

- **Silhouette:** no boundary of its own — text, icons, badges render as marks on the surface
  beneath them.
- **Depth treatment:** none. Never gets a depth token.
- **Corner logic:** unchanged.
- **NEVER rules:**
  1. Never add shadow/inset to a display-class component to "match" the new control language.

### separator (dividing)

- **Silhouette:** a line, unchanged from the existing `border.hairline` treatment.
- **Depth treatment:** none.
- **NEVER rules:** 1. Never give a divider a shadow or inset groove.

## Real gaps found deriving this (logged, not invented around)

1. **`shadow.raised.*`/`shadow.inset.*` tokens need to be built as single directional shadows, not
   dual-tone composites.** The prior draft assumed a neumorphic-style two-color shadow pair was
   needed; direct measurement shows the reference's own depth cue is a single cast shadow plus a
   crisp stroke. Building the dual-tone version anyway would be over-modeling relative to what the
   reference actually shows — logged so token-architect builds the simpler, measured version.
2. **IconButton has no caption prop**, and the reference doesn't actually support the
   "caption-beneath" convention the prior draft assumed — if a caption is ever added, it should
   follow this system's own existing label-placement pattern (beside/below as a separate element),
   not a hardware-engraving metaphor unsupported by this reference.
3. **This file does not itself decide whether Dial ADOPTS this treatment.** The multi-candidate
   Foundry round (variant-foundry skill) and the Lab pick are the actual decision point — this file
   states what the measured reference's form language IS, not what ships.

## Locked as

**D-030** — locked via `/lock-decision`, superseding the earlier same-day FORM.md draft (written
without a reference image) in full per this order's explicit "rewrite, not patch" instruction.
