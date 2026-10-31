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

## Round 4 · 2026-10-29 · one light from above, no blue (D-024)

Lab: `apps/lab/round4/index.html`, after the user's reference (monochrome glass, every atom lit from above).

| Scope | Options | Picked | Why |
|---|---|---|---|
| Every component (Button, IconButton, Chip, Tabs, Switch, Slider, Select check, Card rim) | A one light from above · B chosen as a recess · C A with a spectral edge | **A** | The same top-lit rim, sheen and short shadow on every atom; loud is the white lit solid and accent the same solid with its own glow; chosen is lighter glass. B reads chosen as pressed off. C spends a hue the system no longer owns. |
| Chip chosen | white solid (lab A) · lighter glass | **lighter glass** | Several chosen filters must not become several loud solids (P5). In the light theme the chosen glass is darker, because a white chip on white glass would differ only by its check. |
| Tabs chosen | — | **lighter glass** | **Supersedes D-009's blue chosen tab**, at the user's word. |

## Round 5 · 2026-10-29 · thick smoked glass, the streak, and levels (D-025)

Lab: `apps/lab/round5/index.html` (the user's OpenGlass-style reference beside Pane 0.5.0).

| Scope | Picked | Why |
|---|---|---|
| Every pane and control | **A, the reference read straight** | A smoked body thick enough to read as a slab, a faint edge all round, shade at the foot, a short streak where light catches the top edge, deep soft shadows. The user: "แบบนี้ดูเป็น glass กว่าเยอะ". |
| Loud action | **warm off-white with a bloom** | As in the reference; reads as lit glass rather than a white hole. |
| IconButton | **added `loud`, a white bead** | The one main action in a toolbar or dock, as in the reference. |
| Slider thumb | **a capsule** | As in the reference; a wider thing to grab. |
| Levels | **1 pane · 2 surface in a pane · 3 overlay on a scrim · 4 popover**, each ≥1.15:1 from what is under it | The user asked for stacked glass that reads as levels, with a formula and a check by eye. Light level 2 had to go to a 12% ink tint to pass. |
| Slider `fill` (D-026) | **variant of Slider, label and value inside, thin lit marker** | The user's reference; same behaviour and API as Slider, so a variant rather than a new component. |
| Mesh (D-029, D-030) | **A, pools melted** (apps/lab/mesh/) | Four pools placed where the light is and blurred into each other; B (no blur) reads as spotlights, C (conic) swirls around one centre. Presets aurora, ember, tide, dusk; a product's own colours through `colors`. |
| Divider (wave 1) | **A, etched** (apps/lab/wave1/) | Shade over light, a groove like every recess (P3); an ink hairline owns a colour (P1), fading ends vanish on bright scenes. Box, Flex, Center, Spacer, AspectRatio, VisuallyHidden have no form (identity: false). |
| Link (wave 2) | **A, underline in the text colour** (apps/lab/wave2/) | Found by its underline without a hue (P1, WCAG 1.4.1); blue was rejected (R-012). |
| Spinner (wave 2) | **A, lit arc in a groove** | The light model at its smallest (P3); dots bounce (P4), a pulsing disc reads as an alert. |
| Skeleton (wave 2) | **A, carved recess that breathes** | Pressed into the glass like the field it becomes (P3), a slow breath not a shimmer (P4). |
| Kbd (wave 2) | **A, lit keycap** | A small Pane slab lit from above; a bordered grey box brings a colour and a border. |
| Image (wave 2) | **A, fade in over the carve** | Settles instead of popping (P4); waits and fails as a recess, never a white box (P3). Text, Heading and Icon have no form (identity: false). |
| Dialog (wave 4) | **A, level-3 pane over a scrim** (apps/lab/wave4/) | The measured stack (D-025); a full-screen sheet hides the context, an inline panel is not a dialog. |
| Sheet (wave 4) | **A, level-3 pane from an edge** | Belongs to its edge; a grabber drags it closed; Drawer is the same Sheet from a side. |
| ActionSheet (wave 4) | **A, actions with Cancel apart** | The way out is always in one place and never beside the critical action (P5). |
| Popover (wave 4) | **A, level-4 pane without an arrow** | The top of the stack next to its trigger; an arrow and a border are not needed on glass. |
| Tooltip (wave 4) | **A, glass pill on hover, focus and tap** | Reaches every input (P6); hover-only tips never show on touch. |
| Toast (wave 4) | **A, level-4 pane with a status mark** | Colour stays on the mark (P5); a filled banner shouts in a hue. |
| Snackbar (wave 4) | **A, level-4 pill at the bottom** | At thumb reach, one line and Undo. |
| FAB (wave 4) | **A, loud bead at the bottom end** | The loud solid glowing strong (P5) at thumb reach (P6), never a brand-colour disc. |
| PullToRefresh (wave 4) | **A, pull with a focusable Refresh button** | The gesture people expect, with the button WCAG 2.5.1 needs. |
| Listbox (wave 5) | **A, Select’s rows in a recess with checks** (apps/lab/wave5/) | One family with Select (D-017); a chosen row is a pane with a check (P6). |
| Combobox (wave 5) | **A, Input’s groove with a filtering sheet** | Typing and choosing stay in one field (WAI-ARIA combobox). Autocomplete and MultiSelect share its form. |
| Menu (wave 5) | **A, Select’s sheet with grouped rows** | Opaque so actions read on any scene; rows nest the corner (R-008). ContextMenu shares its form. |
| RadioCards (wave 5) | **A, level-2 cards, chosen glass with a check** | The stack plus a mark (P6), never only a coloured border. |
| Rating (wave 5) | **A, loud solid stars and outlines** | No gold (P1); count and shape carry the score (P6). |
| TagInput (wave 5) | **A, chips in a groove** | Chip is the system’s removable value; each tag edits on its own. |
| SegmentedControl (wave 6) | **A, the tab track with chosen glass** (apps/lab/wave6/) | Kin to Tabs (D-023); a white thumb on grey is the OS look. |
| BottomNav (wave 6) | **A, a floating pill dock** | The dock from the reference, a chosen pane and a semibold label. |
| Navbar (wave 6) | **A, a glass strip** | Keeps the scene and reads on scroll; a solid bar brings a hue. |
| Sidebar (wave 6) | **A, a pane with chosen glass** | The book’s own sidebar in the system. |
| Breadcrumb (wave 6) | **A, underlined links and chevrons** | Follows Link, no blue. |
| Pagination (wave 6) | **A, round steps with chosen glass** | The chosen pane; bordered squares box every number. |
| Stepper (wave 6) | **A, marks on a groove** | Every state by shape (P6); the current step glows as a mark. |
| Accordion (wave 6) | **A, grooves between headings** | The page stays a page; grey bars box it. |
| NavigationMenu (wave 6) | **A, disclosure panels on press** | Works on touch and keyboard; hover mega menus do not. |
| TableOfContents (wave 6) | **D chosen pane and weight** | D marks by shape and weight with the same chosen pane as Sidebar. A is the habitual accent stripe (G-X1). B brings blue. C adds numbers the sections do not have. |
| Progress (wave 7) | **A carved channel, loud fill** | A shares the slider channel (P3) and has no hue (P1). B brings a hue and busy motion. C hides the amount in a small circle. |
| Meter (wave 7) | **A loud fill, status glyph and word** | A keeps the fill without hue and puts the news in a glyph and a word (P1, P6). B rests on hue alone. C quantises a reading that is continuous. |
| Stat (wave 7) | **A large number, arrow and mark** | A says the change by shape and words (P6) with colour only on the arrow (P1). B rests on a hue and adds a pane. C belongs to Charts in wave 9. |
| EmptyState (wave 7) | **A glyph in a well, title, way out** | A is a recess like Skeleton (P3) and leaves the action as the loud thing. B brings colour. C gives the eye nowhere to land. |
| Timeline (wave 7) | **A dots on a hairline rail** | A carries every state by shape (P6) without hue (P1). B brings hues. C stacks panes inside panes. |
| DescriptionList (wave 7) | **A tones and space** | A tells term from detail by tone and size (P2). B adds borders on every cell. C puts label colons in front of every value. |
| List (wave 7) | **A inset pane, hairlines from the text** | A is one pane with quiet hairlines (P3). B draws a box per row. C adds a grey that owns nothing. |
| Table (wave 7) | **A pane with an opaque header** | A keeps the data the loudest thing (P3, P2). B brings hue. C draws a grid around every value. |
| Editable (wave 8) | **A text button with a pencil** | A edits where the text is (P4) and is all keyboard (P6). B adds a control per value. C makes every value look like a form. |
| Dropzone (wave 8) | **A carved groove that lifts** | A is a recess like every field (P3) and says over by shape (P6). B brings a dash and a hue. C gives a drag nowhere to land. |
| ColorPicker (wave 8) | **A named swatches with hex** | A names every colour (P6) and keeps the picker without hue (P1). B hides names behind a square. C looks different on every platform. |
| Calendar (wave 9) | **A round days, loud solid** | A keeps the one solid for the choice (P5) and every state by shape (P6). B brings a hue and a grid of lines. C hides the shape of the month. |
| TreeView (wave 9) | **A indent and chevron** | A says nesting by indent and state by shape (P3, P6). B adds ink. C stacks panes in panes. |
| Carousel (wave 9) | **A snap row, controls under** | A moves only when the reader moves it (P4) and keeps the photo clear. B moves by itself. C hides how many slides there are. |
| BarChart (wave 9) | **A thin bars, data palette** | A follows the dataviz mark specs with hue only on marks (D-031). B adds ink. C cannot tell series apart. |
| LineChart (wave 9) | **A thin lines, end labels** | A follows the mark specs and labels ends (dataviz). B invents values. C is the first chart mistake. |
| Heatmap (wave 9) | **A one hue, faint to full** | A is sequential, one hue light to dark (dataviz). B has no visible order. C is a table, which the table view already is. |
| Form (wave 10) | **A error summary at the top** | A puts every error in one place that takes focus (P6). B is easy to miss. C disappears before it is read. |
| CommandPalette (wave 10) | **A level-3 pane near the top** | A keeps the page in view behind the scrim (P3). B hides it. C cannot be opened from anywhere. |
| CoachMark (wave 10) | **A anchored card, no scrim** | A points without blocking (P3). B covers the page. C teaches out of context. |
| KanbanBoard (wave 10) | **A panes, keys and drag** | A moves by keyboard as well as pointer (P6). B leaves keys out. C loses the board. |
| RichTextEditor (wave 10) | **A few tools over the groove** | A keeps the system type (P2) and the field family (P3). B lets text leave the system. C asks readers to learn syntax. |
| Scale (indicators) | **A stepped channel, bead and ring** | A shows the steps and both positions by shape (P6) on the slider material (P3). B rests on hue. C cannot show a value between steps or a comparison. |
| RadarChart (indicators) | **A thin outlines with a wash** | A keeps overlapping shapes readable (dataviz). B hides one behind another. C loses the profile at a glance. |
| ConfidenceChip (diagrams) | **A dots in one hue with a word** | A reads by count and word (P6). B reads as pass or fail. C gives false precision to a judgement. |
| NodeCard (diagrams) | **A level-2 pane with ports** | A uses the system material and its chosen state (P3). B adds a hue the concept does not ask for. C loses where links attach. |
| NetworkGraph (diagrams) | **A hairlines with a lit neighbourhood** | A shows structure on a quiet grid (dataviz). B is noise. C loses the shape of the network. |
| SequenceDiagram (diagrams) | **A lanes with a spoken list** | A keeps the picture and the words (P6). B shuts out screen readers. C loses who talks to whom at a glance. |
| ButtonGroup (wave A) | **A hairline seam, squared inner corners** | A reads as one object of parts on glass (P3). B frames it twice. C merges the buttons into one blur. |
| SplitButton (wave A) | **A one variant, joined** | A keeps one weight for one action (P5). B splits the weight. C hides the usual action behind a menu. |
| ChatMessage (J4) | **A chosen-glass turn, plain answer** | A keeps the answer as content and marks the reader's turn without a hue (P1, P3). B adds two hues. C loses who said what at a glance. |
| ChatComposer (J4) | **A carved well with a loud bead** | A matches every field and keeps one loud thing (P3, P5). B adds a hue. C makes Send hard to hit with a thumb. |
| AgentStatus (J4) | **A glyph, a word and the steps** | A says what and where without colour (P6). B rests on hue. C says nothing about the task. |
| HumanHandoff (J4) | **A quiet row that names who** | A keeps calm and names the person and the wait (P2, P6). B alarms. C gives no way to accept or decline. |
| Citation (J4) | **A round chip that opens a card** | A checks a claim in place (P6). B is a hue and a tiny target. C makes the reader match numbers by hand. |
