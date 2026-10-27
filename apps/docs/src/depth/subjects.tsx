// How to render each component for the Style tab and the header's live demo, given the enum props
// a reader picks. Only the content is fixed here; which options exist comes from meta.json.
import type { ReactNode } from 'react';
import { Avatar, Badge, Banner, Button, Card, Checkbox, Chip, Container, Environment, Fieldset, FormField, Grid, GridItem, HelperText, IconButton, Input, InputGroup, Label, PinInput, Radio, RadioGroup, Select, Slider, Stack, Switch, Tabs, Tag, Textarea } from 'pane-react';
import { IconShare } from '../icons';

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
  Tabs: { render: () => <Tabs.Root defaultValue="a"><Tabs.List aria-label="Demo sections"><Tabs.Trigger value="a">Posts</Tabs.Trigger><Tabs.Trigger value="b">Media</Tabs.Trigger></Tabs.List><Tabs.Content value="a">Posts</Tabs.Content><Tabs.Content value="b">Media</Tabs.Content></Tabs.Root>, code: () => '<Tabs.Root defaultValue="a">\n  <Tabs.List aria-label="Demo sections">\n    <Tabs.Trigger value="a">Posts</Tabs.Trigger>\n    <Tabs.Trigger value="b">Media</Tabs.Trigger>\n  </Tabs.List>\n</Tabs.Root>' },
  Select: { disabled: true, render: (p, d) => <Select label="Plan" options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]} defaultValue="pro" {...p} disabled={d} />, code: (p) => `<Select label="Plan" defaultValue="pro"${attrs(p)}\n  options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]} />` },
  Slider: { disabled: true, render: (_p, d) => <Slider label="Volume" defaultValue={40} disabled={d} />, code: () => '<Slider label="Volume" defaultValue={40} />' },
  Container: { bare: true, render: (p) => <Container {...p}><Card as="div" className="demo-card"><p className="flush">Content column</p></Card></Container>, code: (p) => `<Container${attrs(p)}>…</Container>` },
  Grid: { bare: true, render: () => <Grid><GridItem span={6}><Card as="div" className="demo-card">Half</Card></GridItem><GridItem span={6}><Card as="div" className="demo-card">Half</Card></GridItem></Grid>, code: () => '<Grid>\n  <GridItem span={6}>…</GridItem>\n  <GridItem span={6}>…</GridItem>\n</Grid>' },
  Stack: { render: () => <Stack direction="row" gap="md"><Tag>One</Tag><Tag>Two</Tag><Tag>Three</Tag></Stack>, code: () => '<Stack direction="row" gap="md">…</Stack>' },
  Environment: { bare: true, render: () => <Environment brightness="bright"><Card as="div" className="demo-card">Glass inside</Card></Environment>, code: () => '<Environment brightness="bright">\n  <Card>…</Card>\n</Environment>' },
};
