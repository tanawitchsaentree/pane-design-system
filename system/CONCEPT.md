# Concept — Pane

Pane is interface that floats in the reader's own space. A profile, a feed or a player sits on panes
of clear glass over a real scene (a room, a forest, a street), the way visionOS windows float in a
room. It is for personal and media apps on the web where the picture behind is part of the
experience. It must never become grey frosted plastic, decoration that costs legibility, a look that
only works on one wallpaper, or glass where people simply need to read.

## Principles

### P1 The scene is part of the interface
What is behind a pane belongs to the experience, so glass shows it instead of covering it.
**Therefore** space: panes leave the scene visible around them; gaps between panes are wide enough to see the world through. shape: not affected, because silhouette is set by P3. depth: legibility comes from dimming and blurring the backdrop (brightness, blur) inside a smoked body thick enough that a pane reads as a slab of glass, with the scene softened behind it. colour: the scene supplies the hue; the system owns no hue of its own, only white at opacities and one ink, and colour appears only where it states a status or marks a diagram. type: white on dark glass and ink on light glass, because the text colour must contrast with the dimmed or lifted scene behind it. motion: a changed scene crossfades slowly so the world changes, the interface does not jump. interaction: not affected.

### P2 Measured, not predicted
Contrast over a photograph depends on the photograph, so every value that decides legibility comes from measuring real pixels.
**Therefore** space: not affected. shape: not affected. depth: brightness, blur and tint per theme are the thinnest values that pass on every test photo; where they cannot reach 4.5:1 the gap is an open exception with a floor, never hidden. colour: opaque pairs are computed, glass pairs are measured. type: secondary text keeps the lowest opacity that still measured as passing; text halos count only where WCAG allows them. motion: not affected. interaction: focus rings carry their own dark halo so they are visible on any part of any scene.

### P3 Panes are objects in space
A pane is a physical sheet with an edge, a weight and a place in a stack.
**Therefore** space: padding inside a pane is larger than the gap between items in it, so the edge reads as the object's boundary. shape: corners are continuous and nest, so an inner surface's radius is the outer radius minus the padding between them and a pane inside a pane reads as inside it; controls are full pills because they are held in the hand. depth: light falls from above, so every surface carries a rim brightest along its top edge and a soft shadow below that says where it floats, and a recess is the inverse, shaded under its top lip and lit on its bottom lip; a nested surface adds no second blur, because one sheet of glass is one layer. colour: the rim and sheen are white at low opacity, like light catching an edge. type: not affected. motion: panes enter by rising a short distance and settling, as an object placed in space would. interaction: the whole pane is never a hidden button; actions sit on it as separate objects.

### P4 Things settle
Objects have weight, so they arrive, respond and come to rest instead of snapping.
**Therefore** space: movement distances are small (a 2px lift, an 8 to 16px rise) so the layout never appears to move. shape: a pressed control shrinks slightly, as something pushed. depth: hover lifts a control a little closer. colour: colour changes ease at the same pace as movement so the two read as one event. type: not affected. motion: long ease-out curves (420 to 640ms) for arriving and hovering, a shorter one (200ms) for pressing because a press is a reply; under reduced motion every duration is zero at the token level. interaction: nothing moves on its own; every motion answers something the reader did.

### P5 One loud thing per pane
A reader should never have to choose between two equal calls to action.
**Therefore** space: the loud action sits apart from secondary ones, never between them. shape: the loud action is a solid pill; everything else is a quiet pill or text. depth: the solid fill sits on top of the glass and is the only opaque mark on a pane. colour: one solid fill exists, the loud solid (white in dark, ink in light); a promoted action is the same solid glowing with its own light, and a pane uses one of them. type: the loud action uses the heaviest weight on the pane after the title. motion: only the loud action lifts with a shadow. interaction: the loud action is the default focus when a pane opens.

### P6 Reachable by anyone
Glass is a mood, never the carrier of meaning, so everything works without it and without sight of it.
**Therefore** space: every target is at least 44px in its smaller dimension or has a 44px hit area. shape: selected and pressed states change shape or add a mark (a check, a ring), never only colour. depth: reduced transparency and forced colours replace glass with an opaque surface and keep borders, so structure survives. colour: status is spoken in text as well as shown in colour. type: labels and names exist for assistive tech even when hidden visually. motion: reduced motion removes it entirely. interaction: keyboard reaches everything a pointer can, with a visible focus ring on any backdrop.

### P7 Reading surfaces stay ordinary
Where people read or configure (documentation, settings, forms), the scene would only compete with the words.
**Therefore** space: reading lines are about 70 characters with generous line height. shape: reading layouts use plain rectangles and hairlines, no floating panes. depth: opaque page, raised and sunken surfaces; no blur. colour: neutral greys from the same ink and white the glass uses. type: 16px reading size at 1.6 line height. motion: none beyond the controls' own. interaction: links look like links and labels look like labels, so the two stay distinct.

## Light

One light falls from above (D-024). Every surface reflects it, with a rim brightest on the top edge, a sheen at the top and shade at the foot. In the dark theme a few white parts also **give off** light of their own (D-027). What decides it is what the part says, whatever its colour.

- **Glows strong when it is the promoted action.** The accent Button and the loud IconButton are the one thing on a pane that shines on purpose (P5). At most one per pane.
- **Glows soft when it is on, or when it is a lit amount.** A Switch that is on, a Slider's filled channel, a progress or meter fill. Power and quantity read as light.
- **Glows as a mark when it says now.** The marker where a fill slider's value stops, the current step or day in a tracker, a live indicator. It is small, so its glow is a little wider than the mark.
- **Reflects and never glows.** Text and icons (glow blurs a letter), edges and rims, chosen glass (a selected tab, a picked segment), objects the hand holds (a slider bead, a switch knob), identity (an avatar), status colours (a glow would bleed the hue), anything disabled.
- **In the light theme nothing glows.** The same parts read by their solid ink, and light only falls.

**Therefore** depth: a glow is centred on its part with no offset, because it is emitted rather than cast, and it is gone within 32px so it never fogs the pane. colour: glow is white at opacity, never a hue. interaction: glowing marks state, never hover; hover still lifts. The glow tokens (glow.strong, glow.soft, glow.mark) are the only ones allowed to emit, and G-GL1 measures each from pixels, glow on against glow off.
