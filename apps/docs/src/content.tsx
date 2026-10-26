// Per-component docs content. tooling/conformance.mjs checks every listed prop against the
// component's TS source (entries starting with "…" are pass-through groups and are skipped), so this
// file can't silently drift from the code.
import type { ReactNode } from 'react';
import { Avatar, Button, Card, CardCover, Environment, IconButton, Tabs, Tag } from 'pane-react';
import { IconMore, IconPencil, IconShare } from './icons';

export interface PropDoc { name: string; type: string; default?: string; description: string }
export interface ComponentDoc {
  name: string;
  summary: string;
  /** harness data-group keys whose measurements belong to this component */
  groups: string[];
  demo: () => ReactNode;
  props: PropDoc[];
  keyboard?: Array<[string, string]>;
  a11y: string[];
  do: string;
  dont: string;
}

export const COMPONENTS: ComponentDoc[] = [
  {
    name: 'Environment',
    summary:
      'Declares how bright the world behind the glass is. Glass inside dims the backdrop accordingly so white text keeps 4.5:1 — the visionOS idea, made explicit because a web page cannot read the pixels behind it. Today all three levels share the one measured value (0.36); dim and mid need a genuinely dark photo to calibrate.',
    groups: ['environment'],
    demo: () => (
      <div className="env-demo">
        {/* each value on the kind of scene it is for — a dim card on a bright scene is misuse */}
        {([['dim', 'room'], ['mid', 'forest'], ['bright', 'city']] as const).map(([b, tile]) => (
          <div key={b} className="env-tile" data-tile={tile}>
            <Environment brightness={b}>
              <Card as="div"><p className="flush"><b>{b}</b></p><p className="flush muted">For scenes like {tile}.</p></Card>
            </Environment>
          </div>
        ))}
      </div>
    ),
    props: [
      { name: 'brightness', type: "'dim' | 'mid' | 'bright'", default: "'bright'", description: 'Brightness of the brightest spot a card can land on — not the scene average.' },
      { name: '…div attributes', type: 'HTMLAttributes<HTMLDivElement>', description: 'Rendered as a <div data-environment>.' },
    ],
    a11y: ['No semantics of its own. Without it, glass uses the bright setting — the safe end.'],
    do: 'Set it once per scene, sized for the scene’s brightest region.',
    dont: 'Pick a darker setting because the scene is “mostly dark” — a card that lands on its one bright spot fails.',
  },
  {
    name: 'Card',
    summary: 'The pane: clear glass that blurs and dims the scene behind it (colour and detail stay visible), a specular rim instead of a border, a soft float shadow. The inset variant nests content inside a pane without stacking a second glass layer.',
    groups: ['card'],
    demo: () => (
      <Card as="div" className="demo-card">
        <CardCover />
        <p className="flush"><b>Glass card</b></p>
        <p className="flush muted">Cover, text and a nested inset section.</p>
        <Card variant="inset" as="div"><p className="flush muted">Inset content sits on the same pane, under a divider.</p></Card>
      </Card>
    ),
    props: [
      { name: 'variant', type: "'glass' | 'inset'", default: "'glass'", description: 'Floating pane, or content nested inside one.' },
      { name: 'as', type: "'article' | 'section' | 'div'", default: "'article'", description: 'Rendered element.' },
      { name: 'src', type: 'string', description: 'CardCover only — image URL; omitted = gradient placeholder.' },
      { name: '…element attributes', type: 'HTMLAttributes<HTMLElement>', description: 'Passed through.' },
    ],
    a11y: [
      'Renders a real <article>/<section> — give a section a heading.',
      'In forced-colours mode the rim becomes a solid CanvasText border; with reduced transparency the glass turns opaque.',
    ],
    do: 'Put every piece of text on a Card.',
    dont: 'Stack a second glass Card inside one — use variant="inset"; double blur muddies the text behind it.',
  },
  {
    name: 'Avatar',
    summary: 'Round portrait with initials fallback. The large size carries the rim-coloured ring from the anchor card.',
    groups: ['card'],
    demo: () => (
      <div className="demo-row">
        <Avatar name="Max Fmz" size="lg" />
        <Avatar name="Visual Flow" size="md" />
        <Avatar name="Ada Lovelace" size="sm" />
      </div>
    ),
    props: [
      { name: 'name', type: 'string', description: 'Required — accessible name and source of the initials.' },
      { name: 'src', type: 'string', description: 'Photo URL; omitted = initials.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '30 / 44 / 84px.' },
      { name: 'decorative', type: 'boolean', default: 'false', description: 'Hide from screen readers when the name is printed right beside it.' },
    ],
    a11y: ['role="img" + aria-label from name, or aria-hidden when decorative — never both.'],
    do: 'Mark it decorative next to a visible name, as in the anchor card.',
    dont: 'Leave a decorative avatar announced — readers hear “Max Fmz, Max Fmz”.',
  },
  {
    name: 'Button',
    summary: 'Pill buttons. Light is the solid white action from the anchor (“Follow”); accent is the blue; glass is a quiet fill for secondary actions.',
    groups: ['controls'],
    demo: () => (
      <Card as="div" className="demo-card">
        <div className="demo-row">
          <Button>Follow</Button>
          <Button variant="accent">Get verified</Button>
          <Button variant="glass">Message</Button>
          <Button size="sm" variant="glass">Small</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Card>
    ),
    props: [
      { name: 'variant', type: "'light' | 'accent' | 'glass'", default: "'light'", description: 'Solid white, blue, or quiet glass fill.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '32 / 44px tall.' },
      { name: '…button attributes', type: 'ButtonHTMLAttributes', description: 'Native <button>, type defaults to "button".' },
    ],
    keyboard: [['Tab', 'Moves focus to the button'], ['Enter / Space', 'Activates it']],
    a11y: ['Native <button>.', 'Focus: 2px white ring with a dark halo, visible on light and dark glass alike.'],
    do: 'One light button per card, for the action the card exists for.',
    dont: 'Use accent and light side by side for equal actions — two loud buttons cancel out.',
  },
  {
    name: 'IconButton',
    summary: 'Round icon-only button: a frosted disc (edit, close) or a bare icon for dense rows (more, share).',
    groups: ['controls'],
    demo: () => (
      <Card as="div" className="demo-card">
        <div className="demo-row">
          <IconButton aria-label="Edit profile"><IconPencil /></IconButton>
          <IconButton variant="ghost" aria-label="More options"><IconMore /></IconButton>
          <IconButton variant="ghost" size="sm" aria-label="Share"><IconShare /></IconButton>
        </div>
      </Card>
    ),
    props: [
      { name: 'aria-label', type: 'string', description: 'Required by the type — the button’s only name.' },
      { name: 'variant', type: "'glass' | 'ghost'", default: "'glass'", description: 'Frosted disc, or icon only.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '32 / 36px.' },
    ],
    keyboard: [['Tab', 'Moves focus to it'], ['Enter / Space', 'Activates it']],
    a11y: ['aria-label is required at the type level, so an unnamed icon button does not compile.'],
    do: 'Name the action, not the icon: “Edit profile”, not “Pencil”.',
    dont: 'Put an icon-only button where the action isn’t obvious from context.',
  },
  {
    name: 'Tabs',
    summary: 'Pill tabs from the anchor card. Selected = blue pill; the others keep only a ring, because a white fill lifted the backdrop under white text.',
    groups: ['controls'],
    demo: () => (
      <Card as="div" className="demo-card">
        <Tabs.Root defaultValue="a">
          <Tabs.List aria-label="Demo sections">
            <Tabs.Trigger value="a">Tweets</Tabs.Trigger>
            <Tabs.Trigger value="b">Replies</Tabs.Trigger>
            <Tabs.Trigger value="c">Media</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="a"><p className="flush muted tab-empty">Tweets panel.</p></Tabs.Content>
          <Tabs.Content value="b"><p className="flush muted tab-empty">Replies panel.</p></Tabs.Content>
          <Tabs.Content value="c"><p className="flush muted tab-empty">Media panel.</p></Tabs.Content>
        </Tabs.Root>
      </Card>
    ),
    props: [
      { name: '…Radix Tabs props', type: 'Root: value / defaultValue / onValueChange · Trigger: value · Content: value', description: 'Behaviour is Radix’s (roving tabindex, arrow keys); Pane adds the look only.' },
    ],
    keyboard: [['Tab', 'Into the tab list (selected tab), then to the panel'], ['← / →', 'Previous / next tab'], ['Home / End', 'First / last tab']],
    a11y: ['tablist / tab / tabpanel roles with aria-controls and aria-selected, from Radix.', 'Forced colours: selected tab gets a Highlight border and an underline.'],
    do: 'Keep labels to one short word each — the row must not wrap.',
    dont: 'Use tabs to switch between actions; they switch views.',
  },
  {
    name: 'Tag',
    summary: 'Outlined small-caps label for categorising content — the “VISUAL ASSET 05” pill from ref 2.',
    groups: ['controls', 'media'],
    demo: () => (
      <Card as="div" className="demo-card">
        <div className="demo-row"><Tag>Visual asset 05</Tag><Tag>Trending</Tag><Tag>Tech</Tag></div>
      </Card>
    ),
    props: [{ name: '…span attributes', type: 'HTMLAttributes<HTMLSpanElement>', description: 'Rendered as a <span>.' }],
    a11y: ['Plain text, no role. Not for status — status needs words a screen reader can act on.'],
    do: 'Two words or fewer.',
    dont: 'Make it clickable — it has no button semantics.',
  },
];
