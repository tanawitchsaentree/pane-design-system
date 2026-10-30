# RETRO — what the user caught, and which step made it

One entry per criticism. The fix is a change to the step that produced the result, not only a new check.

### R-001: Banner is AI slop
- **Date:** 2026-10-27
- **User said:** "banner นี่แม่งวิ่งเข้าหา ai slop เต็มๆ … แม่งวิ่งไปหา design เหี้ยๆ แบบนี้ทุกรอบ"
- **What was wrong:** an accent stripe on the start edge, a tinted icon disc, a bold title over muted text: Carbon's inline notification with glass on top. Nothing in it came from the concept.
- **Step that produced it:** component creation. After the one anchor round, every component started from "what pattern libraries do" and got tokens applied; reasons were written afterwards and explained the habit.
- **What changed in that step:** kiln `references/derivation.md`: default to avoid → lineage reference → derivation quoting the principles → three variants → user pick → code. The derivation-guard hook blocks component CSS/TSX before that.
- **Check that now catches it:** rationale derivation checks (selftest 15/15), G-X1 (flags this banner's stripe and icon disc).

### R-002: dropdown, slider and flyout were not designed
- **Date:** 2026-10-27
- **User said:** "dropdown flyout ก็ไม่ทำ ไปเอาของระบบมาเฉย" · "slider นี้คือส่วนนึงของ design system หรือยังไง"
- **What was wrong:** the docs needed controls, so they were made on the spot: first native and docs-only CSS, then Radix defaults with a white iOS knob.
- **Step that produced it:** docs controls were treated as plumbing, outside the component pipeline.
- **What changed in that step:** controls the docs need are system components and go through derivation like any other (Select and Slider are in rationale.pendingDerivation).
- **Check that now catches it:** G-N1 (system components only), derivation-guard.

### R-003: the docs wore the system's look
- **Date:** 2026-10-27
- **User said:** "กูไม่ชอบ layout แบบ glass เลยวะ … มันค่อยไปโชว์ใน foundation, component, pattern"
- **What was wrong:** the reading layout was built out of glass panes over a photo.
- **Step that produced it:** the docs shell was designed as a showcase of the system instead of a reading tool.
- **What changed in that step:** D-016, plain opaque chrome; the system appears on demo stages only (standard #15).
- **Check that now catches it:** G-SH1.

### R-004: text hard to read, slow, out-of-step loading, links look like labels
- **Date:** 2026-10-27
- **User said:** "typo มองยาก โหลดช้ามาก … จังหวะการโหลดไม่พร้อมกัน … ตรงที่คลิกได้กับคลิกไม่ได้ มองแทบไม่ออก"
- **What was wrong:** 15px text, 85+ character lines, theme set after first paint, verification data fetched after mount, 0.3–0.7 MB photos, nav links and part titles alike.
- **Step that produced it:** the docs shell had no reading, loading or affordance requirements at build time.
- **What changed in that step:** reading size and measure tokens; theme before paint; bundled data; WebP and small variants.
- **Check that now catches it:** G-R1, G-PF1, G-PF2, G-A1.

### R-005: foundation pages far thinner than Carbon, Atlassian and Dell (grid)
- **Date:** 2026-10-27
- **User said:** "มึงอ่าน grid ของ 3 เจ้าใหญ่ๆ แล้วมึงดูของเราอย่างง่อย … ปัญหามาอีกจนกว่ากูจะเจอไปเรื่อยๆ"
- **What was wrong:** the Grid page had a playground, a hand-typed breakpoint table and a token list. The three references cover 27 topics on the same page.
- **Step that produced it:** foundation pages had no depth standard; only component pages did. Nothing listed what a grid page must cover, so the user found gaps page by page.
- **What changed in that step:** kiln `foundation-depth.md`: every foundation, pattern and guide page starts from a topic list built from at least three reference systems (`benchmarks/topics/<page>.json`, grid done); each topic is covered with live, token-generated material or declined with a reason from the concept (`system/benchmark-coverage.json`). Standard #18.
- **Check that now catches it:** G-BT1 (27/27 grid topics; gate-proofed by removing one mapping and pointing one at a missing section). The other foundation pages have no topic lists yet and are the next gap.

### R-006: diagram parts could not be told apart; a layout demo still sat on a photo
- **Date:** 2026-10-27
- **User said:** "ใครจะไปเห็นวะ แถมยังมีแบบนี้อีก"
- **What was wrong:** columns, gutters and margins were all translucent grey on a dark field with construction lines showing through; the column-count demo was still on the forest photo with pill-shaped plates.
- **Step that produced it:** diagrams were styled with the system's glass materials instead of being designed as diagrams, and only the stages I had just touched were moved to the field.
- **What changed in that step:** diagrams use distinct encodings drawn from tokens (accent columns, hatched margins, empty gutters, plain ground, corner.mark plates); every layout demo and playground on the page uses the field.
- **Check that now catches it:** G-NT1 measures each marked diagram part against its ground at 3:1 (WCAG 1.4.11) in both themes; it failed the margins at 2.15 and 1.40 before the fix.

### R-007: the switch is the iOS switch
- **Date:** 2026-10-28
- **User said:** "พอเอามาใช้ toggle แม่งธรรมดามาก ไม่ผ่าน concept funnel หรอวะ"
- **What was wrong:** a round white knob in a pill track, the iOS default. It went through the forms family round, but that round named the text-field default (Material outlined field) and never the switch's own.
- **Step that produced it:** the family derivation (D-020) was copied into every member's why.json. A member inherited a derivation that never looked at its own default, so the habit for that member passed.
- **What changed in that step:** every member of a family names its own default to avoid; rationale fails a why.json whose `default_to_avoid` does not mention the component it belongs to (all eleven form members now do). Switch went through its own round (D-022): a carved recess with a lit bead, picked from three in `apps/lab/round2/`.
- **Check that now catches it:** rationale's own-default rule; G-NT2 for the track's edge.

### R-008: the dropdown highlight does not sit in its flyout
- **Date:** 2026-10-28
- **User said:** "เห็นความไม่สมมาตรของ hover กับกรอบ flyout มั้ย"
- **What was wrong:** the highlighted row's corners and inset do not follow the flyout's corner; the gap is uneven and the curves do not nest.
- **Step that produced it:** Select is one of the ten components built before derivation existed (pendingDerivation); its flyout was never designed, and nothing measures nested corners.
- **What changed in that step:** Select went through its round (D-022). The row radius is computed in CSS as the sheet radius minus the inset, so it cannot drift; rows are 44px so the corner is never a pill.
- **Check that now catches it:** G-NR1 measures every open listbox and menu: row radius = sheet radius − inset, and fails rows whose radius is more than half their height. It failed the shipped flyout and the first redraw (36px rows) before passing.

### R-009: the search field disappears on white
- **Date:** 2026-10-28
- **User said:** "พอสีขาว search bar แม่งกลืนไปกับ bg แทบจะมองไม่เห็น"
- **What was wrong:** in the light theme the field's well and ring are below 3:1 against a white panel, so the field's edge is not visible (WCAG 1.4.11).
- **Step that produced it:** contrast was measured for text only. The boundary of a control is non-text contrast and no gate measured it; the light theme was tuned by eye on photo scenes, not on a white app panel.
- **What changed in that step:** the fields are a groove with a lit bottom lip and a ring (D-022), and the boundary is measured.
- **Check that now catches it:** G-NT2, every form control's edge at 3:1 in both themes. Over glass it reads real pixels (the ring just outside against the band just inside), because a colour walk cannot see a dimmed photo; its first version fell through to white and misread dark-glass fields. 188 controls pass.

### R-010: the blue button has no idea in it
- **Date:** 2026-10-28
- **User said:** "ปุ่มสีฟ้าๆก็โคตรเหี้ย แม่งไม่มีศิลป์เห้ยอะไรเลย หลัดกๆแค่ ปุ่ม rounded จบ พอใจแล้ว? ใช่ไหม?"
- **What was wrong:** the accent button is a flat blue pill, the default of every UI kit. Button was built in wave 1 before derivation and was never redone.
- **Step that produced it:** pendingDerivation was allowed to ship. The list was reported on every run but nothing stopped a release with ten underived components, and 0.3.0 and 0.4.0 were packed anyway.
- **What changed in that step:** a release is refused while pendingDerivation is not empty (kiln milestone and release-pack). Button went through its round (D-022): a small pane with rim, gloss, pointer glint and a blue cast shadow.
- **Check that now catches it:** release-pack refuses to pack while pendingDerivation is not empty (Avatar, Badge, Card, Chip, IconButton, Slider, Tabs, Tag remain).

### R-011: the app still ran the old Pane
- **Date:** 2026-10-29
- **User said:** "ดูที่กูเอาไปใช้จริง เย็ดเป็ดคนละเรื่อง" (Brick Forge screenshots: the old blue toggle and buttons)
- **What was wrong:** 0.4.0 was released and announced, but Brick Forge depended on `vendor/pane-react-0.3.0.tgz`, so none of rounds 2 and 3 reached the screen the user judges by.
- **Step that produced it:** release ended at the package and the book. No step looked at the app that consumes the package.
- **What changed in that step:** a release now ends by installing the tarball into each known consumer and screenshotting it in both themes (kiln standard #25, `consumers` in kiln.config.json). Brick Forge runs 0.5.0, checked on screen.

### R-012: blue accent and no light model
- **Date:** 2026-10-29
- **User said:** "accent สีฟ้า?? คือเหี้ยอะไรวะ" and, of a reference, "เขาวางขอบเงาเหมือนมีแสงตกด้านบน ทุก element ย่อยๆสวยมากๆ … มันคือความ craft ระดับ atom ไอ้เหี้ยไม่ปล่อยผ่าน"
- **What was wrong:** the blue was written into P1 and P5 at the anchor, so every derivation that quoted the principles kept it. Light had no direction: the rim was drawn from the top left on cards and buttons only, and most atoms had no light at all.
- **Step that produced it:** the concept step asked for consequences per axis but never for a light model, so depth was decided part by part and never as one source of light.
- **What changed in that step:** kiln `concept.md` requires a light model for any material system (where the light comes from, and how a raised surface, a recess, a chosen item and the loud action are lit), and derivation must state how each part is lit. Pane's P3 now says light falls from above; P1 and P5 own no hue (D-024).

### R-013: stacked glass had no levels
- **Date:** 2026-10-29
- **User said:** "พอใช้จริงดูเรื่อง modal หรือพวก กระจกซ้อนกันด้วย ให้มีระดับที่มองเห็นได้ง่ายไม่ใช่ ใส จางแม่งหมด ดู level visual ตรงนี้ด้วย หาสูตรคำนวน ตรวจด้วยตา"
- **What was wrong:** in Brick Forge a dialog, the tiles inside it and the app behind it were the same thin grey glass, so nothing read as above anything else.
- **Step that produced it:** depth was defined for one pane on a scene. Nothing defined what a pane inside a pane, an overlay or a popover look like, and nothing measured the difference.
- **What changed in that step:** four levels with their own body and shadow, a scrim under an overlay, and a nested Card that becomes level 2 by itself (D-025).
- **Check that now catches it:** G-EL1 reads pixels just inside and just outside every level and fails a step under 1.15:1, and a scrim that leaves the scene above 60%. It failed the light theme's level 2 at 1.03 before the tint was deepened.

### R-017: the steps of a page ran into each other
- **Date:** 2026-10-29
- **User said:** (screenshot of the Container live demo) "spacing ระหว่างส่วนต่างๆ บนล่างชิดกันเกิน"
- **What was wrong:** the live demo put its intro, its controls, the stage, the code and the tab bar 8px apart, so five steps read as one lump. Elsewhere tables, lists and intros sat 8–14px from stages, and every folded section had no rhythm at all: a details element does not lay its content out as flex, so the 12px prose gap never applied and margins collapsed.
- **Step that produced it:** spacing was chosen per container (one gap for everything inside it) without a rule for how far a separate step stands from text, and nothing checked the folded sections after folding was added.
- **What changed in that step:** the live demo steps stand 24px apart and its stage and code stay 12px apart as one unit; a demo, table or code block stands 24px from running text; folded sections lay out through an inner prose wrapper.
- **Check that now catches it:** G-RH1 measures the block above and below every stage and every tab bar on every component page: 24px for a separate step, 16px for an intro paragraph, 8px for the stage's own heading, caption or code. It failed 282 gaps before the fix and passes now.

### R-018: the slider was a stub, its pane bounced, and the anatomy pointed at nothing
- **Date:** 2026-10-29
- **User said:** "slide แคบมาก แล้วตัวครอบกรอบ แม่งเด้งอีกเวลา drag ไปสุด" and, of the anatomy, "คือเหี้ยไรก่อน"
- **What was wrong:** Slider had no width of its own. On the centred studio stage its pane shrank to fit, so the slider was as wide as "Volume 2%" (78px), and the pane grew and shrank as the value text went from 2% to 100%. The fill variant collapsed the same way, and at 100% its marker sat on the value. The anatomy leaders all started at the pane's edge at the row's height, so Channel, Range and Thumb pointed at one spot.
- **Step that produced it:** the studio stage (centred, shrink-to-fit) changed every demo's container and nobody checked a component that relies on its container for width; nothing measured a control's size across its values; the anatomy drew row markers, not pointers.
- **What changed in that step:** Slider takes the width it is given and never less than 240px (slider.min-width); the fill value ends clear of the marker; anatomy leaders end on a pin inside each part (never on a letter, never on a smaller part), drop or rise to their own lane, and never cross a line of text; Range and Thumb are listed in the order they read.
- **Check that now catches it:** G-SL1 presses Home and End on every slider on every component page and fails a slider under 200px or any change in its own or its pane's size. It failed 12 sliders (one at 78px) before the fix and passes 21 now.

### R-019: a full fill slider vanished on a white pane
- **Date:** 2026-10-29
- **User said:** (light theme, Volume at 100%) "white มองแทบไม่เห็น"
- **What was wrong:** in light the fill is white chosen glass and the empty well a near-white deep well, both on a white pane, so the bar had no boundary (1.45–1.49:1) and at 100% none at all. G-NT2 never measured sliders: its selector skipped role="slider".
- **Step that produced it:** the fill variant took the tab track's well for its empty part, a surface meant to sit inside a pane, not to be found on one; the edge rule for fields was not applied to a new control that is also a field-like bar.
- **What changed in that step:** the bar is a groove like a field (surface.carve and elevation.groove: shade under the top lip, the field's edge all round), and its track sits a hairline inside so the edge shows even when full.
- **Check that now catches it:** G-NT2 measures sliders: a bar slider by the bar's own edge, a channel slider by its channel with the fill inside it, never by the thumb. It failed the fill bars in light (1.45, 1.49) before the fix; all 202 controls pass now.

### R-020: evidence measured one scene and called it four
- **Date:** 2026-10-29
- **Found by:** the agent, while adding the Aurora scene.
- **What was wrong:** since ad9d3e4 the book reads ?backdrop= and drops ?scene=, but kiln.config still told every check to send ?scene=. So every "4 scenes" evidence run since then measured the studio four times. With the scene really applied, a do/don't pair on the Slider page turned out to spill 48px out of its column and under the "On this page" rail, putting a demo behind the rail's text (1.0–1.9:1).
- **Step that produced it:** the URL change (R-015) changed a contract the checks depend on, and nothing verified that the checks' own parameters still reached the app.
- **What changed in that step:** kiln.config sends ?backdrop= and lists studio and aurora; the pair row wraps when a demo needs more than half the column.
- **Check that now catches it:** G-ST1 opens the book with each configured scene and fails if the app drops it (it failed on ?scene=room before the fix); G-S6 fails anything in main that spills out of the page column (it named the pair cell, 48px).

### R-021: the streak floated above round controls, and the gallery was a wall
- **Date:** 2026-10-29
- **User said:** (an IconButton) "มีปัญหานะอันนี้" and, of the gallery, "แน่นไปหน่อยวะ สองแถว … เปิด full modal มาแล้วแสดงเป็น grid 4-5 items แล้วก็ component ไม่จำเป็นต้องใหญ่แน่นขนาดนั้น"
- **What was wrong:** the streak was a straight 1px line across the middle 56% of the top edge. On a disc, and at the round ends of a short pill, the top edge is an arc, so the line hung in the air above it. The gallery showed every component full size, two to a row, inline on the Overview.
- **Step that produced it:** the round-5 streak was drawn for wide pills and copied to the disc; the gallery was laid out for the cell, not for scanning.
- **What changed in that step:** the streak is the shape's own top border faded toward the sides, so it follows any curve (IconButton, Button, Chip). The gallery is a full-screen dialog, five to a row on a wide screen, each demo at about two thirds of its size.
- **Check that now catches it:** none measures a highlight's fit to a curve yet; checked by eye at 3× on IconButton, Button and Chip.

### R-022: the install line pointed at a registry nobody had published to
- **Date:** 2026-10-30
- **User said:** "ทำไม pane ติดตั้งไม่ได้วะ" with another project's log: `pnpm add pane-tokens pane-react` returned 404 for both, and it stopped work.
- **What was wrong:** Getting started opened with `npm install pane-react` and the package cards said `pnpm add`; the line that says nothing is published came a section later. Publishing is the user's step (Phase 8), so the documented command could never work.
- **Step that produced it:** the install section was written from the shape of a published library, before the release path (tarballs) existed, and never re-read against it.
- **What changed in that step:** every install line is the tarball path, and step 1 says Pane is not on npm yet. kiln rule 17: an install line is a promise.
- **Check that now catches it:** G-PUB1 fails any page that shows a registry install of a package not listed in kiln.config `published`.

### R-023: states were promised in prose and missing in code
- **Date:** 2026-10-30
- **User said:** "เช็ค form, table, state, variant ห้ามขาด"
- **What was wrong:** a typecheck of a matrix of every interactive component in every state found readOnly missing on nine fields, invalid on seven choice and file controls, loading on Button, IconButton and Table, disabled on Listbox, Rating, SegmentedControl, ColorPicker and Chip, and FormField's disabled and required not reaching Select, DatePicker, PinInput, RichTextEditor and NumberInput's steppers. Chip and FAB took `disabled` and drew nothing.
- **Step that produced it:** each component was derived and documented on its own; no step listed the states a family must have, so a state a page described could be absent and no gate asked.
- **What changed in that step:** the state matrix (`/patterns/states`) is the list: each family's states are rows, written once, and a new component joins its family's row.
- **Check that now catches it:** G-SV1 shoots every cell in one fixed, opaque dock (so equal cells rasterise equally) and fails a cell that matches its row default or lacks its ARIA; proven by removing Checkbox's invalid ring (0 px differ, red) and putting it back.

### R-024: one import pulled in the whole library
- **Date:** 2026-10-30
- **User said:** (relayed from a product that installed 0.7.0) Environment alone grew the shared JS by 77 kB gz and CSS by 34 kB, pushing its Read page past its 150 kB budget; it asked for per-component subpath exports, per-component CSS and an Environment that does not drag the library in.
- **What was wrong:** pane-react shipped one ESM file and one stylesheet, so no bundler could leave anything out. Worse, a first fix named its CSS `*.module.css`, which a consumer's bundler would have scoped a second time, breaking every class.
- **Step that produced it:** the library build was set up for the docs app, which uses everything, and never measured from a product's side.
- **What changed in that step:** ESM keeps one file per module and every module imports its own CSS (named without `.module`); each component has an entry and a subpath (`pane-react/Button`); Node gets the same modules without CSS imports through the `node` export condition; CJS stays one file. Environment alone is now 3.6 kB gz JS and 13 kB gz CSS, which is the token sheet.
- **Check that now catches it:** G-TS1 builds a throwaway Vite app importing one component and fails when its JS passes the budget or its CSS carries another component's styles; red on 0.6.0 (49 kB), green now. The smoke test still installs the tarball and renders on Node (22/22).
