// Sections that cover the topics Carbon, Atlassian and Apple's HIG give each foundation page
// (benchmarks/topics/*.json, gate G-BT1). Each id is mapped in system/benchmark-coverage.json; a topic
// Pane does not share is declined there with its reason instead of being padded here.
import type { ReactElement } from 'react';
import { Badge, Button, Card } from 'pane-react';
import { Link, Section, Stage } from './kit';

const Pane = ({ children }: { children: React.ReactNode }) => <Card as="div" className="demo-card">{children}</Card>;

export const EXTRAS: Record<string, () => ReactElement> = {
  '/foundations/color': () => (
    <>
      <Section id="layering" title="Layering">
        <p>Colour in Pane steps with depth. The opaque page is the bottom layer, a raised surface sits on it, and a sunken surface sits below it. On glass the order is the scene, then the pane, then wells pressed into the pane and solid fills on top of it. Each layer has its own surface token, so a nested surface is always one step from its parent and never the same colour by accident.</p>
      </Section>
      <Section id="tokens" title="Colour tokens">
        <p>Colour reaches components in three tiers. Primitives such as <code>color.ink.900</code> hold the values, semantic tokens such as <code>action.accent</code> or <code>text.secondary</code> say what a colour is for, and component tokens such as <code>button.accent-bg</code> point at a semantic token. Component CSS uses only component and semantic tokens, and a lint fails the build on any raw value.</p>
      </Section>
      <Section id="states" title="Interaction states">
        <p>Pane changes shape before it changes colour. Hover lifts a control or thickens a ring, a press shrinks it, focus draws the shared white ring with a dark halo, selected adds a check or a lighter pane, and disabled fades to half opacity. Only the switch track changes colour, when it lights from within as it turns on, and it eases at the same pace as the bead so light and movement read as one event.</p>
      </Section>
      <Section id="themes" title="Colour in each theme">
        <p>The dark theme puts white text on glass that dims the scene, and the light theme puts ink text on glass that lifts it. Solid fills invert, so the loudest button and the accent are white in dark and ink in light. The status fills stay the same in both, because their text pairs are computed on the fill. The Themes page shows every surface side by side.</p>
      </Section>
      <Section id="high-contrast" title="High contrast">
        <p>In forced colours the browser replaces Pane’s palette with the reader’s system colours. Fills disappear, so every component draws a system-colour border instead, and selection uses Highlight. With reduced transparency the glass turns into an opaque graphite surface. Both modes are measured on every verify run.</p>
      </Section>
      <Section id="specs" title="Specifications">
        <p>Every colour value, in both themes, is listed with its tier and reference on the <Link to="/reference/tokens">Tokens</Link> page, generated from the token source. The loud solid and the accent pair ink and white at 18.74:1 in both themes. Info is #0071E3 at 4.70:1, positive is #13803C at 5.02:1, warning is #F5B000 with ink at 9.90:1, and critical is #C42B1C at 5.66:1.</p>
      </Section>
      <Section id="on-glass" title="Colour on glass">
        <p>Glass has no colour of its own. It shows the scene through a thin body, smoke in dark and a pale film in light, and the scene supplies every hue (P1). Status colour on glass is limited to small glyphs, in brighter tones on dark glass and deeper ones on light glass, so a small mark stays visible without repainting the pane.</p>
      </Section>
    </>
  ),
  '/foundations/typography': () => (
    <>
      <Section id="principles" title="Principles">
        <p>Type in Pane has to read over a moving photograph. That gives three rules. White on dark glass and ink on light glass, because the text must contrast with the dimmed scene. Few sizes, one per role, so hierarchy is clear at a glance. And on reading surfaces such as these docs, 16px at 1.6 line height and about 70 characters a line (P7).</p>
      </Section>
      <Section id="typeface" title="Typeface">
        <p>Pane uses the system font. That is San Francisco on Apple devices, then Inter, then the platform’s own sans serif. The system font matches Pane’s visionOS lineage, needs no download and renders crisply at small sizes on glass.</p>
      </Section>
      <Section id="custom-fonts" title="Custom fonts">
        <p>A brand font can replace the family token, <code>font.family-sans</code>, in one place. Check it on glass before shipping. Thin strokes and small x-heights lose contrast over a photo first, so measure the new font with the glass sweep the way the system font was measured.</p>
      </Section>
      <Section id="styles" title="Text styles by role">
        <p>Each size has a role. Micro at 11px is for eyebrows and tags, caption at 13px for badges, label at 14px for controls and help, body at 15px for interface text, reading at 16px for long text, emphasis at 17px, title at 21px, headline at 28px and display at 44px. Components use the role, never the size, so changing a role changes every place it is used.</p>
      </Section>
      <Section id="user-size" title="The reader’s text size">
        <p>Pane sets sizes in pixels today, so text follows browser zoom but not a larger default font size. Every page of this book is checked at 375px, 768px and 1280px wide. Moving the scale to rem so it follows the reader’s font setting is planned.</p>
      </Section>
      <Section id="type-colour" title="Type colour">
        <p>There are two text colours per theme. Primary is white in dark and ink in light. Secondary is white at 92 percent in dark, the lowest opacity that still measured as passing on every test photo (P2). Status is never carried by text colour alone.</p>
      </Section>
    </>
  ),
  '/foundations/spacing': () => (
    <>
      <Section id="base-unit" title="The base unit">
        <p>Spacing is built on 4px. Every gap, padding and margin is a multiple of it, from 4px to 128px, with a few half steps such as 6px and 22px where an object needed them. The same 4px grid draws the Field backdrop behind diagrams.</p>
      </Section>
      <Section id="stacking" title="Stacking">
        <p>Vertical space belongs to the container, never the children. A Stack spaces its children with one gap, and a section spaces its paragraphs with its own. Children carry no margins, so moving a block never leaves a gap behind it or doubles one.</p>
      </Section>
      <Section id="relationships" title="Grouping by proximity">
        <p>Things that belong together sit closer than things that do not. A label sits 8px above its field, fields in a group sit 16px apart, and groups sit further apart again. Inside a pane the padding is larger than any gap between its items, so the pane’s edge reads as the boundary of the object (P3).</p>
      </Section>
      <Section id="hierarchy" title="Hierarchy through space">
        <p>Space says what leads. The loud action sits apart from the quiet ones, never between them (P5), and a title gets more space above it than below, so it attaches to the content it names.</p>
      </Section>
      <Section id="white-space" title="White space">
        <p>On glass, empty space is where the scene shows. Gutters between panes are wide enough to see the world through (P1), so leaving room is part of the design, not waste. Reading pages keep generous line height and short lines for the same calm.</p>
      </Section>
      <Section id="optical" title="Optical adjustment">
        <p>Some things look off even when the numbers are equal, so a few components align by eye. An error glyph is centred on the first line of its message rather than the whole block, and a checkbox or radio is centred on its label’s first line when the label wraps. Screens built from the components inherit these, so they need no nudging of their own.</p>
      </Section>
      <Section id="safe-areas" title="Safe areas">
        <p>Content keeps the page margin from every edge, 16px on phones and wider at larger breakpoints. On phones with a notch or a home indicator, add the environment’s safe-area insets to the margin, so nothing sits under the system’s own controls.</p>
      </Section>
    </>
  ),
  '/foundations/motion': () => (
    <>
      <Section id="principles" title="Principles">
        <p>Things settle (P4). Objects arrive, respond and come to rest instead of snapping, with long ease-out curves for arriving and hovering and a shorter one for pressing, because a press is a reply. Nothing moves on its own, and every motion answers something the reader did.</p>
      </Section>
      <Section id="properties" title="What moves">
        <p>Pane animates transform, opacity, box-shadow and colour, and never width, height or position in the layout, because those make the page reflow. The one exception is a Banner opening or closing its own row, which grows from zero height so the content below slides instead of jumping.</p>
      </Section>
      <Section id="feedback" title="Motion as feedback">
        <p>Every interactive control answers the pointer. A button lifts 2px on hover and shrinks to 97 percent on press, a checkbox’s check settles in, and a switch knob slides across. The answer comes in 200ms for a press, so the reader feels the control respond before the result appears.</p>
      </Section>
      <Section id="checklist" title="Before you add motion">
        <ul>
          <li>It answers something the reader did.</li>
          <li>It moves by transform or opacity, never the layout.</li>
          <li>It uses the duration and easing tokens.</li>
          <li>It is removed under reduced motion, which the tokens do for you.</li>
        </ul>
      </Section>
    </>
  ),
  '/foundations/icons': () => (
    <>
      <Section id="principles" title="Principles">
        <p>An icon has to be understood without its label, so Pane uses only icons whose meaning is familiar, such as share, reply or more. Everything else gets a word. Icons are outline strokes in the text colour, so they sit on glass as quietly as text does.</p>
      </Section>
      <Section id="targets" title="Touch targets">
        <p>An icon is drawn at 16 or 18px, but the control around it is larger. IconButton draws a 36px disc at md and a 32px disc at sm, and both sizes keep a 44px press area, as Banner’s dismiss does (P6).</p>
      </Section>
      <Section id="colour" title="Icon colour">
        <p>Icons take the colour of the text beside them through currentColor, white in dark and ink in light. The only coloured icons are status glyphs, and each tone has its own shape as well as its colour.</p>
      </Section>
      <Section id="alignment" title="Alignment with text">
        <p>A leading icon sits on the text’s centre line with one gap before the label. In a list, icons line up in their own column so the text starts at the same place on every row.</p>
      </Section>
      <Section id="style" title="Visual style">
        <p>Icons are drawn on a 24px canvas with a 1.7px stroke, round caps and round joins, front on and without perspective. Round caps match the full pills of Pane’s controls. Filled shapes are kept for selected states, such as a liked heart.</p>
      </Section>
      <Section id="standard" title="Icons for common actions">
        <p>Share is the arrow out of a box, reply is the curved arrow, more is three dots, edit is a pencil and close is a cross. Use these for those actions only, so the same icon never means two things in one product.</p>
      </Section>
      <Section id="contribution" title="Adding an icon">
        <p>A new icon is drawn on the same 24px canvas with the same stroke, added to <code>apps/docs/src/icons.tsx</code>, and shown in the browser above. It needs a familiar meaning, or it gets a text label instead.</p>
      </Section>
    </>
  ),
  '/foundations/themes': () => (
    <>
      <Section id="default" title="The default theme">
        <p>With no theme set, Pane follows the reader’s system setting through prefers-color-scheme. Dark is the base the tokens are written in, and light is defined as overrides on the tokens that change.</p>
      </Section>
      <Section id="customising" title="Customising a theme">
        <p>A product can change a theme by overriding semantic tokens on its root, such as the accent. Change semantic tokens, never component ones, and measure the result on glass with the glass sweep, because every colour that touches text over a photo was tuned against real pixels.</p>
      </Section>
      <Section id="respect-setting" title="Following the reader’s setting">
        <p>Follow the system setting by default and offer a choice of System, Light and Dark, as the top bar of these docs does. Store the choice, and apply it before the first paint so the page never flashes the wrong theme.</p>
      </Section>
    </>
  ),
  '/foundations/shape': () => (
    <>
      <Section id="radius-scale" title="The radius scale">
        <p>There are six radii. Marks in diagrams take 4px, a checkbox 7px, media 18px, inner surfaces 24px and a pane 40px, and controls take the full pill. Each is a semantic corner token, such as <code>corner.panel</code>, so components never pick a number.</p>
      </Section>
      <Section id="radius-usage" title="Which radius where">
        <p>Corners nest. A surface inside a pane takes the pane’s 40px corner minus the padding between them, which gives 18px for media and 24px for inner surfaces, so the inner shape reads as inside the outer one (P3). Controls are full pills because they are held.</p>
      </Section>
      <Section id="focus-radius" title="The focus ring’s corner">
        <p>The focus ring is an outline 2px outside the control, so it follows the control’s own corner. A pill gets a pill ring and a pane gets a rounded ring, with no separate radius to keep in step.</p>
      </Section>
      <Section id="pairings" title="Surface and shadow pairs">
        <p>A glass pane casts the float shadow, a long soft drop, and the loud button casts the shorter lift shadow. Inset panes and wells cast none, because one sheet of glass is one layer (P3). These pairs are fixed in the component tokens.</p>
      </Section>
      <Section id="dark" title="Elevation in each theme">
        <p>Shadows are deeper in the dark theme and lighter in the light theme, where a strong shadow would read as dirt on a pale pane. The rim of light along the top edge is white in both.</p>
      </Section>
      <Section id="interaction" title="Elevation when touched">
        <p>Hover lifts a control 2px closer, and a press shrinks it a little, quicker than the lift. Panes do not lift, because a whole pane is never a hidden button (P3).</p>
      </Section>
      <Section id="z-index" title="Stacking order">
        <p>Five layers decide what sits above what. Base is 0, raised is 10, sticky is 100, overlay is 1000 and toast is 1100. Components use the layer tokens, so a Select list, on the overlay layer, opens above a sticky header.</p>
      </Section>
      <Section id="contrast" title="Contrast on raised surfaces">
        <p>Every surface that holds text is measured, including raised panels and the open list of a Select, in both themes. Opaque pairs are computed and glass pairs are measured on photos (P2).</p>
      </Section>
    </>
  ),
  '/foundations/dimensions': () => (
    <>
      <Section id="hierarchy" title="Size and hierarchy">
        <p>Size says what matters. The loud action is the largest button on its pane, the portrait on a profile is the largest avatar, and a title is the largest text. Two things of equal size read as equally important, so give each pane one large thing.</p>
      </Section>
      <Section id="safe-areas" title="Safe areas">
        <p>Keep content inside the page margin and the device’s safe-area insets, so nothing sits under a notch, a home indicator or a system bar. Touch targets near the screen edge need the full 44px.</p>
      </Section>
      <Section id="density" title="Density">
        <p>Pane has one density, tuned for touch. The small sizes of Button, Select and Input at 32px make dense rows possible on desktop. Button and Select keep a 44px press area around them. The small Input has none, so keep it off phones.</p>
      </Section>
    </>
  ),
  '/foundations/glass': () => (
    <>
      <Section id="spatial" title="Glass in space">
        <p>Pane borrows the visionOS idea of windows floating in a room. On the web the room is a photo or video behind the page, and the panes float over it with a shadow below and a rim of light on top (P3). Panes rise into place when they appear and settle, as an object would.</p>
      </Section>
      <Section id="surfaces" title="Glass and other surfaces">
        <p>Glass is one surface among several. Wells are pressed into it, solid fills sit on top of it, and reading pages leave it out altogether for an opaque page (P7). Never put glass on glass, because the second blur samples the first and text loses its edge.</p>
        <Stage><Pane><p className="flush">Text on glass</p><div className="demo-row"><Button>Solid on top</Button><Badge>Beta</Badge></div></Pane></Stage>
      </Section>
    </>
  ),
  '/foundations/content': () => (
    <>
      <Section id="audience" title="Who you are writing for">
        <p>Pane is for personal and media apps, so write for people at leisure, not operators at work. Use the words they use, such as album, print and follower, and leave internal names and codes out of the interface.</p>
      </Section>
      <Section id="tone" title="Tone">
        <p>The voice stays the same and the tone changes with the moment. Confirmations are short and warm, warnings are plain and calm, and errors are direct and say how to recover. Never joke when something has failed.</p>
      </Section>
      <Section id="clarity" title="Clear and short">
        <p>Use the fewest words that say it. Put the important word first, cut words that repeat the label, and prefer a short sentence to a long one. A banner title is one sentence; a button is one to four words.</p>
      </Section>
      <Section id="inclusive" title="Plain and inclusive language">
        <p>Write plain words that translate well. Address the reader as you, avoid idioms and gendered words for people, and describe actions rather than gestures, so Select instead of Click, because not everyone uses a mouse.</p>
      </Section>
      <Section id="capitalisation" title="Capitalisation">
        <p>Titles, buttons, tabs, labels and menu items are all in sentence case. Only proper nouns and product names keep their capitals. Small caps on tags and eyebrows are done in CSS, so the text stays in normal case.</p>
      </Section>
      <Section id="consistency" title="The same word for the same thing">
        <p>Pick one word for each thing and use it everywhere. If it is an album on the profile, it is an album in the menu, the dialog and the error. A second word makes readers wonder if it is a second thing.</p>
      </Section>
      <Section id="multistep" title="Guiding through steps">
        <p>In a task with several steps, say where the reader is and what comes next, such as Step 2 of 3, Shipping. Label the forward action with the next step, such as Continue to payment, so the reader knows what pressing it does.</p>
      </Section>
      <Section id="writing-accessibility" title="Writing for accessibility">
        <p>Write labels that make sense out of context, because screen reader users often move from control to control. Give images a description of what they show, keep link text specific, and never rely on colour, position or shape words such as the red button on the right.</p>
      </Section>
    </>
  ),
  '/foundations/accessibility': () => (
    <>
      <Section id="vision" title="Blind and low-vision readers">
        <p>Every control has a name, every image a description, and the order of the page is the order it is read. Text reaches 4.5:1 over photos, apart from the measured exception E-001, focus is visible on any scene, and status is spoken in words.</p>
      </Section>
      <Section id="hearing" title="Deaf and hard-of-hearing readers">
        <p>Pane makes no sound of its own. Media apps built on it need captions for video and transcripts for audio, which the app provides.</p>
      </Section>
      <Section id="mobility" title="Limited mobility">
        <p>Everything works from the keyboard, with a visible focus ring. Touch targets should be 44px; the 32px and 36px sizes of some controls fall short today and are listed under each component’s Limitations. Nothing depends on a drag alone.</p>
      </Section>
      <Section id="cognitive" title="Cognitive accessibility">
        <p>One loud action per pane makes the next step obvious, labels say what happens, errors say how to fix them, and nothing moves on its own. Reduced motion removes all motion.</p>
      </Section>
      <Section id="speech" title="Speech input">
        <p>People who control the screen by voice say what they see, so the visible label of a control is also its accessible name. IconButton’s name should be the word people would say, such as Share.</p>
      </Section>
      <Section id="standards" title="Standards">
        <p>Pane aims at WCAG 2.2 level AA. Automated checks run axe on every page in normal and forced-colours modes, contrast is measured per pixel, and keyboard behaviour is tested in Chromium. Manual screen reader passes are not recorded yet.</p>
      </Section>
    </>
  ),
};
