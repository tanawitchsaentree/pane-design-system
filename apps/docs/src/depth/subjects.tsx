// How to render each component for the Style tab and the header's live demo, given the enum props
// a reader picks. Only the content is fixed here; which options exist comes from meta.json.
import { useState, type ReactNode } from 'react';
import { Accordion, BottomNav, Breadcrumb, Navbar, NavigationMenu, Pagination, SegmentedControl, Sidebar, Stepper, TableOfContents } from 'pane-react';
import { ActionSheet, AspectRatio, Autocomplete, Combobox, ContextMenu, Listbox, Menu, MultiSelect, RadioCards, Rating, TagInput, Avatar, Badge, Box, Dialog, Drawer, FAB, Popover, PullToRefresh, Sheet, Snackbar, Toast, Tooltip, Heading, Icon, Image, Kbd, Link, Skeleton, Spinner, Text, Center, Divider, Flex, Mesh, Spacer, VisuallyHidden, Banner, Button, Card, Checkbox, Chip, Container, Environment, Fieldset, FormField, Grid, GridItem, HelperText, IconButton, Input, InputGroup, Label, PinInput, Radio, RadioGroup, Select, Slider, Stack, Switch, Tabs, Tag, Textarea } from 'pane-react';
import { IconHome, IconInbox, IconPencil, IconPin, IconSearch, IconShare } from '../icons';

function PagesSubject() {
  const [page, setPage] = useState(4);
  return <Pagination page={page} total={12} onPageChange={setPage} />;
}

type P = Record<string, string>;
// bare: the subject is itself a surface (Card, Environment, layout) and must not sit on a second pane
export interface Subject { render: (p: P, disabled?: boolean) => ReactNode; code: (p: P) => string; disabled?: boolean; bare?: boolean }

const attrs = (p: P) => Object.entries(p).map(([k, v]) => ` ${k}="${v}"`).join('');

/** Text over a photo is only measured readable on glass, so every subject that is not a surface sits on one. */
export const OnPane = ({ children }: { children: ReactNode }) => <Card as="div" className="demo-card"><div className="demo-row spec-row">{children}</div></Card>;

export const SUBJECTS: Record<string, Subject> = {
  Input: { disabled: true, render: (p, d) => <FormField label="Display name"><Input {...p} defaultValue="Mara Lind" disabled={d} /></FormField>, code: (p) => `<FormField label="Display name">\n  <Input${attrs(p)} defaultValue="Mara Lind" />\n</FormField>` },
  Textarea: { disabled: true, render: (_p, d) => <FormField label="Bio"><Textarea defaultValue="Landscape photographer." disabled={d} /></FormField>, code: () => '<FormField label="Bio">\n  <Textarea />\n</FormField>' },
  Checkbox: { disabled: true, render: (_p, d) => <Checkbox label="Show my email" defaultChecked disabled={d} />, code: () => '<Checkbox label="Show my email" defaultChecked />' },
  Radio: { disabled: true, render: (_p, d) => <RadioGroup label="Who can message you" defaultValue="a" disabled={d}><Radio value="a" label="Everyone" /><Radio value="b" label="No one" /></RadioGroup>, code: () => '<RadioGroup label="Who can message you" defaultValue="a">\n  <Radio value="a" label="Everyone" />\n  <Radio value="b" label="No one" />\n</RadioGroup>' },
  Switch: { disabled: true, render: (_p, d) => <Switch label="Private account" defaultChecked disabled={d} />, code: () => '<Switch label="Private account" defaultChecked />' },
  FormField: { render: () => <FormField label="Email" help="We send the receipt here."><Input type="email" /></FormField>, code: () => '<FormField label="Email" help="We send the receipt here.">\n  <Input type="email" />\n</FormField>' },
  Label: { render: () => <Label htmlFor="subj-label" required>Display name</Label>, code: () => '<Label htmlFor="name" required>Display name</Label>' },
  HelperText: { render: () => <HelperText tone="error">Keep it under 40 characters.</HelperText>, code: () => '<HelperText tone="error">Keep it under 40 characters.</HelperText>' },
  Fieldset: { render: () => <Fieldset legend="Shipping address"><FormField label="City"><Input defaultValue="Bergen" /></FormField></Fieldset>, code: () => '<Fieldset legend="Shipping address">…</Fieldset>' },
  InputGroup: { render: () => <InputGroup end="NOK"><Input aria-label="Price" defaultValue="950" /></InputGroup>, code: () => '<InputGroup end="NOK">\n  <Input aria-label="Price" />\n</InputGroup>' },
  PinInput: { render: () => <PinInput aria-label="Code" length={4} defaultValue="48" />, code: () => '<PinInput aria-label="Code" length={4} />' },
  Button: { disabled: true, render: (p, d) => <Button {...p} disabled={d}>Follow</Button>, code: (p) => `<Button${attrs(p)}>Follow</Button>` },
  IconButton: { disabled: true, render: (p, d) => <IconButton aria-label="Share" {...p} disabled={d}><IconShare /></IconButton>, code: (p) => `<IconButton aria-label="Share"${attrs(p)}>\n  <IconShare />\n</IconButton>` },
  Badge: { render: (p) => <Badge {...p}>3 new</Badge>, code: (p) => `<Badge${attrs(p)}>3 new</Badge>` },
  Banner: { render: (p) => <Banner title="Card expires next month" {...p}>Update it to avoid a pause.</Banner>, code: (p) => `<Banner title="Card expires next month"${attrs(p)}>\n  Update it to avoid a pause.\n</Banner>` },
  // inset has no glass of its own, so it is shown where it lives: inside a glass card
  Card: { bare: true, render: (p) => { const c = <Card as="div" {...p} className="demo-card"><h3 className="flush">Mara Lind</h3><p className="flush muted">Landscape photographer</p></Card>; return p.variant === 'inset' ? <Card as="div" className="demo-card">{c}</Card> : c; }, code: (p) => `<Card${attrs(p)}>\n  <h3>Mara Lind</h3>\n</Card>` },
  Avatar: { render: (p) => <Avatar name="Mara Lind" {...p} />, code: (p) => `<Avatar name="Mara Lind"${attrs(p)} />` },
  Chip: { render: () => <Chip defaultSelected>Photos</Chip>, code: () => '<Chip defaultSelected>Photos</Chip>' },
  Tag: { render: () => <Tag>Landscape</Tag>, code: () => '<Tag>Landscape</Tag>' },
  Box: { render: () => <Box padding="lg" radius="inner" className="demo-box">Padded</Box>, code: () => '<Box padding="lg" radius="inner">…</Box>' },
  Flex: { render: () => <Flex justify="between" className="demo-wide"><span>Title</span><span>Action</span></Flex>, code: () => '<Flex justify="between">…</Flex>' },
  Center: { render: () => <Center className="demo-center">Centred</Center>, code: () => '<Center>…</Center>' },
  Spacer: { bare: true, render: (p) => <Spacer {...p} className="demo-spacer-vis" />, code: (p) => `<Spacer${attrs(p)} />` },
  Divider: { render: () => <div className="demo-wide"><Divider /></div>, code: () => '<Divider />' },
  AspectRatio: { render: () => <div className="demo-ratio-lg"><AspectRatio ratio="video" className="demo-media"><Mesh preset="ember" /></AspectRatio></div>, code: () => '<AspectRatio ratio="video">…</AspectRatio>' },
  VisuallyHidden: { render: () => <span>Bergen<VisuallyHidden>, your location</VisuallyHidden></span>, code: () => '<VisuallyHidden>…</VisuallyHidden>' },
  Text: { render: (p) => <Text {...p}>Six nights in Lofoten</Text>, code: (p) => `<Text${attrs(p)}>Six nights in Lofoten</Text>` },
  Heading: { render: (p) => <Heading level={3} {...p}>Packing list</Heading>, code: (p) => `<Heading level={3}${attrs(p)}>Packing list</Heading>` },
  Icon: { render: (p) => <Icon {...p}><IconPin /></Icon>, code: (p) => `<Icon${attrs(p)}><IconPin /></Icon>` },
  Link: { render: (p) => <Text>Read the <Link href="#guide" {...p}>shipping guide</Link></Text>, code: (p) => `<Link href="/guide"${attrs(p)}>shipping guide</Link>` },
  Spinner: { render: (p) => <Spinner {...p} />, code: (p) => `<Spinner${attrs(p)} />` },
  Skeleton: { render: (p) => <div className="demo-wide"><Skeleton {...p} /></div>, code: (p) => `<Skeleton${attrs(p)} />` },
  Kbd: { render: () => <Kbd>⌘</Kbd>, code: () => '<Kbd>⌘</Kbd>' },
  Image: { render: (p) => <Image src="/scenes/forest-sm.jpg" alt="Spruce forest in fog" className="demo-img" {...p} />, code: (p) => `<Image src="/photo.jpg" alt="…"${attrs(p)} />` },
  Dialog: { bare: true, render: (p) => <Dialog preview title="Discard this draft?" description="Your changes will be lost." actions={<><Button variant="glass">Keep editing</Button><Button>Discard</Button></>} {...p} />, code: (p) => `<Dialog title="Discard this draft?"${attrs(p)} … />` },
  Sheet: { bare: true, render: (p) => <Sheet preview title="Filters" {...p}><Switch label="Photos" defaultChecked /></Sheet>, code: (p) => `<Sheet title="Filters"${attrs(p)}>…</Sheet>` },
  Drawer: { bare: true, render: (p) => <Drawer preview title="Filters" {...p}><Switch label="Only mine" /></Drawer>, code: (p) => `<Drawer title="Filters"${attrs(p)}>…</Drawer>` },
  ActionSheet: { bare: true, render: () => <ActionSheet preview title="Photo" actions={[{ label: 'Share', onSelect: () => {} }, { label: 'Delete photo', tone: 'critical', onSelect: () => {} }]} />, code: () => '<ActionSheet title="Photo" actions={[…]} />' },
  Popover: { bare: true, render: (p) => <Popover preview trigger={<Button variant="glass">Shipping</Button>} title="Shipping" {...p}><Text>Within a week.</Text></Popover>, code: (p) => `<Popover trigger={…} title="Shipping"${attrs(p)}>…</Popover>` },
  Tooltip: { bare: true, render: (p) => <Tooltip preview content="Share" {...p}><IconButton aria-label="Share" variant="glass"><IconShare /></IconButton></Tooltip>, code: (p) => `<Tooltip content="Share"${attrs(p)}>…</Tooltip>` },
  Toast: { bare: true, render: (p) => <Toast preview open onOpenChange={() => {}} title="Print ordered" {...p} />, code: (p) => `<Toast title="Print ordered"${attrs(p)} … />` },
  Snackbar: { bare: true, render: () => <Snackbar preview open onOpenChange={() => {}} message="Message archived" />, code: () => '<Snackbar message="Message archived" … />' },
  FAB: { bare: true, render: (p) => <div className="demo-phone"><FAB icon={<IconPencil />} label="New post" position="contained" {...p} /></div>, code: (p) => `<FAB icon={…} label="New post"${attrs(p)} />` },
  PullToRefresh: { render: () => <PullToRefresh className="demo-ptr" onRefresh={() => {}}><Text>Inbox</Text></PullToRefresh>, code: () => '<PullToRefresh onRefresh={load}>…</PullToRefresh>' },
  Listbox: { bare: true, render: () => <div className="demo-wide"><Listbox label="Paper" defaultValue="matte" options={[{ value: 'matte', label: 'Matte' }, { value: 'gloss', label: 'Gloss' }]} /></div>, code: () => '<Listbox label="Paper" options={…} />' },
  Combobox: { bare: true, render: () => <div className="demo-wide"><Combobox label="Destination" options={[{ value: 'lofoten', label: 'Lofoten' }]} /></div>, code: () => '<Combobox label="Destination" options={…} />' },
  Autocomplete: { bare: true, render: () => <div className="demo-wide"><Autocomplete label="Camera" suggestions={['Leica Q2']} /></div>, code: () => '<Autocomplete label="Camera" suggestions={…} />' },
  MultiSelect: { bare: true, render: () => <div className="demo-wide"><MultiSelect label="Places" defaultValue={['lofoten']} options={[{ value: 'lofoten', label: 'Lofoten' }, { value: 'senja', label: 'Senja' }]} /></div>, code: () => '<MultiSelect label="Places" options={…} />' },
  Menu: { render: (p) => <Menu label="Photo" trigger={<Button variant="glass">Photo</Button>} items={[{ label: 'Share', onSelect: () => {} }]} {...p} />, code: (p) => `<Menu label="Photo" trigger={…} items={…}${attrs(p)} />` },
  ContextMenu: { render: () => <ContextMenu label="Row" items={[{ label: 'Copy', onSelect: () => {} }]}><div tabIndex={0} className="demo-row-target">Right click</div></ContextMenu>, code: () => '<ContextMenu label="Row" items={…}>…</ContextMenu>' },
  RadioCards: { bare: true, render: (p) => <div className="demo-wide"><RadioCards label="Delivery" defaultValue="s" options={[{ value: 's', title: 'Standard', description: 'Free' }, { value: 'e', title: 'Express', description: '90 NOK' }]} {...p} /></div>, code: (p) => `<RadioCards label="Delivery" options={…}${attrs(p)} />` },
  Rating: { render: () => <Rating label="Rate this print" defaultValue={4} />, code: () => '<Rating label="Rate this print" defaultValue={4} />' },
  TagInput: { bare: true, render: () => <div className="demo-wide"><TagInput label="Tags" defaultValue={['fjords']} /></div>, code: () => '<TagInput label="Tags" />' },
  SegmentedControl: { render: (p) => <SegmentedControl label="View" defaultValue="grid" options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'map', label: 'Map' }]} {...p} />, code: (p) => `<SegmentedControl label="View" options={…}${attrs(p)} />` },
  BottomNav: { bare: true, render: () => <div className="demo-phone"><BottomNav position="contained" current="#home" onNavigate={(_, e) => e.preventDefault()} items={[{ href: '#home', label: 'Home', icon: <IconHome /> }, { href: '#search', label: 'Search', icon: <IconSearch /> }, { href: '#inbox', label: 'Inbox', icon: <IconInbox /> }]} /></div>, code: () => '<BottomNav current="/home" items={…} />' },
  Navbar: { bare: true, render: () => <div className="demo-wide"><Navbar sticky={false} brand={<Text weight="semibold">North Light</Text>} links={[{ href: '#prints', label: 'Prints' }, { href: '#journal', label: 'Journal' }]} current="#prints" /></div>, code: () => '<Navbar brand={…} links={…} current="/prints" />' },
  Sidebar: { bare: true, render: () => <Sidebar current="#photos" sections={[{ items: [{ href: '#inbox', label: 'Inbox', icon: <IconInbox /> }, { href: '#photos', label: 'Photos', icon: <IconHome /> }] }]} />, code: () => '<Sidebar current="/photos" sections={…} />' },
  Breadcrumb: { render: () => <Breadcrumb items={[{ href: '#home', label: 'Home' }, { href: '#albums', label: 'Albums' }, { href: '#lofoten', label: 'Lofoten' }]} />, code: () => '<Breadcrumb items={…} />' },
  Pagination: { render: () => <PagesSubject />, code: () => '<Pagination page={page} total={12} onPageChange={setPage} />' },
  Stepper: { render: (p) => <Stepper label="Checkout" current={1} steps={[{ label: 'Cart' }, { label: 'Delivery' }, { label: 'Payment' }]} {...p} />, code: (p) => `<Stepper label="Checkout" current={1} steps={…}${attrs(p)} />` },
  Accordion: { bare: true, render: (p) => <div className="demo-wide"><Accordion defaultValue="ship" items={[{ value: 'ship', title: 'How long does delivery take?', content: <Text tone="secondary">Three working days.</Text> }, { value: 'paper', title: 'Which paper do you print on?', content: <Text tone="secondary">A cotton rag.</Text> }]} {...p} /></div>, code: (p) => `<Accordion items={…}${attrs(p)} />` },
  NavigationMenu: { render: () => <NavigationMenu items={[{ label: 'Shop', links: [{ href: '#prints', label: 'Prints', description: 'Framed photographs' }] }, { label: 'About', href: '#about' }]} />, code: () => '<NavigationMenu items={…} />' },
  TableOfContents: { render: () => <TableOfContents track={false} items={[{ id: 'st-a', label: 'Winter light' }, { id: 'st-b', label: 'What to pack' }]} />, code: () => '<TableOfContents items={…} />' },
  Mesh: { bare: true, render: (p) => <Mesh {...p} className="mesh-demo-tile" />, code: (p) => `<Mesh${attrs(p)} />` },
  Tabs: { render: () => <Tabs.Root defaultValue="a"><Tabs.List aria-label="Demo sections"><Tabs.Trigger value="a">Posts</Tabs.Trigger><Tabs.Trigger value="b">Media</Tabs.Trigger></Tabs.List><Tabs.Content value="a">Posts</Tabs.Content><Tabs.Content value="b">Media</Tabs.Content></Tabs.Root>, code: () => '<Tabs.Root defaultValue="a">\n  <Tabs.List aria-label="Demo sections">\n    <Tabs.Trigger value="a">Posts</Tabs.Trigger>\n    <Tabs.Trigger value="b">Media</Tabs.Trigger>\n  </Tabs.List>\n</Tabs.Root>' },
  Select: { disabled: true, render: (p, d) => <Select label="Plan" options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]} defaultValue="pro" {...p} disabled={d} />, code: (p) => `<Select label="Plan" defaultValue="pro"${attrs(p)}\n  options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]} />` },
  Slider: { disabled: true, render: (p, d) => <Slider label="Volume" defaultValue={40} format={(v) => `${v}%`} {...p} disabled={d} />, code: (p) => `<Slider label="Volume" defaultValue={40}${attrs(p)} />` },
  Container: { bare: true, render: (p) => <Container {...p}><Card as="div" className="demo-card"><p className="flush">Content column</p></Card></Container>, code: (p) => `<Container${attrs(p)}>…</Container>` },
  Grid: { bare: true, render: () => <Grid><GridItem span={6}><Card as="div" className="demo-card">Half</Card></GridItem><GridItem span={6}><Card as="div" className="demo-card">Half</Card></GridItem></Grid>, code: () => '<Grid>\n  <GridItem span={6}>…</GridItem>\n  <GridItem span={6}>…</GridItem>\n</Grid>' },
  Stack: { render: () => <Stack direction="row" gap="md"><Tag>One</Tag><Tag>Two</Tag><Tag>Three</Tag></Stack>, code: () => '<Stack direction="row" gap="md">…</Stack>' },
  Environment: { bare: true, render: () => <Environment brightness="bright"><Card as="div" className="demo-card">Glass inside</Card></Environment>, code: () => '<Environment brightness="bright">\n  <Card>…</Card>\n</Environment>' },
};
