// The state matrix, second half: navigation, selection, overlays, feedback, identity, surfaces, type,
// data, charts and patterns (wave V0). Same rules as the first half in states.tsx: each row starts with
// the default, each cell is a real state the component already has, and G-SV1 measures every cell.
import type { ReactNode } from 'react';
import {
  Accordion, ActionSheet, AspectRatio, AuthForm, Avatar, Badge, Banner, BottomNav, Breadcrumb, Button, Calendar, Card, CoachMark,
  CommandPalette, DescriptionList, Dialog, Divider, Drawer, EmptyState, Feed, Fieldset, Form, FormField, Heading, HelperText, Icon, Image, Input,
  InputGroup, KanbanBoard, Label, LineChart, Link, List, ListItem, Mesh, Meter, Navbar, NotificationCenter, Pagination, Popover, Progress,
  Sheet, Sidebar, Skeleton, Snackbar, Sparkline, Spinner, Stat, Stepper, TableOfContents, Tabs, Text, Timeline, Toast,
  Tooltip, TransferList, TreeView,
} from 'pane-react';
import type { StateRow } from './states';
import { IconHome, IconSearch, IconUser, IconInbox, IconMore } from '../icons';

const noop = () => {};
const OPTS = [{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }, { value: 'vik', label: 'Vík' }];
const TABS = (o: { vertical?: boolean; off?: boolean } = {}) => (
  <Tabs.Root defaultValue="prints" orientation={o.vertical ? 'vertical' : 'horizontal'}>
    <Tabs.List aria-label="Shop">
      <Tabs.Trigger value="prints">Prints</Tabs.Trigger>
      <Tabs.Trigger value="frames">Frames</Tabs.Trigger>
      <Tabs.Trigger value="cards" disabled={o.off}>Cards</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="prints"><Text size="label" tone="secondary">Twelve prints</Text></Tabs.Content>
    <Tabs.Content value="frames"><Text size="label" tone="secondary">Oak and black</Text></Tabs.Content>
    <Tabs.Content value="cards"><Text size="label" tone="secondary">Sold out</Text></Tabs.Content>
  </Tabs.Root>
);
const NAV = [{ href: '#prints', label: 'Prints' }, { href: '#journal', label: 'Journal' }];
const SIDE = (badge?: string) => [{ title: 'Shop', items: [{ href: '#orders', label: 'Orders', badge }, { href: '#prints', label: 'Prints' }] }];
const DOCK = (badge?: number) => [{ href: '#home', label: 'Home', icon: <IconHome /> }, { href: '#search', label: 'Search', icon: <IconSearch /> }, { href: '#inbox', label: 'Inbox', icon: <IconInbox />, badge }, { href: '#me', label: 'Profile', icon: <IconUser /> }];
const CRUMBS = [{ href: '#shop', label: 'Shop' }, { href: '#prints', label: 'Prints' }, { href: '#lofoten', label: 'Lofoten, March' }];
const STEPS = [{ label: 'Cart' }, { label: 'Address' }, { label: 'Pay' }];
const FAQ = (o: { open?: boolean; off?: boolean } = {}) => <Accordion type="single" defaultValue={o.open ? 'ship' : undefined} items={[{ value: 'ship', title: 'Delivery', content: <Text tone="secondary">Three working days.</Text> }, { value: 'paper', title: 'Paper', content: <Text tone="secondary">Cotton rag.</Text>, disabled: o.off }]} />;
const TOC = (deep?: boolean) => [{ id: 'size', label: 'Size' }, ...(deep ? [{ id: 'size-a3', label: 'A3', level: 3 as const }] : []), { id: 'paper', label: 'Paper' }];
const SWAP = (value?: string[]) => <TransferList labels={['Hidden', 'Shown']} options={OPTS} defaultValue={value} />;
const TL = (state?: 'current' | 'upcoming') => <Timeline label="Order 118" items={[{ time: '09:12', title: 'Ordered' }, { time: '11:40', title: 'Printed', state }]} />;
const TREE = [{ id: 'prints', label: 'Prints', children: [{ id: 'lofoten', label: 'Lofoten, March' }, { id: 'senja', label: 'Senja at night' }] }];
const NOTES = (unread?: boolean) => [{ id: '1', title: 'Mara commented on Lofoten', time: '2 min ago', unread }, { id: '2', title: 'Order 118 shipped', time: '1 h ago' }];
const CMDS = [{ id: 'new', label: 'New print', group: 'Prints', onSelect: noop }, { id: 'find', label: 'Find an order', group: 'Orders', onSelect: noop }];
const COLS = (empty?: boolean) => [{ id: 'todo', title: 'To print', cards: empty ? [] : [{ id: 'a', title: 'Lofoten, March' }] }, { id: 'done', title: 'Shipped', cards: [{ id: 'b', title: 'Senja at night' }] }];
const POSTS = [{ id: 1, t: 'Mara posted Lofoten, March' }, { id: 2, t: 'Ola posted Senja at night' }];
const FEED = (o: { loading?: boolean; end?: boolean } = {}) => <Feed label="Latest" items={POSTS} getKey={(x) => x.id} getLabel={(x) => x.t} renderItem={(x) => <Card as="div" className="demo-card"><Text>{x.t}</Text></Card>} loading={o.loading} hasMore={!o.end} onLoadMore={noop} />;
const PTS = ['W40', 'W41', 'W42', 'W43'];
const PHOTO = '/scenes/city-sm.jpg';
const ME = <Avatar name="Mara Lind" />;
const day = (d: number) => new Date(2026, 10, d);

export const MORE_ROWS: StateRow[] = [
  // Navigation
  { component: 'Tabs', family: 'Navigation', cells: [['default', TABS()], ['vertical', TABS({ vertical: true })], ['disabled tab', TABS({ off: true })]] },
  { component: 'Navbar', family: 'Navigation', cells: [['default', <Navbar sticky={false} brand={<Text weight="semibold">North Light</Text>} links={NAV} />], ['current page', <Navbar sticky={false} brand={<Text weight="semibold">North Light</Text>} links={NAV} current="#journal" />]] },
  { component: 'Sidebar', family: 'Navigation', cells: [['default', <Sidebar label="Shop" sections={SIDE()} current="#prints" />], ['with a count', <Sidebar label="Shop" sections={SIDE('3')} current="#prints" />]] },
  { component: 'BottomNav', family: 'Navigation', cells: [['default', <BottomNav position="contained" label="Main" items={DOCK()} current="#home" onNavigate={(_, e) => e.preventDefault()} />], ['another page', <BottomNav position="contained" label="Main" items={DOCK()} current="#inbox" onNavigate={(_, e) => e.preventDefault()} />], ['with a count', <BottomNav position="contained" label="Main" items={DOCK(3)} current="#home" onNavigate={(_, e) => e.preventDefault()} />]] },
  { component: 'Breadcrumb', family: 'Navigation', cells: [['default', <Breadcrumb items={CRUMBS} />], ['one level up', <Breadcrumb items={CRUMBS.slice(0, 2)} />]] },
  { component: 'Pagination', family: 'Navigation', cells: [['default', <Pagination page={1} total={8} onPageChange={noop} />], ['middle page', <Pagination page={4} total={8} onPageChange={noop} />], ['last page', <Pagination page={8} total={8} onPageChange={noop} />]] },
  { component: 'Stepper', family: 'Navigation', cells: [['default', <Stepper label="Checkout" steps={STEPS} current={0} />], ['middle step', <Stepper label="Checkout" steps={STEPS} current={1} />], ['all done', <Stepper label="Checkout" steps={STEPS} current={3} />], ['vertical', <Stepper label="Checkout" steps={STEPS} current={1} orientation="vertical" />]] },
  { component: 'Accordion', family: 'Navigation', cells: [['default', FAQ()], ['open', FAQ({ open: true })], ['disabled item', FAQ({ off: true })]] },
  { component: 'TableOfContents', family: 'Navigation', cells: [['default', <TableOfContents items={TOC()} />], ['nested', <TableOfContents items={TOC(true)} />]] },
  // Selection
  { component: 'TransferList', family: 'Selection', cells: [['default', SWAP()], ['some shown', SWAP(['senja'])], ['all shown', SWAP(['lofoten', 'senja', 'vik'])]] },
  // Overlays: closed is the trigger alone; open is the preview drawn in place
  { component: 'Dialog', family: 'Overlays', cells: [['default', <Dialog trigger={<Button variant="glass">Discard</Button>} title="Discard this draft?" actions={<Button>Discard</Button>} />], ['open', <Dialog preview title="Discard this draft?" description="Your changes will be lost." actions={<Button>Discard</Button>} />], ['open, large', <Dialog preview size="lg" title="Discard this draft?" description="Your changes will be lost." actions={<Button>Discard</Button>} />]] },
  { component: 'Sheet', family: 'Overlays', cells: [['default', <Sheet trigger={<Button variant="glass">Share</Button>} title="Share trip" />], ['open', <Sheet preview title="Share trip" actions={<Button>Copy link</Button>}><Text tone="secondary">Anyone with the link can see it.</Text></Sheet>]] },
  { component: 'Drawer', family: 'Overlays', cells: [['default', <Drawer trigger={<Button variant="glass">Filters</Button>} title="Filters" />], ['open', <Drawer preview title="Filters"><Text tone="secondary">Size, paper and price.</Text></Drawer>]] },
  { component: 'ActionSheet', family: 'Overlays', cells: [['default', <ActionSheet trigger={<Button variant="glass">Photo</Button>} title="Morning fog" actions={[{ label: 'Share', onSelect: noop }]} />], ['open', <ActionSheet preview title="Morning fog" actions={[{ label: 'Share', onSelect: noop }, { label: 'Delete', onSelect: noop, tone: 'critical' }]} />]] },
  { component: 'Popover', family: 'Overlays', cells: [['default', <Popover trigger={<Button variant="glass">Details</Button>} title="Paper">Cotton rag, 308 g.</Popover>], ['open', <Popover preview trigger={<Button variant="glass">Details</Button>} title="Paper">Cotton rag, 308 g.</Popover>]] },
  { component: 'Tooltip', family: 'Overlays', cells: [['default', <Tooltip content="Share"><Button variant="glass">Share</Button></Tooltip>], ['open', <Tooltip preview content="Share"><Button variant="glass">Share</Button></Tooltip>]] },
  { component: 'CoachMark', family: 'Overlays', cells: [['default', <CoachMark open={false} title="Share an album" description="Anyone with the link can see it." step={1} total={3} onNext={noop} onSkip={noop}><Button variant="glass">Share</Button></CoachMark>], ['open', <CoachMark preview open title="Share an album" description="Anyone with the link can see it." step={1} total={3} onNext={noop} onSkip={noop}><Button variant="glass">Share</Button></CoachMark>], ['last step', <CoachMark preview open title="Share an album" description="Anyone with the link can see it." step={3} total={3} onNext={noop} onSkip={noop}><Button variant="glass">Share</Button></CoachMark>]] },
  // Feedback
  { component: 'Toast', family: 'Feedback', cells: [['default', <Toast preview open onOpenChange={noop} title="Print ordered" />], ['positive', <Toast preview open onOpenChange={noop} tone="positive" title="Print shipped" />], ['critical', <Toast preview open onOpenChange={noop} tone="critical" title="Payment failed" />], ['with an action', <Toast preview open onOpenChange={noop} title="Print removed" action={{ label: 'Undo', altText: 'Undo from the cart', onClick: noop }} />]] },
  { component: 'Snackbar', family: 'Feedback', cells: [['default', <Snackbar preview open onOpenChange={noop} message="Saved" />], ['with an action', <Snackbar preview open onOpenChange={noop} message="Print removed" action={{ label: 'Undo', altText: 'Undo from the cart', onClick: noop }} />]] },
  { component: 'Banner', family: 'Feedback', cells: [['default', <Banner title="Prints ship on Mondays" />], ['positive', <Banner tone="positive" title="Your shop is live" />], ['warning', <Banner tone="warning" title="Two prints are low on stock" />], ['critical', <Banner tone="critical" title="Payments are off" />], ['dismissible', <Banner title="Prints ship on Mondays" onDismiss={noop} />]] },
  { component: 'Spinner', family: 'Feedback', cells: [['default', <Spinner label="Loading" />], ['small', <Spinner size="sm" label="Loading" />]] },
  { component: 'Skeleton', family: 'Feedback', cells: [['default', <Skeleton />], ['three lines', <Skeleton lines={3} />], ['block', <AspectRatio ratio="photo" className="demo-media"><Skeleton shape="block" /></AspectRatio>], ['circle', <Skeleton shape="circle" />]] },
  { component: 'Progress', family: 'Feedback', cells: [['default', <Progress label="Upload" value={40} />], ['unknown length', <Progress label="Upload" />], ['with its value', <Progress label="Upload" value={40} showValue />], ['complete', <Progress label="Upload" value={100} showValue />], ['small', <Progress label="Upload" value={40} size="sm" />]] },
  { component: 'Meter', family: 'Feedback', cells: [['default', <Meter label="Storage" value={30} high={70} critical={90} />], ['high', <Meter label="Storage" value={78} high={70} critical={90} />], ['critical', <Meter label="Storage" value={95} high={70} critical={90} />]] },
  // Identity
  { component: 'Avatar', family: 'Identity', cells: [['default', ME], ['small', <Avatar name="Mara Lind" size="sm" />], ['large', <Avatar name="Mara Lind" size="lg" />], ['photo', <Avatar name="Mara Lind" src={PHOTO} />]] },
  { component: 'Badge', family: 'Identity', cells: [['default', <Badge>Draft</Badge>], ['with a dot', <Badge dot>Draft</Badge>], ['info', <Badge tone="info">New</Badge>], ['positive', <Badge tone="positive">Paid</Badge>], ['warning', <Badge tone="warning">Low stock</Badge>], ['critical', <Badge tone="critical">Failed</Badge>]] },
  // Surfaces
  { component: 'Card', family: 'Surfaces', cells: [['default', <Card as="div" className="demo-card"><Text>Lofoten, March</Text></Card>], ['inset', <Card as="div" variant="inset" className="demo-card"><Text>Lofoten, March</Text></Card>]] },
  { component: 'Image', family: 'Surfaces', cells: [['default', <AspectRatio ratio="photo" className="demo-media"><Image src={PHOTO} alt="Houses on a canal" /></AspectRatio>], ['contain', <AspectRatio ratio="square" className="demo-media"><Image src={PHOTO} alt="Houses on a canal" fit="contain" /></AspectRatio>], ['inner corner', <AspectRatio ratio="photo" className="demo-media"><Image src={PHOTO} alt="Houses on a canal" radius="inner" /></AspectRatio>], ['failed', <AspectRatio ratio="photo" className="demo-media"><Image src="/missing.jpg" alt="Houses on a canal" /></AspectRatio>]] },
  { component: 'Mesh', family: 'Surfaces', cells: [['default', <AspectRatio ratio="square" className="demo-media"><Mesh /></AspectRatio>], ['ember', <AspectRatio ratio="square" className="demo-media"><Mesh preset="ember" /></AspectRatio>], ['tide', <AspectRatio ratio="square" className="demo-media"><Mesh preset="tide" /></AspectRatio>]] },
  { component: 'Divider', family: 'Surfaces', cells: [['default', <div className="demo-wide"><Divider /></div>], ['inset', <div className="demo-wide"><Divider inset /></div>], ['vertical', <div className="demo-row"><Text>Prints</Text><Divider orientation="vertical" /><Text>Frames</Text></div>]] },
  // Type
  { component: 'Text', family: 'Type', cells: [['default', <Text>Lofoten, March</Text>], ['secondary', <Text tone="secondary">Lofoten, March</Text>], ['semibold', <Text weight="semibold">Lofoten, March</Text>], ['caption', <Text size="caption">Lofoten, March</Text>], ['truncated', <div className="demo-narrow"><Text truncate>Lofoten in March, from the bridge at Reine before sunrise</Text></div>]] },
  { component: 'Heading', family: 'Type', cells: [['default', <Heading level={3}>Lofoten</Heading>], ['display', <Heading level={3} size="display">Lofoten</Heading>], ['headline', <Heading level={3} size="headline">Lofoten</Heading>], ['emphasis', <Heading level={3} size="emphasis">Lofoten</Heading>]] },
  { component: 'Link', family: 'Type', cells: [['default', <Text>See the <Link href="#paper">paper guide</Link></Text>], ['standalone', <Link href="#paper" variant="standalone">Paper guide</Link>], ['external', <Link href="https://example.com" external>Printer</Link>]] },
  { component: 'Icon', family: 'Type', cells: [['default', <Icon label="More"><IconMore /></Icon>], ['small', <Icon size="sm" label="More"><IconMore /></Icon>]] },
  // Fields (the parts every field is made of)
  { component: 'Label', family: 'Fields', cells: [['default', <Label>Shop name</Label>], ['for a field that must be filled', <Label required>Shop name</Label>]] },
  { component: 'HelperText', family: 'Fields', cells: [['default', <HelperText>Up to 40 letters</HelperText>], ['error', <HelperText tone="error">Enter a name</HelperText>]] },
  { component: 'Fieldset', family: 'Fields', cells: [['default', <Fieldset legend="Delivery"><FormField label="Street"><Input /></FormField></Fieldset>], ['with help', <Fieldset legend="Delivery" help="Where the print is sent."><FormField label="Street"><Input /></FormField></Fieldset>]] },
  { component: 'InputGroup', family: 'Fields', cells: [['default', <FormField label="Price"><InputGroup><Input defaultValue="120" /></InputGroup></FormField>], ['with an end', <FormField label="Price"><InputGroup end={<Text tone="secondary">NOK</Text>}><Input defaultValue="120" /></InputGroup></FormField>], ['with a start', <FormField label="Find"><InputGroup start={<IconSearch />}><Input /></InputGroup></FormField>]] },
  { component: 'Calendar', family: 'Fields', cells: [['default', <Calendar label="Delivery day" defaultMonth={day(1)} />], ['a day chosen', <Calendar label="Delivery day" defaultMonth={day(1)} defaultValue={day(12)} />], ['a range', <Calendar label="Trip" mode="range" defaultMonth={day(1)} defaultValue={{ start: day(10), end: day(14) }} />], ['days out of reach', <Calendar label="Delivery day" defaultMonth={day(1)} min={day(9)} max={day(20)} />]] },
  // Data
  { component: 'Stat', family: 'Data', cells: [['default', <Stat label="Prints sold" value="1,204" />], ['up', <Stat label="Prints sold" value="1,204" change="+12%" direction="up" sentiment="positive" />], ['down', <Stat label="Returns" value="18" change="−4%" direction="down" sentiment="positive" />], ['flat', <Stat label="Prints sold" value="1,204" change="0%" direction="flat" />]] },
  { component: 'List', family: 'Data', cells: [['default', <List label="Settings"><ListItem title="Shop name" trailing="North Light" /><ListItem title="Payments" /></List>], ['plain', <List label="Settings" variant="plain"><ListItem title="Shop name" trailing="North Light" /><ListItem title="Payments" /></List>], ['with a chevron', <List label="Settings"><ListItem title="Shop name" href="#name" chevron /><ListItem title="Payments" href="#pay" chevron /></List>]] },
  { component: 'Timeline', family: 'Data', cells: [['default', TL()], ['current', TL('current')], ['upcoming', TL('upcoming')]] },
  { component: 'EmptyState', family: 'Data', cells: [['default', <EmptyState title="No prints yet" description="Add your first print." />], ['small', <EmptyState size="sm" title="No prints yet" />], ['with an action', <EmptyState title="No prints yet" actions={<Button>Add a print</Button>} />]] },
  { component: 'TreeView', family: 'Data', cells: [['default', <TreeView label="Folders" nodes={TREE} />], ['expanded', <TreeView label="Folders" nodes={TREE} defaultExpanded={['prints']} />], ['selected', <TreeView label="Folders" nodes={TREE} defaultExpanded={['prints']} defaultValue="senja" />]] },
  { component: 'DescriptionList', family: 'Data', cells: [['default', <DescriptionList items={[{ term: 'Paper', detail: 'Cotton rag' }, { term: 'Size', detail: '40 × 50' }]} />], ['inline', <div className="demo-wide"><DescriptionList layout="inline" items={[{ term: 'Paper', detail: 'Cotton rag' }, { term: 'Size', detail: '40 × 50' }]} /></div>], ['with dividers', <DescriptionList dividers items={[{ term: 'Paper', detail: 'Cotton rag' }, { term: 'Size', detail: '40 × 50' }]} />]] },
  // Charts
  { component: 'LineChart', family: 'Charts', cells: [['default', <LineChart label="Orders" blockSize={160} points={PTS} series={[{ name: 'Oslo', values: [40, 52, 48, 61] }]} />], ['area', <LineChart label="Orders" blockSize={160} area points={PTS} series={[{ name: 'Oslo', values: [40, 52, 48, 61] }]} />], ['two series', <LineChart label="Orders" blockSize={160} points={PTS} series={[{ name: 'Oslo', values: [40, 52, 48, 61] }, { name: 'Bergen', values: [22, 30, 35, 33] }]} />]] },
  { component: 'Sparkline', family: 'Charts', cells: [['default', <Sparkline label="Orders this month" values={[4, 6, 5, 8, 7, 9]} />], ['without the last value', <Sparkline label="Orders this month" values={[4, 6, 5, 8, 7, 9]} showLast={false} />]] },
  // Patterns
  { component: 'AuthForm', family: 'Patterns', cells: [['default', <AuthForm onSubmit={noop} />], ['sign up', <AuthForm mode="sign-up" onSubmit={noop} />], ['reset', <AuthForm mode="reset" onSubmit={noop} />], ['pending', <AuthForm onSubmit={noop} pending />], ['wrong password', <AuthForm onSubmit={noop} errors={{ password: 'That password does not match' }} />]] },
  { component: 'Form', family: 'Patterns', cells: [['default', <Form onSubmit={noop} actions={<Button type="submit">Save</Button>}><FormField id="st-shop" label="Shop name"><Input /></FormField></Form>], ['with errors', <Form onSubmit={noop} errors={[{ field: 'st-shop2', message: 'Enter a shop name' }]} actions={<Button type="submit">Save</Button>}><FormField id="st-shop2" label="Shop name" error="Enter a shop name"><Input /></FormField></Form>]] },
  { component: 'CommandPalette', family: 'Patterns', cells: [['default', <CommandPalette preview commands={CMDS} />], ['nothing found', <CommandPalette preview commands={[]} />]] },
  { component: 'NotificationCenter', family: 'Patterns', cells: [['default', <NotificationCenter preview notices={NOTES()} />], ['unread', <NotificationCenter preview notices={NOTES(true)} />], ['empty', <NotificationCenter preview notices={[]} />]] },
  { component: 'KanbanBoard', family: 'Patterns', cells: [['default', <KanbanBoard label="Print queue" columns={COLS()} onChange={noop} />], ['an empty column', <KanbanBoard label="Print queue" columns={COLS(true)} onChange={noop} />]] },
  { component: 'Feed', family: 'Patterns', cells: [['default', FEED()], ['loading', FEED({ loading: true })], ['the end', FEED({ end: true })]] },
];

export const MORE_FAMILIES = ['Navigation', 'Selection', 'Overlays', 'Feedback', 'Identity', 'Surfaces', 'Type', 'Data', 'Charts', 'Patterns'];
export const MORE_TEXT: Record<string, string> = {
  Navigation: 'Where the reader is shows by chosen glass and aria-current as well as tone. A step or page passed reads as done, the current one is lit, and a tab or item that cannot be chosen is dimmed and skipped by the keys.',
  Selection: 'Moving items between lists keeps both lists in place, and each list says how many it holds.',
  Overlays: 'Each overlay starts closed, as its trigger alone, and is shown open the way its preview draws it in place. Open, it is a level-3 or level-4 pane above the page.',
  Feedback: 'A status always has a glyph shape and a word as well as its mark colour. Progress of unknown length moves without a value, and a meter past its high or critical mark says so in words.',
  Identity: 'Initials stand in for a photo, and a badge says its tone with a glyph and its word.',
  Surfaces: 'A card can be glass or inset. An image keeps its frame when it fails, and a divider can run inset or upright.',
  Type: 'Tone, weight and size change the look of words. Truncation keeps one line, and the full text stays in the page for a screen reader.',
  Data: 'Numbers and lists say what changed and where the reader is. A rise or fall has an arrow and a word, the current step is lit and a chosen row has chosen glass.',
  Charts: 'Every chart keeps its table view in every state. Area and extra series change the marks while the words keep their text tones.',
  Patterns: 'A pattern carries the states of its parts. Pending forms keep their place and say they are busy, errors are listed in words and an empty list says why.',
};
