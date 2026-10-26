// Component chapters — the prose half of each page. Everything else on a component page is
// generated: props (meta.json, react-docgen-typescript), demo floor (meta.json), tokens used (the
// CSS module), keyboard verification (conformance.json), contrast (evidence.json).
// Examples are real files in ../examples, rendered and shown as source from the same module.
import type { ComponentType, ReactNode } from 'react';

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
  related: Array<[string, string, string]>; // path · label · "use it instead when…"
}

export const COMPONENTS: ComponentChapter[] = [
  {
    name: 'Environment',
    slug: 'environment',
    purpose: 'Tells every glass surface inside it how bright the scene behind can get, so the glass dims it by the measured amount.',
    importLine: "import { Environment } from 'pane-react';",
    overview: (
      <>
        <p>Glass has no colour of its own — it shows whatever is behind it, and white text on it is only as readable as the brightest thing that can slide underneath. A native visionOS window can read the room’s pixels; a web page cannot read the pixels behind its own elements. <code>Environment</code> is the honest substitute: the app declares the backdrop’s brightness and every glass surface inside dims what it shows through by the amount measured for that level.</p>
        <p>It renders a plain <code>{'<div data-environment>'}</code> with no styles, no layout and no semantics. It only re-points the glass tokens for its subtree — so it can wrap a whole screen or a single region that sits over a different backdrop.</p>
      </>
    ),
    hero: ex('QuickStart', 'The canonical use: one Environment at the top of a screen, Cards inside it.'),
    ladder: [
      ex('EnvironmentLevels', 'brightness — the one prop. Each level shown on the kind of scene it is for. dim and mid are uncalibrated today and resolve to the bright value.', true),
      ex('EnvironmentDefault', 'No declaration at all. Glass resolves to the bright level — the safe end, never the lightest.'),
      ex('EnvironmentNested', 'A region over a different backdrop declares its own level; the nearest Environment wins.', true),
    ],
    whenToUse: [
      'Once at the root of any screen with glass on it, before the first Card.',
      'Around a region whose backdrop differs from the rest of the screen (a media viewer inside a lighter shell).',
      'Whenever you ship a new background image — run tooling/glass-sweep.mjs on it and set the level it measures.',
    ],
    whenNotToUse: [['To make one card look darker for emphasis', 'Hierarchy comes from type and placement, not tint'], ['On an opaque screen with no glass', 'Nothing to configure — leave it out']],
    anatomy: [
      ['Wrapper', 'div[data-environment="dim | mid | bright"] — no styles of its own.'],
      ['Re-pointed tokens', '--ds-glass-brightness and every token that depends on it (e.g. --ds-card-brightness) are re-declared for the subtree, because a custom property holding var() resolves where it is declared.'],
      ['Fallback', 'Reduced transparency, forced colours or no backdrop-filter override it: opaque glass, no dimming.'],
    ],
    states: [['dim', 'UNCALIBRATED — equals bright until a genuinely dark photo is measured.'], ['mid', 'UNCALIBRATED — same.'], ['bright (default)', 'Measured on four sunlit photos: 0.46. 42 nodes at 3.85–4.49:1 are registered as E-001.']],
    content: ['Name the level after the backdrop’s brightest region, not its mood. The Night café photo is bright: it has a lit window.'],
    dodont: [
      { do: 'Set it once per screen, sized for the brightest spot a card can land on while scrolling.', dont: 'Pick a darker level because a scene is “mostly dark” — the card that lands on its one bright spot fails.' },
      { do: 'Re-measure with glass-sweep whenever the background image changes.', dont: 'Copy another app’s level; the number belongs to the image, not to the component.' },
    ],
    a11y: ['No semantics — never appears in the accessibility tree.', 'Without it, glass resolves to bright: the safest default.', 'A user’s system setting (reduced transparency, forced colours) always wins over the app’s declaration.'],
    inherits: 'HTMLAttributes<HTMLDivElement>',
    related: [['/components/card', 'Card', 'Environment configures glass; Card is the glass.'], ['/foundations/glass', 'Glass & environment', 'How the numbers per level were measured.'], ['/reference/exceptions', 'E-001', 'What the bright level does not fully meet.']],
  },
  {
    name: 'Card',
    slug: 'card',
    purpose: 'Puts content on a pane of clear, blurred glass that dims the scene behind it just enough for white text.',
    importLine: "import { Card, CardCover } from 'pane-react';",
    overview: (
      <>
        <p>The pane. A <code>Card</code> is clear glass: a 6% white tint with a faint top sheen, a 64px blur that turns the scene into soft colour, a 1.8× saturation lift so that colour stays alive, and the environment’s dimming so white text stays readable. It has no hard border — a gradient specular rim catches the light at the top-left and drifts slowly on hover.</p>
        <p>Everything in Pane sits on a Card. The <code>inset</code> variant nests content inside a pane without a second layer of glass. <code>CardCover</code> is the full-bleed image strip at the top, pulled to the card edges automatically.</p>
      </>
    ),
    hero: ex('CardVariants', 'The canonical card: cover, title, meta, a nested inset section and one action.'),
    ladder: [
      ex('CardInset', 'variant="inset" — a quoted post inside a post. One glass layer; the inset adds only a divider and padding.'),
      ex('CardAsSection', 'as="section" — a titled region. Point aria-labelledby at its heading.'),
      ex('CardCoverImage', 'CardCover with a real image. The cover is decorative; put meaning in the text below it.'),
      ex('CardGrid', 'Composition: a grid of panes with the backdrop visible in the gaps.', true),
    ],
    whenToUse: ['Any group of related content: a profile, a post, a settings section, a dialog body.', 'Under every piece of text — Pane guarantees contrast only on its own glass.', 'variant="inset" for a sub-section inside a card.'],
    whenNotToUse: [['A card inside a card', 'variant="inset" — no second glass layer'], ['A clickable tile', 'Put a Button or a link inside; Card itself is not interactive'], ['Decoration with no content', 'Leave the backdrop visible']],
    anatomy: [
      ['Glass', 'Tint (surface.glass) + blur 64px + saturate 1.8 + brightness from the environment.'],
      ['Sheen', 'Top-down white gradient, 10% → 3%.'],
      ['Specular rim', '1px gradient ring via a mask — bright top-left, faint middle, soft bottom-right; drifts on hover over 640ms.'],
      ['Float shadow', 'elevation.float — a long, soft drop.'],
      ['Halo', 'Text inside inherits card.text-halo; solid-fill controls reset it.'],
      ['Cover (optional)', 'CardCover — full-bleed, decorative.'],
    ],
    states: [['Rest', 'Rim light top-left.'], ['Hover', 'Rim light drifts toward the centre over 640ms — the light moves, the card does not.'], ['Environment change', 'Dimming glides over 640ms instead of snapping.']],
    content: ['A section card gets a heading and aria-labelledby; an article card without a heading gets an aria-label.'],
    dodont: [
      { do: 'Put every piece of text on a Card.', dont: 'Lay body text straight onto a photo — even the halo cannot carry it.' },
      { do: 'Nest with variant="inset".', dont: 'Stack glass on glass — the second blur samples the first and text loses its edge.' },
    ],
    a11y: ['Renders a real <article>, <section>, <header> or <div>.', 'Forced colours: the rim becomes a solid CanvasText border.', 'Reduced transparency: opaque graphite, no dimming.'],
    inherits: 'HTMLAttributes<HTMLElement>',
    related: [['/components/environment', 'Environment', 'When the glass needs to know a different backdrop brightness.'], ['/foundations/shape', 'Shape & elevation', 'Corner and shadow rules for nesting.'], ['/patterns/profile-card', 'Profile card', 'A full card assembled from every component.']],
  },
  {
    name: 'Avatar',
    slug: 'avatar',
    purpose: 'Shows who a piece of content belongs to, as a round photo or initials.',
    importLine: "import { Avatar } from 'pane-react';",
    overview: (
      <>
        <p>A round portrait. With <code>src</code> it shows the photo cropped to a circle; without one it shows up to two initials from <code>name</code>. The large size carries the white rim ring from the anchor card so it reads as sitting on top of the cover.</p>
        <p>An avatar is almost always next to the person’s name. Then mark it <code>decorative</code>: it is hidden from assistive technology so the name is announced once.</p>
      </>
    ),
    hero: ex('AvatarDecorative', 'The canonical use: a decorative avatar beside the visible name and handle.'),
    ladder: [
      ex('AvatarSizes', 'size — sm 30px for post headers, md 44px for lists, lg 84px with a rim ring for profile headers.', true),
      ex('AvatarPhoto', 'Photo or initials — the same name drives the accessible label and the fallback.', true),
      ex('AvatarGroup', 'Composition: a stack of participants. The group carries the names; each avatar is decorative.'),
    ],
    whenToUse: ['Identifying the person or brand behind content.', 'Overlapping a cover image (lg), as in the profile card.'],
    whenNotToUse: [['A generic “user” glyph with no identity', 'An icon'], ['A product image', 'An <img> with real alt text']],
    anatomy: [['Circle', 'corner.round, clipped.'], ['Photo or initials', 'Initials = first letters of the first two words of name.'], ['Rim ring (lg)', '4px ring in line.rim-hi.']],
    content: ['name is the real name or handle, never “avatar” or “profile picture”.'],
    dodont: [
      { do: 'Mark it decorative beside a visible name.', dont: 'Leave it announced next to the name — readers hear “Max Fmz, Max Fmz”.' },
      { do: 'Label a stack once, on the group.', dont: 'Announce every face in a stack of twenty.' },
    ],
    a11y: ['Not decorative: role="img" with aria-label from name.', 'Decorative: aria-hidden="true". Never both.', 'Initials are aria-hidden inside the labelled wrapper.'],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/icon-button', 'IconButton', 'When the round thing is an action, not an identity.'], ['/patterns/feed-post', 'Feed post', 'Avatar in a post header.']],
  },
  {
    name: 'Button',
    slug: 'button',
    purpose: 'Runs an action, in one of three weights so a card has exactly one loud choice.',
    importLine: "import { Button } from 'pane-react';",
    overview: (
      <>
        <p>Pill-shaped buttons. <code>light</code> is the solid white pill from the anchor card (“Follow”) — the one main action of a card. <code>accent</code> is solid blue for a promoted action. <code>glass</code> is a quiet translucent fill for everything secondary.</p>
        <p>Motion is soft: on hover a button rises 2px over 420ms with a long settling ease; on press it scales to 97% over 200ms — unhurried, but quick enough to feel like a response.</p>
      </>
    ),
    hero: ex('ButtonPair', 'The canonical use: one light action and one glass alternative at the foot of a card.'),
    ladder: [
      ex('ButtonVariants', 'variant — light (white, 18.74:1), accent (blue #0071E3, 4.70:1), glass (8% white over the card glass; 14% lifted the backdrop under white text to 4.25:1).'),
      ex('ButtonSizes', 'size — md 44px (default, touch-friendly) and sm 32px for dense rows.'),
      ex('ButtonDisabled', 'disabled — the native attribute. Say why in text next to it; a disabled button cannot be focused to ask.'),
      ex('ButtonWithIcon', 'Composition: a leading icon. The icon is decorative; the label carries the meaning.'),
    ],
    whenToUse: ['Actions: follow, save, send, open.', 'light for the single action a card exists for; glass for the rest.'],
    whenNotToUse: [['Navigating to another page', 'A link — buttons do, links go'], ['An icon-only action', 'IconButton (it requires a label)'], ['Switching views', 'Tabs']],
    anatomy: [['Pill', 'corner.round; 44px (md) or 32px (sm) tall.'], ['Label', '15/14px semibold; no halo on solid fills.'], ['Lift shadow', 'elevation.lift on light and accent.'], ['Focus ring', '2px white ring 2px out + 5px dark halo.']],
    states: [['Hover', 'Rises 2px, 420ms soft ease.'], ['Pressed', 'Scales to 0.97, 200ms.'], ['Focus', 'White ring + dark halo.'], ['Disabled', 'Native disabled, 50% opacity, no motion.']],
    content: ['Verb first, one or two words: “Follow”, “Save changes”. Not “Click here”, not “OK”.'],
    dodont: [
      { do: 'One light button per card.', dont: 'Put light and accent side by side for equal actions — two loud buttons cancel out.' },
      { do: 'Say what happens: “Delete post”.', dont: 'Say how to do it: “Click to delete”.' },
    ],
    a11y: ['Native <button>; type defaults to "button" so it never submits a form by accident.', 'Focus ring visible on every scene.', 'Forced colours: a ButtonText border replaces the fill.'],
    keyboard: [['Tab', 'Moves focus to the button', 'Button: reachable with Tab'], ['Enter', 'Activates it', 'Button: Enter and Space activate it'], ['Space', 'Activates it', 'Button: Enter and Space activate it']],
    inherits: 'ButtonHTMLAttributes<HTMLButtonElement>',
    related: [['/components/icon-button', 'IconButton', 'When the action is a well-known icon in a dense row.'], ['/components/tabs', 'Tabs', 'When the “action” is really switching a view.'], ['/foundations/motion', 'Motion', 'The hover and press timings.']],
  },
  {
    name: 'IconButton',
    slug: 'icon-button',
    purpose: 'Runs a common action from an icon alone, with a label the type system will not let you forget.',
    importLine: "import { IconButton } from 'pane-react';",
    overview: (
      <>
        <p>A round, icon-only button. <code>glass</code> is a frosted disc for standalone actions (edit, close); <code>ghost</code> is the bare icon for dense rows (more, share), where a disc on every icon would be noise.</p>
        <p><code>aria-label</code> is required by the TypeScript type: an icon has no text, so the label is the button’s entire name. An unnamed icon button does not compile.</p>
      </>
    ),
    hero: ex('IconButtonVariants', 'The canonical pair: a frosted edit disc and ghost overflow/share icons.'),
    ladder: [
      ex('IconButtonSizes', 'size — md 36px disc; sm 32px for action rows.'),
      ex('IconButtonActionRow', 'Composition: a row of ghost actions. Each label names the action and, where useful, the count.'),
      ex('IconButtonOnCover', 'Composition: a disc on a photo. Its own 20px blur keeps the icon legible on the image.'),
      ex('FeedPost', 'Composition: overflow and share in a full post.', true),
    ],
    whenToUse: ['Well-known actions: edit, more, share, close.', 'Dense rows where text buttons would crowd the content.'],
    whenNotToUse: [['An action whose icon needs explaining', 'A Button with a text label'], ['The main action of a card', 'A light Button']],
    anatomy: [['Disc (glass)', 'surface.quiet fill with its own 20px blur.'], ['Icon', '18px, currentColor stroke.'], ['Focus ring', 'Same ring + halo as Button.']],
    states: [['Hover', 'Rises 2px; ghost brightens to the primary text colour.'], ['Pressed', 'Scales to 0.97.']],
    content: ['Label the action, not the picture: “Edit profile”, not “Pencil”.'],
    dodont: [
      { do: 'Use well-known icons only.', dont: 'Invent an icon and rely on a tooltip to explain it.' },
      { do: 'Include the count in the label when the icon shows one (“Reply, 268”).', dont: 'Leave the number visible but unannounced.' },
    ],
    a11y: ['aria-label required at the type level.', 'The conformance run checks every page of this book: no button without visible text is unnamed.'],
    keyboard: [['Tab', 'Moves focus to it', 'IconButton: reachable with Tab'], ['Enter / Space', 'Activates it (native button)', 'Button: Enter and Space activate it']],
    inherits: 'ButtonHTMLAttributes<HTMLButtonElement> (minus aria-label, which is redeclared as required)',
    related: [['/components/button', 'Button', 'When the action needs words.'], ['/foundations/icons', 'Iconography', 'The icon set and sizes.']],
  },
  {
    name: 'Tabs',
    slug: 'tabs',
    purpose: 'Switches between two to five views of the same thing.',
    importLine: "import { Tabs } from 'pane-react';",
    overview: (
      <>
        <p>Pill tabs from the anchor card. The selected tab is a solid blue pill; the others keep only a thin ring and no fill — during tuning a white fill lifted the backdrop under their white text below 4.5:1. Panels enter with an 8px rise and fade over 640ms.</p>
        <p>Behaviour is Radix’s: one tab stop, arrow keys, Home/End, automatic activation and the full tablist/tab/tabpanel wiring. Pane adds only the look and never its own key handling.</p>
      </>
    ),
    hero: ex('TabsBasic', 'The canonical use: three views of a profile, uncontrolled.'),
    ladder: [
      ex('TabsControlled', 'Controlled — value and onValueChange, for when something else on the screen depends on the view.'),
      ex('TabsInHeader', 'Composition: tabs beside a card heading, content below.'),
    ],
    whenToUse: ['Two to five views of the same object: Tweets / Replies / Media.'],
    whenNotToUse: [['Moving between pages', 'Navigation links'], ['Triggering actions', 'Buttons'], ['More than five sections', 'A list — tabs that wrap stop being tabs']],
    anatomy: [['List', 'tablist with an aria-label.'], ['Trigger', 'Pill; ring when unselected, blue fill when selected.'], ['Panel', 'tabpanel labelled by its tab; animated entrance.']],
    states: [['Unselected', 'Ring only, white text with halo.'], ['Selected', 'Blue fill, white text, no halo.'], ['Focus', 'Ring + dark halo.'], ['Forced colours', 'Selected tab gets a Highlight border and an underline — never colour alone.']],
    content: ['One short word per tab. The list must never wrap.'],
    dodont: [
      { do: 'Keep labels to one word.', dont: 'Use tabs to run actions; they switch views.' },
      { do: 'Label the tab list (“Profile sections”).', dont: 'Leave a page with two unlabelled tab lists.' },
    ],
    a11y: ['tablist / tab / tabpanel with aria-controls and aria-selected (Radix).', 'One tab stop for the whole list.', 'Verified in real Chromium: →, ←, Home, End and wrap-around.'],
    keyboard: [
      ['Tab', 'Into the list, onto the selected tab; the next Tab leaves the list', 'Tabs: one tab stop: Tab lands on the selected tab, the next Tab leaves the list'],
      ['→ / ←', 'Next / previous tab, wrapping around', 'Tabs: → / ← move focus and selection; Home / End jump'],
      ['Home / End', 'First / last tab', 'Tabs: → / ← move focus and selection; Home / End jump'],
    ],
    inherits: 'Radix Tabs — Root: value, defaultValue, onValueChange, orientation · Trigger: value, disabled · Content: value, forceMount',
    related: [['/components/button', 'Button', 'When the user is doing something, not looking at something.'], ['/patterns/settings-panel', 'Settings panel', 'Tabs over grouped settings.']],
  },
  {
    name: 'Tag',
    slug: 'tag',
    purpose: 'Labels content with a category, in outlined small caps.',
    importLine: "import { Tag } from 'pane-react';",
    overview: (
      <>
        <p>An outlined small-caps label for categorising content — the “VISUAL ASSET 05” pill from ref 2. The text is written in normal case and uppercased by CSS, so screen readers read words, not letters.</p>
      </>
    ),
    hero: ex('TagBasic', 'The canonical use: a few category tags on a post.'),
    ladder: [
      ex('TagMetaRow', 'Composition: the category line of a trends list.'),
      ex('TextOnImage', 'Composition: on an image, inside the scrim.', true),
    ],
    whenToUse: ['Categories and topics: Trending, Tech, Asset 05.', 'Metadata on media.'],
    whenNotToUse: [['Status that changes (online, failed)', 'Words in the content, announced in a live region'], ['Filters the user toggles', 'Buttons with aria-pressed']],
    anatomy: [['Outline', '1px ring in text.primary.'], ['Label', '11px, caps tracking 0.08em, uppercase via CSS.']],
    content: ['Two words or fewer.'],
    dodont: [
      { do: 'Use it to label.', dont: 'Make it clickable — it has no button semantics.' },
      { do: 'Keep it short.', dont: 'Put a sentence in a tag.' },
    ],
    a11y: ['Plain <span>, no role.', 'Uppercase is presentational, so it is read as words.'],
    inherits: 'HTMLAttributes<HTMLSpanElement>',
    related: [['/components/button', 'Button', 'When the label needs to do something.'], ['/patterns/text-on-images', 'Text on images', 'Tag on a photo.']],
  },
];
