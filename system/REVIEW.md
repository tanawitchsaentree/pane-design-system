# Review log

Every pick the agent made on the user's behalf (`autonomy.picks: "agent"`), for one review at the
milestone. Each row names the lab where the alternatives are rendered, the pick, and the reason from
the principles. Overrule any row and the component goes back through its derivation.

## Round 2 · 2026-10-28 · after R-007 to R-010

Lab: `apps/lab/round2/index.html` (open it from the repo, switch Dark/Light and the scene).

| Component | Options | Picked | Why |
|---|---|---|---|
| Button | A lit sheet · B a small pane of coloured glass · C tinted glass | **B** | The button carries the pane's own rim and sheen (P3), lifts with a shadow only when loud (P5), and a glint follows the pointer (P4 interaction). A has no rim and no answer to the pointer. C breaks P5 (loud fill must be opaque) and measured 2.6:1 white text on light glass. |
| Switch | A carved well, lit bead · B lamp · C capsule in a slot | **A** | Keeps D-020's well and carves it: shade under the top lip, light on the bottom lip (P1 depth); the knob is a lit bead (P3); a press squashes it toward its travel (P4). Edge 3.0 to 4.8:1 in both themes. B's glow is asked for by no principle and measured 2.7:1 off in light. |
| Input (and Textarea, InputGroup, PinInput) | A deeper well, ringed · B carved lip · C ring only | **B** | A groove read by its two lips; the lit bottom lip is P3's light catching an edge and carries the 3:1 edge, with an ink ring added in light where white light on white measures nothing (P2). A is a ring around a box; C is the outlined field every kit ships. |
| Select (trigger and flyout) | A concentric inset · B concentric lens · C full-bleed rows | **B** | Row radius is computed as sheet radius minus inset, same inset on all sides (P3 shape, the rule the old flyout broke). The highlighted row is a lens lit on its top edge with a pointer glint, and the check leads the chosen row (P6). The trigger is Input's groove. C's dividers are not needed for short lists. |

Each member of the forms family also names its own default now (Checkbox, Radio, Fieldset, FormField,
HelperText, InputGroup, PinInput, Textarea), instead of the one family sentence copied into all of them.

## Round 3 · 2026-10-28 · the eight components built before derivation

Lab: `apps/lab/round3/index.html`. Card is not in it: Card is the anchor the user picked (D-008).

| Component | Options | Picked | Why |
|---|---|---|---|
| IconButton | A a small round pane · B glyph with a lens · C capsule | **A** | Button B at the size of a glyph, so icon buttons and buttons read as one family (P3). B is invisible until hovered; C breaks the round shape a single glyph asks for. |
| Tabs | A a pane sliding in a recess · B lens row · C underline | **A** | One carved track holds the choices (P1 depth); the chosen tab is the blue accent sheet and slides to the new choice (P4). **Supersedes part of D-009:** unselected tabs lose their rings, because a row of rings reads as a row of buttons. D-009's blue for the chosen tab stays. |
| Chip | A small panes · B recesses that rise · C pressed into the glass | **C** | A and B make every chosen chip a loud solid, so three filters put three loud marks on a pane (P5). C: off is a small pane to press, on is pressed into a carved recess with a check (P4, P6). The first C (rings) was too faint and was replaced in the lab before the pick. |
| Tag | A ringed caps · B etched · C caps with a dot | **B** | Etched into the glass, so it can never be mistaken for a button (P3 interaction). |
| Badge | A glyph and word · B etched with a glyph · C glass pill with a glyph | **A** | Banner's language (D-018) at word size: a glyph per tone in its mark colour, the word in text colour, no fill (P1, P6). |
| Avatar | A a lens · B rounded square · C set in a recess | **A** | The portrait gets the pane's rim of light and a soft shadow, no white ring (P3). |
| Slider | A carved channel and bead · B graduated · C thick lamp | **A** | Switch's material stretched out: carved channel filled with blue to the value, the same lit bead (P1, P3). |
