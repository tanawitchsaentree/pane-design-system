// Avatar's Usage tab (component-depth.md U1–U14). Who something belongs to: a photo or initials.
import { Avatar, Button, Card, Stack } from 'pane-react';
import type { Depth } from './types';

const OnCard = ({ children }: { children: React.ReactNode }) => <Card as="div" className="demo-card">{children}</Card>;
const Byline = ({ size = 'sm' as 'sm' | 'md' | 'lg', name = 'Mara Lind' }) => (
  <Stack direction="row" gap="md" align="center"><Avatar name={name} size={size} decorative /><b>{name}</b></Stack>
);

export const AVATAR: Depth = {
  overview: (
    <>
      <p>An avatar shows who something belongs to, such as the author of a post, a person in a list or the owner of a profile. It is a circle holding a photo, or the initials of the name when there is no photo or it fails to load.</p>
      <p>The name does the real work. When the name is written next to the avatar, the avatar is decorative and hidden from screen readers, so nobody hears the name twice. When the avatar stands alone, it becomes an image named after the person. The <code>decorative</code> prop switches between the two.</p>
      <p>Avatars are not buttons. If tapping one opens a profile, wrap it with the name in a link, so the target is the whole byline and has a text name.</p>
    </>
  ),
  whenToUse: ['The author beside a post or comment.', 'People in a list, such as followers or members.', 'The large portrait at the top of a profile.'],
  whenNot: [
    { situation: 'A generic person glyph with no identity', to: '/foundations/icons', label: 'An icon' },
    { situation: 'A product or place picture', to: '/components/card', label: 'CardCover or an image with alt text' },
    { situation: 'An avatar that opens the profile on its own', to: '/foundations/typography', label: 'A link around avatar and name' },
  ],
  variants: { na: 'Avatar has no variant prop. Photo and initials are the same avatar with and without a source.' },
  anatomy: {
    render: <OnCard><Avatar name="Mara Lind" size="lg" /></OnCard>,
    parts: [
      { part: 'Circle', selector: '[data-component="Avatar"]', what: 'A full circle that clips the photo or holds the initials.' },
      { part: 'Initials', selector: '[data-component="Avatar"] span', what: 'First letters of the first two words of the name, hidden from screen readers.' },
      { part: 'Rim ring', selector: '[data-component="Avatar"]', what: 'Only at lg, a 4px ring in the rim light, so a portrait reads as an object on the pane (P3).' },
    ],
    perVariant: 'sm and md have no ring. lg adds the rim ring.',
  },
  sizes: {
    sm: { use: '30px. Post and comment headers, where the name sits beside it.', pairs: 'A 15px semibold name.' },
    md: { use: '44px. Rows in a list of people.', pairs: 'A name and a secondary line.' },
    lg: { use: '84px with a rim ring. The portrait at the top of a profile.', pairs: 'A title-size name and a Follow Button.' },
  },
  emphasis: { na: 'Avatars carry identity, never emphasis. Hierarchy comes from the size the layout calls for.' },
  placement: {
    rows: [['Before a name', 'The default. Avatar first, then the name, in a row.'], ['Top of a profile', 'lg, above or beside the name.'], ['In a list row', 'md at the start of each row.']],
    examples: [
      { title: 'Post header', render: <OnCard><Byline /><p className="flush">Blue hour over Bergen harbour.</p></OnCard> },
      { title: 'Profile head', render: <OnCard><Stack direction="row" gap="md" align="center"><Avatar name="Mara Lind" size="lg" decorative /><div><h3 className="flush">Mara Lind</h3><p className="flush muted">Bergen</p></div></Stack><div className="demo-row"><Button>Follow</Button></div></OnCard> },
    ],
  },
  combinations: {
    good: [['Avatar + name', 'The usual byline, with the avatar decorative.'], ['lg Avatar + Follow', 'A profile head with its one action.']],
    avoid: [{ title: 'a labelled avatar beside its name', why: 'A screen reader says the name twice. Set decorative.', render: <OnCard><Stack direction="row" gap="md" align="center"><Avatar name="Mara Lind" size="sm" /><b>Mara Lind</b></Stack></OnCard> }],
  },
  content: {
    formula: <p>Pass the full name the reader knows the person by. The initials come from it, and so does the accessible name when the avatar stands alone. Use a square photo with the face centred, because the circle crops the corners.</p>,
    pair: { do: <OnCard><Byline /></OnCard>, doNote: 'The name beside it, avatar decorative.', dont: <OnCard><Stack direction="row" gap="md" align="center"><Avatar name="ML" size="sm" /></Stack></OnCard>, dontNote: 'Initials passed as the name. The screen reader says M L.' },
    overflow: { text: 'The avatar never changes size with the name. A long name wraps beside it, and the circle stays round.', render: <div data-overflow-demo="" className="overflow-probe"><OnCard><Byline name="Marianne Lindqvist-Haugen" /></OnCard></div> },
    rtl: { text: 'In right-to-left languages the avatar sits to the right of the name. Initials take the first character of each word, which does not suit every script. That is listed under Limitations.', render: <div dir="rtl" lang="ar"><OnCard><Stack direction="row" gap="md" align="center"><Avatar name="Mara Lind" size="sm" decorative /><b>مارا ليند</b></Stack></OnCard></div> },
    expansion: { text: 'Longer names wrap next to the avatar without moving it.', render: <OnCard><Byline name="Mara Lind-Østergaard" /></OnCard> },
  },
  behaviours: {
    states: [['Photo', 'The image fills the circle.', 'Identity first.'], ['No photo', 'Initials on the quiet fill.', 'Still says who it is.'], ['Forced colours', 'No rule of its own yet. Initials keep their text and a photo shows as it is, but the circle loses its edge.', 'A gap against P6, listed under Limitations.']],
    interactions: [['Screen reader', 'Read', 'Skipped when decorative, otherwise read as an image named after the person.', 'Avatar: non-decorative avatars are role="img" named after the person'], ['Keyboard', 'Tab', 'Skips it. An avatar is not focusable.', 'Avatar.tsx renders a span']],
    loading: <p>Show the initials while the photo loads. They take the same space, so nothing moves when the photo arrives.</p>,
    focus: <p>An avatar never takes focus. Make the link around it focusable instead.</p>,
  },
  deepDive: { na: 'Avatar has no variant prop. Its sizes are covered in the size table.' },
  modifiers: [
    { name: 'Decorative', rules: <p>Set <code>decorative</code> whenever the name is written next to the avatar. Leave it off when the avatar stands alone, such as in a stack of faces.</p>, pair: { do: <OnCard><Byline /></OnCard>, doNote: 'Decorative beside its name.', dont: <OnCard><Stack direction="row" gap="sm"><Avatar name="Ada Park" size="sm" decorative /><Avatar name="Jonas Berg" size="sm" decorative /></Stack></OnCard>, dontNote: 'A stack of faces hidden from screen readers. Nobody hears who is there.' } },
    { name: 'Photo', rules: <p>Pass <code>src</code> for a photo. If it fails, the initials show instead. The image has an empty alt, because the avatar carries the name.</p>, pair: { do: <OnCard><Avatar name="Mara Lind" size="md" /></OnCard>, doNote: 'Initials until a photo is set.', dont: <OnCard><Avatar name="User" size="md" /></OnCard>, dontNote: 'A placeholder name. Everyone is announced as User and shows the same U.' } },
  ],
  related: [['/components/card', 'Card', 'Where avatars sit.'], ['/patterns/profile-card', 'Profile card', 'A full profile head.']],
  references: [
    { title: 'WAI · Images tutorial, decorative images', url: 'https://www.w3.org/WAI/tutorials/images/decorative/', why: 'When an avatar should be hidden from screen readers.' },
    { title: 'Apple Human Interface Guidelines · Images', url: 'https://developer.apple.com/design/human-interface-guidelines/images', why: 'Pane’s lineage for portraits on glass.' },
  ],
};
