// Component chapters. The prose half of each page. Everything else on a component page is
// generated: props (meta.json, react-docgen-typescript), demo floor (meta.json), tokens used (the
// CSS module), keyboard verification (conformance.json), contrast (evidence.json).
// Examples are real files in ../examples, rendered and shown as source from the same module.
import type { ComponentType, ReactNode } from 'react';
import { Link } from './kit';

const MODS = import.meta.glob('../examples/*.tsx', { eager: true }) as Record<string, { default: ComponentType }>;
const SRCS = import.meta.glob('../examples/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export interface ExampleRef { file: string; title: string; intro: string; Render: ComponentType; code: string; plain?: boolean }
const ex = (file: string, intro: string, plain?: boolean): ExampleRef => {
  const key = `../examples/${file}.tsx`;
  const code = SRCS[key] ?? '';
  return { file, title: code.match(/^\/\/ @example (.*)$/m)?.[1] ?? file, intro, Render: MODS[key].default, code, plain };
};

export interface ComponentChapter {
  name: string;
  slug: string;
  purpose: string; // verb-first, one sentence (content-model point 1)
  importLine: string;
  overview: ReactNode;
  hero: ExampleRef;
  ladder: ExampleRef[]; // one per variant dimension + states + compositions
  whenToUse: string[];
  whenNotToUse: Array<[string, string]>;
  anatomy: Array<[string, string]>;
  states?: Array<[string, string]>;
  content: string[];
  dodont: Array<{ do: string; dont: string }>;
  a11y: string[];
  keyboard?: Array<[string, string, string]>; // key · does · conformance check that proves it
  inherits?: string;
  usage: string; // short, copy-ready snippet
  status: 'alpha' | 'beta' | 'stable'; // see /reference/status for what each one requires
  limitations: string[]; // what it does not do yet (Polaris and MUI keep this list on every page)
  youMust: string[]; // accessibility work left to the app (Primer: implementation requirements)
  backdrops: string; // what changes between themes and bright or dark scenes
  related: Array<[string, string, string]>; // path · label · "use it instead when…"
}

export const COMPONENTS: ComponentChapter[] = [
  {
    name: 'Environment',
    slug: 'environment',
    status: 'alpha',
    limitations: ['The dim and mid levels are not calibrated yet and resolve to the bright value.', 'It cannot read the real backdrop. You declare the brightness, and a wrong declaration gives the wrong dimming.'],
    youMust: ['Declare the brightest point the backdrop can reach. Its average is too low.', 'Put one Environment at the top of the screen and add nested ones only where the backdrop really changes.'],
    usage: '<Environment brightness="bright">\n  <Card>…</Card>\n</Environment>',
    backdrops: 'The Environment only matters in the dark theme, where it sets how far the glass dims a bright scene. In the light theme the glass lifts the scene instead, so every level behaves the same.',
    purpose: 'Tells every glass surface inside it how bright the scene behind can get, so the glass dims it by the measured amount.',
    importLine: "import { Environment } from 'pane-react';",
    overview: (
      <>
        <p>Glass has no colour of its own. It shows whatever is behind it, so white text on it is only as readable as the brightest thing that can slide underneath. A native visionOS window can read the room’s pixels, but a web page has no access to what sits behind its own elements. <code>Environment</code> fills that gap. The app declares the backdrop’s brightness and every glass surface inside dims what it shows through by the amount measured for that level.</p>
        <p>It renders a plain <code>{'<div data-environment>'}</code> with no styles, no layout and no semantics. It only re-points the glass tokens for its subtree. So it can wrap a whole screen or a single region that sits over a different backdrop.</p>
      </>
    ),
    hero: ex('QuickStart', 'Most screens need one Environment at the top with Cards inside it.'),
    ladder: [
      ex('EnvironmentLevels', 'The brightness prop has three levels. Each tile shows a level on the kind of scene it suits. Today dim and mid are uncalibrated and resolve to the bright value.', true),
      ex('EnvironmentDefault', 'Leave the Environment out and glass falls back to the bright level, the safest setting.'),
      ex('EnvironmentNested', 'A region over a different backdrop can declare its own level. The nearest Environment wins.', true),
    ],
    whenToUse: [
      'Once at the root of any screen with glass on it, before the first Card.',
      'Around a region whose backdrop differs from the rest of the screen (a media viewer inside a lighter shell).',
      'Whenever you ship a new background image. Run tooling/glass-sweep.mjs on it and set the level it measures.',
    ],
    whenNotToUse: [['To make one card look darker for emphasis', 'Use type and placement for hierarchy'], ['On an opaque screen with no glass', 'Nothing to configure. Leave it out']],
    anatomy: [
      ['Wrapper', 'div[data-environment="dim | mid | bright"]. No styles of its own.'],
      ['Re-pointed tokens', '--ds-glass-brightness and every token that depends on it (e.g. --ds-card-brightness) are re-declared for the subtree, because a custom property holding var() resolves where it is declared.'],
      ['Fallback', 'Reduced transparency, forced colours or a missing backdrop-filter override it, and the glass turns opaque with no dimming.'],
    ],
    states: [['dim', 'Uncalibrated. It equals bright until a genuinely dark photo is measured.'], ['mid', 'Uncalibrated for the same reason.'], ['bright (default)', 'Measured on four sunlit photos. The current value is on the Glass page, and the text nodes left between 3.8 and 4.5:1 are registered as E-001.']],
    content: ['Name the level after the backdrop’s brightest region. The Night café photo counts as bright because of its lit window.'],
    dodont: [
      { do: 'Set it once per screen, sized for the brightest spot a card can land on while scrolling.', dont: 'Pick a darker level because a scene is “mostly dark”. The card that lands on its one bright spot fails.' },
      { do: 'Re-measure with glass-sweep whenever the background image changes.', dont: 'Copy another app’s level. The number belongs to the image you ship.' },
    ],
    a11y: ['No semantics. Never appears in the accessibility tree.', 'Without it, glass resolves to bright, which is the safest default.', 'A user’s system setting (reduced transparency, forced colours) always wins over the app’s declaration.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/card', 'Card', 'Environment configures glass; Card is the glass.'], ['/foundations/glass', 'Glass & environment', 'How the numbers per level were measured.'], ['/reference/exceptions', 'E-001', 'What the bright level does not fully meet.']],
  },
  {
    name: 'Card',
    slug: 'card',
    status: 'beta',
    limitations: ['Glass over a moving video is measured only on still frames.', 'Nesting glass inside glass doubles the blur cost, so the inset variant adds no second blur.'],
    youMust: ['Give a section or article card a heading and point aria-labelledby at it.', 'Keep every line of text on the card itself. Text on the cover image needs its own scrim.'],
    usage: '<Card as="section" aria-labelledby="title">\n  <h2 id="title">Storage</h2>\n  <p>41.2 GB of 64 GB used.</p>\n</Card>',
    backdrops: 'In the dark theme the card dims what is behind it and the text is white. In the light theme it lifts and whitens the scene and the text turns ink. Over a dark photo the light glass has to work hardest, because ink needs a pale surface.',
    purpose: 'Puts content on a pane of clear, blurred glass that dims the scene behind it just enough for white text.',
    importLine: "import { Card, CardCover } from 'pane-react';",
    overview: (
      <>
        <p>A <code>Card</code> is the pane itself. It has a 6% white tint with a faint top sheen and a 64px blur that turns the scene into soft colour. A 1.8× saturation lift keeps that colour alive, and the environment’s dimming keeps white text readable. It has no hard border. A gradient specular rim catches the light at the top-left and drifts slowly on hover.</p>
        <p>Everything in Pane sits on a Card. The <code>inset</code> variant nests content inside a pane without a second layer of glass. <code>CardCover</code> is the full-bleed image strip at the top, pulled to the card edges automatically.</p>
      </>
    ),
    hero: ex('CardVariants', 'A typical card has a cover, a title and meta line, a nested inset section and one action.'),
    ladder: [
      ex('CardInset', 'Set variant to inset for a quoted post inside a post. It adds a divider and padding and no second layer of glass.'),
      ex('CardAsSection', 'Render it as a section when it is a titled region, and point aria-labelledby at its heading.'),
      ex('CardCoverImage', 'CardCover takes a real image. Keep the meaning in the text below it, because the cover is decorative.'),
      ex('CardGrid', 'Several panes in a grid let the backdrop show in the gaps between them.', true),
    ],
    whenToUse: ['Any group of related content, such as a profile, a post, a settings section or a dialog body.', 'Under every piece of text. Pane guarantees contrast only on its own glass.', 'variant="inset" for a sub-section inside a card.'],
    whenNotToUse: [['A card inside a card', 'variant="inset". No second glass layer'], ['A clickable tile', 'Put a Button or a link inside; Card itself is not interactive'], ['Decoration with no content', 'Leave the backdrop visible']],
    anatomy: [
      ['Glass', 'Tint (surface.glass) + blur 64px + saturate 1.8 + brightness from the environment.'],
      ['Sheen', 'Top-down white gradient, 10% → 3%.'],
      ['Specular rim', '1px gradient ring via a mask. Bright top-left, faint middle, soft bottom-right; drifts on hover over 640ms.'],
      ['Float shadow', 'elevation.float. A long, soft drop.'],
      ['Halo', 'Text inside inherits card.text-halo; solid-fill controls reset it.'],
      ['Cover (optional)', 'CardCover. Full-bleed, decorative.'],
    ],
    states: [['Rest', 'Rim light top-left.'], ['Hover', 'Rim light drifts toward the centre over 640ms. The light moves, the card does not.'], ['Environment change', 'Dimming glides over 640ms instead of snapping.']],
    content: ['A section card gets a heading and aria-labelledby; an article card without a heading gets an aria-label.'],
    dodont: [
      { do: 'Put every piece of text on a Card.', dont: 'Lay body text straight onto a photo. Even the halo cannot carry it.' },
      { do: 'Nest with variant="inset".', dont: 'Stack glass on glass. The second blur samples the first and text loses its edge.' },
    ],
    a11y: ['It renders a real article, section, aside, header or div element.', 'In forced colours the rim becomes a solid CanvasText border.', 'With reduced transparency the glass turns opaque graphite and stops dimming.'],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/environment', 'Environment', 'When the glass needs to know a different backdrop brightness.'], ['/foundations/shape', 'Shape & elevation', 'Corner and shadow rules for nesting.'], ['/patterns/profile-card', 'Profile card', 'A full card assembled from every component.']],
  },
  {
    name: 'Avatar',
    slug: 'avatar',
    status: 'beta',
    limitations: ['Initials are taken from the first two words of the name and do not handle every script.', 'There is no presence or status dot yet.'],
    youMust: ['Pass the person’s full name, or set decorative when the name is already visible next to it.', 'Use a real photo URL you are allowed to show. The image has no built-in error reporting beyond the initials fallback.'],
    usage: '<Avatar name="Max Fmz" size="md" decorative />',
    backdrops: 'The rim ring of the large size stays white in both themes. The initials fallback flips with the solid fill, ink on white in dark and white on ink in light.',
    purpose: 'Shows who a piece of content belongs to, as a round photo or initials.',
    importLine: "import { Avatar } from 'pane-react';",
    overview: (
      <>
        <p>A round portrait. With <code>src</code> it shows the photo cropped to a circle; without one it shows up to two initials from <code>name</code>. The large size carries the white rim ring from the anchor card so it reads as sitting on top of the cover.</p>
        <p>An avatar almost always sits next to the person’s name. Mark it <code>decorative</code> there, so assistive technology skips it and announces the name once.</p>
      </>
    ),
    hero: ex('AvatarDecorative', 'Next to a visible name and handle, the avatar is marked decorative.'),
    ladder: [
      ex('AvatarSizes', 'Three sizes. Use sm (30px) in post headers, md (44px) in lists and lg (84px, with a rim ring) in profile headers.', true),
      ex('AvatarPhoto', 'The same name gives the accessible label and the initials, so a missing photo still reads correctly.', true),
      ex('AvatarGroup', 'In a stack of participants the group carries everyone’s names and each avatar stays decorative.'),
    ],
    whenToUse: ['Identifying the person or brand behind content.', 'Overlapping a cover image (lg), as in the profile card.'],
    whenNotToUse: [['A generic “user” glyph with no identity', 'An icon'], ['A product image', 'An <img> with real alt text']],
    anatomy: [['Circle', 'corner.round, clipped.'], ['Photo or initials', 'Initials = first letters of the first two words of name.'], ['Rim ring (lg)', '4px ring in line.rim-hi.']],
    content: ['name is the real name or handle, never “avatar” or “profile picture”.'],
    dodont: [
      { do: 'Mark it decorative beside a visible name.', dont: 'Leave it announced next to the name. Readers hear “Max Fmz, Max Fmz”.' },
      { do: 'Label a stack once, on the group.', dont: 'Announce every face in a stack of twenty.' },
    ],
    a11y: ['A labelled avatar gets role="img" and an aria-label taken from name.', 'A decorative avatar gets aria-hidden="true" instead.', 'Initials are aria-hidden inside the labelled wrapper.'],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/icon-button', 'IconButton', 'When the round thing is an action.'], ['/patterns/feed-post', 'Feed post', 'Avatar in a post header.']],
  },
  {
    name: 'Button',
    slug: 'button',
    status: 'beta',
    limitations: ['There is no loading state built in.', 'Buttons are not links. Navigation needs an anchor element.'],
    youMust: ['Write a label that says what happens, in a verb.', 'Keep one solid button per card. Everything else uses the glass variant.'],
    usage: '<Button>Follow</Button>\n<Button variant="glass">Message</Button>',
    backdrops: 'The solid button inverts with the theme, white with ink text in dark and ink with white text in light, so it stays the loudest thing on the card. Accent blue is the same in both.',
    purpose: 'Runs an action, in one of three weights so a card has exactly one loud choice.',
    importLine: "import { Button } from 'pane-react';",
    overview: (
      <>
        <p>Pill-shaped buttons. <code>light</code> is the solid white pill from the anchor card (“Follow”). The one main action of a card. <code>accent</code> is solid blue for a promoted action. <code>glass</code> is a quiet translucent fill for everything secondary.</p>
        <p>On hover a button rises 2px over 420ms with a long settling ease. On press it scales to 97% over 200ms, which still feels like a response.</p>
      </>
    ),
    hero: ex('ButtonPair', 'The foot of a card usually holds one light action with a glass alternative beside it.'),
    ladder: [
      ex('ButtonVariants', 'Three variants. Light is white with near-black text (18.74:1). Accent is blue #0071E3 with white text (4.70:1). Glass is an 8% white fill, because 14% lifted the backdrop under white text to 4.25:1.'),
      ex('ButtonSizes', 'md is 44px tall and suits touch. sm is 32px for dense rows.'),
      ex('ButtonDisabled', 'Disabled uses the native attribute. Put the reason in text next to it, since nobody can focus a disabled button to ask.'),
      ex('ButtonWithIcon', 'A leading icon is decorative. The label carries the meaning.'),
    ],
    whenToUse: ['Actions such as follow, save, send and open.', 'light for the single action a card exists for; glass for the rest.'],
    whenNotToUse: [['Navigating to another page', 'A link. Buttons do, links go'], ['An icon-only action', 'IconButton (it requires a label)'], ['Switching views', 'Tabs']],
    anatomy: [['Pill', 'corner.round; 44px (md) or 32px (sm) tall.'], ['Label', '15/14px semibold; no halo on solid fills.'], ['Lift shadow', 'elevation.lift on light and accent.'], ['Focus ring', '2px white ring 2px out + 5px dark halo.']],
    states: [['Hover', 'Rises 2px, 420ms soft ease.'], ['Pressed', 'Scales to 0.97, 200ms.'], ['Focus', 'White ring + dark halo.'], ['Disabled', 'Native disabled, 50% opacity, no motion.']],
    content: ['Start with a verb and keep it to one or two words, like “Follow” or “Save changes”.'],
    dodont: [
      { do: 'One light button per card.', dont: 'Put light and accent side by side for equal actions. Two loud buttons cancel out.' },
      { do: 'Name the result, as in “Delete post”.', dont: 'Describe the gesture, as in “Click to delete”.' },
    ],
    a11y: ['Native <button>; type defaults to "button" so it never submits a form by accident.', 'Focus ring visible on every scene.', 'In forced colours a ButtonText border replaces the fill.'],
    keyboard: [['Tab', 'Moves focus to the button', 'Button: reachable with Tab'], ['Enter', 'Activates it', 'Button: Enter and Space activate it'], ['Space', 'Activates it', 'Button: Enter and Space activate it']],
    inherits: 'ButtonHTMLAttributes<HTMLButtonElement>',
    related: [['/components/icon-button', 'IconButton', 'When the action is a well-known icon in a dense row.'], ['/components/tabs', 'Tabs', 'When the “action” is really switching a view.'], ['/foundations/motion', 'Motion', 'The hover and press timings.']],
  },
  {
    name: 'IconButton',
    slug: 'icon-button',
    status: 'beta',
    limitations: ['There is no tooltip, so the name is only exposed to assistive tech.', 'Only two sizes exist, both meeting the 44px touch target.'],
    youMust: ['Always pass aria-label. The type requires it, and it should name the action.', 'Pick an icon whose meaning is common. If you have to explain it, use a Button with text.'],
    usage: '<IconButton aria-label="Edit profile"><IconPencil /></IconButton>',
    backdrops: "The glass disc follows the theme's quiet fill. Ghost icons take the secondary text colour, white in dark and ink in light.",
    purpose: 'Runs a common action from an icon alone, with a label the type system will not let you forget.',
    importLine: "import { IconButton } from 'pane-react';",
    overview: (
      <>
        <p>A round, icon-only button. <code>glass</code> is a frosted disc for standalone actions (edit, close); <code>ghost</code> is the bare icon for dense rows (more, share), where a disc on every icon would be noise.</p>
        <p>The TypeScript type requires <code>aria-label</code>. An icon has no text, so the label is the button’s entire name, and an unnamed icon button will fail to compile.</p>
      </>
    ),
    hero: ex('IconButtonVariants', 'A frosted disc suits a standalone action like edit. Bare icons suit overflow and share.'),
    ladder: [
      ex('IconButtonSizes', 'md is a 36px disc. sm is 32px and fits action rows.'),
      ex('IconButtonActionRow', 'In a row of ghost actions each label names the action, and the count where there is one.'),
      ex('IconButtonOnCover', 'On a photo the disc keeps its own 20px blur so the icon stays legible.'),
      ex('FeedPost', 'A full post uses ghost icon buttons for overflow and share.', true),
    ],
    whenToUse: ['Well-known actions like edit, more, share and close.', 'Dense rows where text buttons would crowd the content.'],
    whenNotToUse: [['An action whose icon needs explaining', 'A Button with a text label'], ['The main action of a card', 'A light Button']],
    anatomy: [['Disc (glass)', 'surface.quiet fill with its own 20px blur.'], ['Icon', '18px, currentColor stroke.'], ['Focus ring', 'Same ring + halo as Button.']],
    states: [['Hover', 'Rises 2px; ghost brightens to the primary text colour.'], ['Pressed', 'Scales to 0.97.']],
    content: ['Label the action. “Edit profile” tells people what happens, while “Pencil” only names the drawing.'],
    dodont: [
      { do: 'Use well-known icons only.', dont: 'Invent an icon and rely on a tooltip to explain it.' },
      { do: 'Include the count in the label when the icon shows one (“Reply, 268”).', dont: 'Leave the number visible but unannounced.' },
    ],
    a11y: ['aria-label required at the type level.', 'The conformance run checks every page of this book for icon-only buttons without a name.'],
    keyboard: [['Tab', 'Moves focus to it', 'IconButton: reachable with Tab'], ['Enter / Space', 'Activates it (native button)', 'Button: Enter and Space activate it']],
    inherits: 'ButtonHTMLAttributes<HTMLButtonElement> (minus aria-label, which is redeclared as required)',
    related: [['/components/button', 'Button', 'When the action needs words.'], ['/foundations/icons', 'Iconography', 'The icon set and sizes.']],
  },
  {
    name: 'Tabs',
    slug: 'tabs',
    status: 'beta',
    limitations: ['Tabs do not scroll when they overflow. Keep the list short enough to fit at 375px.', 'Vertical tabs are not styled yet.'],
    youMust: ['Give Tabs.List an aria-label that names the set.', 'Keep each panel’s content related. Tabs are not a way to hide unrelated pages.'],
    usage: '<Tabs.Root defaultValue="a">\n  <Tabs.List aria-label="Sections">\n    <Tabs.Trigger value="a">Tweets</Tabs.Trigger>\n    <Tabs.Trigger value="b">Replies</Tabs.Trigger>\n  </Tabs.List>\n  <Tabs.Content value="a">…</Tabs.Content>\n</Tabs.Root>',
    backdrops: 'The selected pill is accent blue in both themes. Unselected rings switch from white to ink at low opacity.',
    purpose: 'Switches between two to five views of the same thing.',
    importLine: "import { Tabs } from 'pane-react';",
    overview: (
      <>
        <p>Pill tabs from the anchor card. The selected tab is a solid blue pill; the others keep only a thin ring and no fill. During tuning a white fill lifted the backdrop under their white text below 4.5:1. Panels enter with an 8px rise and fade over 640ms.</p>
        <p>Radix supplies the behaviour, including the single tab stop, arrow keys, Home and End, automatic activation and the tablist wiring. Pane adds the look and writes no key handling of its own.</p>
      </>
    ),
    hero: ex('TabsBasic', 'Three views of a profile, left uncontrolled.'),
    ladder: [
      ex('TabsControlled', 'Control the value when something else on the screen depends on the current view.'),
      ex('TabsInHeader', 'Tabs can sit beside a card heading with the content below.'),
    ],
    whenToUse: ['Two to five views of the same object, like Tweets, Replies and Media.'],
    whenNotToUse: [['Moving between pages', 'Navigation links'], ['Triggering actions', 'Buttons'], ['More than five sections', 'A list. Tabs that wrap stop being tabs']],
    anatomy: [['List', 'tablist with an aria-label.'], ['Trigger', 'Pill; ring when unselected, blue fill when selected.'], ['Panel', 'tabpanel labelled by its tab; animated entrance.']],
    states: [['Unselected', 'Ring only, white text with halo.'], ['Selected', 'Blue fill, white text, no halo.'], ['Focus', 'Ring + dark halo.'], ['Forced colours', 'Selected tab gets a Highlight border and an underline. Never colour alone.']],
    content: ['One short word per tab. The list must never wrap.'],
    dodont: [
      { do: 'Keep labels to one word.', dont: 'Use tabs to run actions; they switch views.' },
      { do: 'Label the tab list (“Profile sections”).', dont: 'Leave a page with two unlabelled tab lists.' },
    ],
    a11y: ['tablist / tab / tabpanel with aria-controls and aria-selected (Radix).', 'One tab stop for the whole list.', 'Arrow keys, Home, End and wrap-around are verified in real Chromium.'],
    keyboard: [
      ['Tab', 'Into the list, onto the selected tab; the next Tab leaves the list', 'Tabs: one tab stop, so Tab lands on the selected tab and the next Tab leaves the list'],
      ['→ / ←', 'Next / previous tab, wrapping around', 'Tabs: arrow keys move focus and selection, and Home and End jump to the ends'],
      ['Home / End', 'First / last tab', 'Tabs: arrow keys move focus and selection, and Home and End jump to the ends'],
    ],
    inherits: 'Radix Tabs. Root: value, defaultValue, onValueChange, orientation · Trigger: value, disabled · Content: value, forceMount',
    related: [['/components/button', 'Button', 'When the user is running an action.'], ['/patterns/settings-panel', 'Settings panel', 'Tabs over grouped settings.']],
  },
  {
    name: 'Tag',
    slug: 'tag',
    status: 'beta',
    limitations: ['Tags are static text. There is no click or remove behaviour; use a Chip for that.', 'Small caps rely on CSS, so copied text keeps its original case.'],
    youMust: ['Keep tags short, one to three words.', 'Do not use a tag as the only place a status is stated. Use a Badge for status.'],
    usage: '<Tag>Visual asset 05</Tag>',
    backdrops: 'The outline uses the primary text colour, so it is white in dark and ink in light. On photos keep tags inside a scrim in either theme.',
    purpose: 'Labels content with a category, in outlined small caps.',
    importLine: "import { Tag } from 'pane-react';",
    overview: (
      <>
        <p>An outlined small-caps label for categorising content. The “VISUAL ASSET 05” pill from ref 2. The text is written in normal case and uppercased by CSS, so screen readers read the words.</p>
      </>
    ),
    hero: ex('TagBasic', 'A post with a few category tags.'),
    ladder: [
      ex('TagMetaRow', 'In a trends list the tag works as the category line.'),
      ex('TextOnImage', 'On an image the tag sits inside the scrim with the other text.', true),
    ],
    whenToUse: ['Categories and topics such as Trending, Tech or Asset 05.', 'Metadata on media.'],
    whenNotToUse: [['Status that changes (online, failed)', 'Words in the content, announced in a live region'], ['Filters the user toggles', 'Buttons with aria-pressed']],
    anatomy: [['Outline', '1px ring in text.primary.'], ['Label', '11px, caps tracking 0.08em, uppercase via CSS.']],
    content: ['Two words or fewer.'],
    dodont: [
      { do: 'Use it to label.', dont: 'Make it clickable. It has no button semantics.' },
      { do: 'Keep it short.', dont: 'Put a sentence in a tag.' },
    ],
    a11y: ['Plain <span>, no role.', 'Uppercase is presentational, so it is read as words.'],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/button', 'Button', 'When the label needs to do something.'], ['/patterns/text-on-images', 'Text on images', 'Tag on a photo.']],
  },
  {
    name: 'Container',
    slug: 'container',
    status: 'beta',
    limitations: ['It sets width and margins only. It does not centre content vertically.', 'There is no full-bleed escape hatch for one child.'],
    youMust: ['Wrap each page region once. Containers inside containers double the margins.', 'Choose a size from the reading width you need, not from the screen.'],
    usage: '<Container size="lg">…</Container>',
    backdrops: 'Containers have no surface, so themes and backdrops leave them unchanged.',
    purpose: 'Centres a page or region at a maximum width, with the responsive page margin on both sides.',
    importLine: "import { Container } from 'pane-react';",
    overview: (
      <>
        <p>The outer frame of a page. <code>Container</code> caps its content at one of five widths and adds <code>layout.margin</code> on both sides. 16px on phones, 32px from md (768px), 48px from lg (1024px). The margin and the widths are tokens; the breakpoints come from the token build, so nothing here is typed twice.</p>
        <p>Use it once per page body and let <Link to="/components/grid">Grid</Link> divide what is inside.</p>
      </>
    ),
    hero: ex('ContainerPage', 'The page body here is centred at lg with the responsive margin.', true),
    ladder: [
      ex('ContainerSizes', 'Each outline shows one maximum width. sm is 640px, md 768, lg 1024, xl 1200 (the default) and 2xl 1440.', true),
      ex('ContainerReading', 'For long reading, size sm keeps lines near 60 to 75 characters.', true),
      ex('ContainerWithGrid', 'Container around a Grid is the usual page frame.', true),
    ],
    whenToUse: ['The body of every page.', 'A region that must not stretch on very wide screens (a form, an article).'],
    whenNotToUse: [['Spacing between siblings', 'Stack. Gaps belong to the parent'], ['Columns', 'Grid']],
    anatomy: [['Max width', 'container.max-{size} → layout.container-{size}.'], ['Inline margin', 'container.margin points at layout.margin, which is 16, 32 or 48px by breakpoint.']],
    content: ['Pick the narrowest size that fits the content.'],
    dodont: [
      { do: 'One Container per page body.', dont: 'Nest Containers to add more margin. Use Stack or Grid inside.' },
      { do: 'Use sm for long-form reading.', dont: 'Let paragraphs run 1,400px wide.' },
    ],
    a11y: ['A plain div. No landmark of its own. Put it inside <main>, or pass role/aria-label if it is the landmark.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/grid', 'Grid', 'When the inside needs columns.'], ['/foundations/grid', 'Grid & layout', 'Margins, gutters and breakpoints.']],
  },
  {
    name: 'Grid',
    slug: 'grid',
    status: 'beta',
    limitations: ['Spans are set per breakpoint in whole columns. There is no subgrid or row spanning.', 'Column counts are fixed by the tokens at 4, 8 and 12.'],
    youMust: ['Keep source order the same as visual order so keyboard and screen reader order match.', 'Use full span on small screens unless the content truly fits in a narrow column.'],
    usage: '<Grid>\n  <GridItem span="full" lg={8}>…</GridItem>\n  <GridItem span="full" lg={4}>…</GridItem>\n</Grid>',
    backdrops: 'Grids have no surface either. The panes inside them carry the theme.',
    purpose: 'Lays content out on 4, 8 or 12 columns depending on the screen, with token gutters.',
    importLine: "import { Grid, GridItem } from 'pane-react';",
    overview: (
      <>
        <p>This grid has 4 columns below md (768px), 8 from md and 12 from lg (1024px), with gutters of 16, 24 and 32px. <code>GridItem</code> spans a number of columns, set per breakpoint with <code>span</code>, <code>md</code> and <code>lg</code>. Spans are clamped to the current column count, so a 6-column item never overflows a 4-column phone grid.</p>
        <p>The breakpoint switching is generated by the token build from the breakpoint tokens. The component carries no pixel values at all.</p>
      </>
    ),
    hero: ex('GridResponsive', 'These cards go full width on phones, halves at md and thirds at lg.', true),
    ladder: [
      ex('GridBasic', 'The column count changes from 4 to 8 to 12 as the screen grows. Resize the window to watch it.', true),
      ex('GridPage', 'Main content and a sidebar. Under lg the sidebar drops below the content.', true),
      ex('GridColumns', 'Pass columns for a local grid that should keep its own count.', true),
    ],
    whenToUse: ['Page layouts with columns.', 'Card collections that should reflow by screen size.'],
    whenNotToUse: [['A single row or column of things', 'Stack'], ['A data table', 'A real <table>']],
    anatomy: [['Grid', 'A CSS grid whose column count and gap come from the grid tokens.'], ['GridItem', 'Sets span variables and data attributes, and a generated rule picks the right span for each breakpoint.']],
    states: [['< 768px', '4 columns, 16px gutter, 16px margin.'], ['≥ 768px (md)', '8 columns, 24px gutter, 32px margin.'], ['≥ 1024px (lg)', '12 columns, 32px gutter, 48px margin.']],
    content: ['Think in fractions of the current column count. Four of twelve columns at lg is a third.'],
    dodont: [
      { do: 'Let items default to full width on phones.', dont: 'Force three columns on a 375px screen.' },
      { do: 'Keep source order = reading order.', dont: 'Reorder visually with spans and leave the DOM in a different order.' },
    ],
    a11y: ['Purely visual. The DOM order is the reading and tab order, whatever the spans.', 'Real Chromium confirms 4 columns at 375px, 8 at 800px and 12 at 1280px, and that spans clamp.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/stack', 'Stack', 'When there is only one direction.'], ['/components/container', 'Container', 'The frame around the grid.'], ['/foundations/grid', 'Grid & layout', 'The full layout token set.']],
  },
  {
    name: 'Stack',
    slug: 'stack',
    status: 'beta',
    limitations: ['It does not wrap items onto a new line. Use Grid for that.', 'Gaps are limited to the token scale.'],
    youMust: ['Use the smallest gap that still separates the items.', 'Use a list element inside the Stack when the items are a list.'],
    usage: '<Stack gap="md">…</Stack>',
    backdrops: 'Stacks only space things out, so they look the same in every theme.',
    purpose: 'Spaces children in one direction with a token gap, so children never carry their own margins.',
    importLine: "import { Stack } from 'pane-react';",
    overview: (
      <>
        <p><code>Stack</code> lays children out in one direction, a column by default or a wrapping row, with one of five gaps from 4 to 32px. Space belongs to the parent. Pane components have no outer margins, and Stack is how you separate them.</p>
      </>
    ),
    hero: ex('StackBasic', 'Inside a card, a stack holds the title, a line of detail and a row of actions.'),
    ladder: [
      ex('StackDirection', 'Stacks run in a column by default. Rows wrap.'),
      ex('StackGaps', 'Five gaps are available. xs is 4px, sm 8, md 16 (the default), lg 24 and xl 32.'),
      ex('StackAlign', 'align sets the cross axis to start, center, end or stretch.'),
      ex('StackForm', 'A settings group nests rows inside a column, with the label and value side by side.'),
      ex('TagMetaRow', 'Mixed items in one list still get their spacing from the stack.'),
    ],
    whenToUse: ['Any vertical rhythm inside a card.', 'A row of buttons, tags or chips.'],
    whenNotToUse: [['Two-dimensional layouts', 'Grid'], ['Lists with semantics', 'A real <ul>/<ol>, laid out with Stack inside if needed']],
    anatomy: [['Flex container', 'flex-direction column | row (wrap).'], ['Gap', 'stack.gap-{xs…xl} → gap tokens.']],
    content: ['Choose the gap by relationship. Things that belong together sit tighter, and groups sit further apart.'],
    dodont: [
      { do: 'Space with the parent’s gap.', dont: 'Add margins to children to push them apart.' },
      { do: 'Nest stacks for groups within groups.', dont: 'Use one huge gap for everything.' },
    ],
    a11y: ['A plain div. Add role="group" + aria-label when the stack is a group of controls (see the chip examples).'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/grid', 'Grid', 'When you need columns.'], ['/foundations/spacing', 'Spacing', 'The gap scale.']],
  },
  {
    name: 'Badge',
    slug: 'badge',
    status: 'beta',
    limitations: ['Badges are not live regions. A changing count is not announced on its own.', 'The dot alone carries no meaning for screen readers.'],
    youMust: ['Put the status in the text, not only in the colour or the dot.', 'Announce changes yourself, for example with a Banner set to live.'],
    usage: '<Badge tone="positive" dot>Live</Badge>',
    backdrops: 'Status fills are identical in both themes because their text pairs are computed on the fill itself. The neutral badge follows the glass, with white text in dark and ink text in light.',
    purpose: 'Shows a short status. A state, a count, a version. In words, with colour as a second cue.',
    importLine: "import { Badge } from 'pane-react';",
    overview: (
      <>
        <p>A small pill of text. <code>neutral</code> is a glass ring with white text; <code>info</code>, <code>positive</code>, <code>warning</code> and <code>critical</code> are solid status fills whose text pairs are computed above 4.5:1 (white on green 5.02, ink on amber 9.90, white on red 5.66, white on blue 4.70). A <code>dot</code> adds a shape cue for presence-style statuses.</p>
        <p>The words carry the meaning; colour reinforces it. “Failed” in red is a badge, a red dot alone is not.</p>
      </>
    ),
    hero: ex('BadgeInList', 'Status usually sits at the end of each row in a list.'),
    ladder: [
      ex('BadgeTones', 'There is a neutral glass badge and four status fills.'),
      ex('BadgeDot', 'Add a dot for presence statuses. It gives a shape cue on top of the colour.'),
      ex('BadgeCount', 'Inside a button, the count becomes part of the accessible name.'),
    ],
    whenToUse: ['States such as Live, Draft or Failed.', 'A count next to a label, like “3 new”.'],
    whenNotToUse: [['Categories', 'Tag. Badges are status, tags are topics'], ['Anything clickable', 'Chip or Button'], ['A message that needs explanation', 'Banner']],
    anatomy: [['Pill', '22px tall, corner.round.'], ['Dot (optional)', '6px, currentColor; CanvasText in forced colours.'], ['Label', '13px semibold; no halo on solid fills.']],
    states: [['neutral', 'Glass ring, white text with halo.'], ['info / positive / warning / critical', 'Solid fill; text pair computed ≥4.5:1.']],
    content: ['One or two words. Use the same word for the same state everywhere.'],
    dodont: [
      { do: 'Say the status in words.', dont: 'Use colour alone. “red dot” is not a status.' },
      { do: 'Use critical only for failures that need attention.', dont: 'Paint every badge red to make it noticed.' },
    ],
    a11y: ['Plain <span> text. Read in place.', 'If a badge changes while the user is on the page, announce the change through a live region (Banner live, or your own).'],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/tag', 'Tag', 'For topics and categories.'], ['/components/banner', 'Banner', 'When the status needs a sentence.']],
  },
  {
    name: 'Chip',
    slug: 'chip',
    status: 'beta',
    limitations: ['There is no group component that limits selection to one chip.', 'Removed chips are gone. There is no undo built in.'],
    youMust: ['Wrap a set of chips in a group with a label that says what they filter.', 'Move focus to a sensible place after a chip is removed.'],
    usage: '<Chip defaultSelected>Photos</Chip>\n<Chip onRemove={() => {}}>Ada Lovelace</Chip>',
    backdrops: 'Selected chips invert with the theme the same way solid buttons do. Unselected chips follow the quiet glass fill.',
    purpose: 'Lets people filter by toggling a choice, or holds a value they can remove.',
    importLine: "import { Chip } from 'pane-react';",
    overview: (
      <>
        <p>One component covers two kinds of chip. A <b>filter chip</b> is a toggle built on a native button with <code>aria-pressed</code>. Selected chips turn solid white and show a check mark, so selection has a shape cue as well as colour. An <b>input chip</b> holds a value (a recipient, a tag) and, when <code>onRemove</code> is set, shows a remove button named “Remove {'{label}'}”.</p>
      </>
    ),
    hero: ex('ChipFilter', 'A group of filter chips, one of them pre-selected.'),
    ladder: [
      ex('ChipControlled', 'Here the selection drives a count below, which is announced politely.'),
      ex('ChipInput', 'Give a chip onRemove and it gets a labelled remove button.'),
    ],
    whenToUse: ['Filtering a list by a few options.', 'Showing values the user added (recipients, keywords).'],
    whenNotToUse: [['A single on/off setting', 'A switch or checkbox'], ['Choosing views', 'Tabs'], ['Static labels', 'Tag or Badge']],
    anatomy: [['Pill', '32px, glass fill + ring; selected = white fill, ink text.'], ['Check mark', 'Shown when selected (filter).'], ['Remove button', 'Separate button, its own focus stop (input).']],
    states: [['Unselected', 'Glass fill, ring.'], ['Selected', 'White fill, ink text, check mark, aria-pressed="true".'], ['Pressed', 'Scales to 0.97.'], ['Forced colours', 'Selected border in Highlight.']],
    content: ['Use short nouns like “Photos” and “Videos”, and give the group a label such as “Filter posts”.'],
    dodont: [
      { do: 'Wrap filter chips in role="group" with a label.', dont: 'Leave a row of toggles with no context.' },
      { do: 'Name remove buttons after their chip.', dont: 'Five buttons all called “Remove”.' },
    ],
    a11y: ['A filter chip is a native button with aria-pressed, so Space and Enter toggle it.', 'An input chip keeps its label as plain text and puts removal on its own button named “Remove” plus the label.'],
    keyboard: [['Tab', 'Moves between chips (and remove buttons)', 'Chip: reachable with Tab'], ['Space / Enter', 'Toggles a filter chip', 'Chip: Space and Enter toggle aria-pressed']],
    inherits: 'ButtonHTMLAttributes<HTMLButtonElement> (on the toggle)',
    related: [['/components/tabs', 'Tabs', 'When exactly one view is shown at a time.'], ['/components/tag', 'Tag', 'When it’s just a label.']],
  },
  {
    name: 'Banner',
    slug: 'banner',
    status: 'beta',
    limitations: ['Banners stack in source order. There is no queue, limit or priority sorting.', 'Dismiss state is not remembered across visits.', 'A message that must interrupt every pane at once, such as a lost connection, needs an app-level surface that Pane does not have yet.'],
    youMust: ['Set live only for banners that appear after the page loads.', 'Keep the title to one short sentence and put the detail in the body.'],
    usage: '<Card>\n  <Banner tone="warning" title="Card expires next month">\n    Update it to avoid a pause.\n  </Banner>\n  …\n</Card>',
    backdrops: 'The banner has no surface, so it takes the pane it is written on. Only the glyph changes: brighter tone colours on dark glass, deeper ones on light glass, so a small mark stays visible on both.',
    purpose: 'Tells people something about the pane it sits on, as a line written on the glass: what happened and what to do.',
    importLine: "import { Banner } from 'pane-react';",
    overview: (
      <>
        <p>A banner is a message about the pane it sits on, written as a line on the glass. It has no box, no fill and no coloured stripe. A second surface inside one sheet of glass would be a layer that is not there, and a coloured fill would repaint a pane whose colour belongs to the scene. The line is a glyph, a title, optional detail and optional actions, separated from the rest of the pane by a hairline.</p>
        <p>Each tone has its own glyph shape (circle, check, triangle, octagon) and its own spoken word, and only the glyph is coloured. When a banner arrives or is dismissed, it opens or closes its own height so the content below slides instead of jumping.</p>
        <p>Banners already on the page when it loads stay silent, since announcing them would interrupt for nothing. Banners that appear because of something the reader did set <code>live</code>, with <code>polite</code> for news and <code>assertive</code> for errors.</p>
      </>
    ),
    hero: ex('BannerInPage', 'The message is the first line of the pane it is about, separated by a hairline. There is no box: one sheet of glass stays one layer.'),
    ladder: [
      ex('BannerTones', 'Four tones. Each has its own glyph shape and its own spoken word, and only the glyph carries the tone colour.'),
      ex('BannerAction', 'Actions sit at the end of the line. Keep them quiet, unless acting on the message is the only thing the pane is for.'),
      ex('BannerLive', 'Use live for messages that appear after something the reader did. Polite maps to a status role and assertive to an alert.'),
      ex('BannerStack', 'Several messages stack as lines on the same pane. Dismissing one closes its height so the rest slide up.'),
      ex('BannerLong', 'Long titles and details wrap, and the actions drop below the text on narrow panes. Right-to-left mirrors the line.'),
      ex('BannerPage', 'The same line on an opaque reading surface, such as docs or settings, where there is no glass.'),
      ex('QuickStart', 'This is the kind of card a banner sits on.'),
    ],
    whenToUse: ['Lasting context such as a billing problem, a rollout or maintenance.', 'The result of an action, such as saved or failed.'],
    whenNotToUse: [['A one-word status', 'Badge'], ['Something that needs a decision before continuing', 'A dialog (not in Pane yet)']],
    anatomy: [['Glyph', '18px outline in the tone colour, a different shape per tone.'], ['Title', 'Semibold, the only heavy text in the line, prefixed for screen readers with the tone word.'], ['Detail', 'Secondary text under the title.'], ['Actions', 'At the end of the line, wrapping below the text on narrow panes.'], ['Dismiss', '32px quiet disc with a 44px press area.'], ['Hairline', 'Separates the message from the rest of the pane.']],
    states: [['Appears', 'Its row opens from zero height over 640ms, so the content below is pushed gently.'], ['Dismissed', 'Its row closes over 420ms, then onDismiss runs so the parent can remove it.'], ['Reduced motion', 'Appears and leaves at once.']],
    content: ['The title says what happened (“Upload failed”). The detail says why and what to do next (“The file is larger than 25 MB.”).'],
    dodont: [
      { do: 'Tell people what to do next.', dont: 'Show “Error 413.” and stop there.' },
      { do: 'Use live only for banners that appear after an action.', dont: 'Make every banner on page load an alert.' },
      { do: 'Write the message on the pane it is about.', dont: 'Wrap it in a coloured box with a stripe on its edge.' },
    ],
    a11y: ['A static banner is a section element labelled by its tone.', 'live="polite" → role="status"; live="assertive" → role="alert".', 'Dismiss is a real button named “Dismiss”.'],
    keyboard: [['Tab', 'To the action, then to Dismiss', 'Banner: dismiss is a named button and removes the banner']],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/badge', 'Badge', 'When a word is enough.'], ['/accessibility', 'Accessibility', 'How live regions are tested.']],
  },
];
