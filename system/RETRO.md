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
