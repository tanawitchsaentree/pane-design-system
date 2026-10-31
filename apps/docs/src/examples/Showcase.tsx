// @example Pane at a glance: three screens that use what each component can do
import { useState } from 'react';
import { Avatar, Badge, Button, Card, Chip, IconButton, Select, Slider, Stack, Switch, Tabs, Tag } from 'pane-react';
import { IconNext, IconPause, IconPlay, IconPrev, IconShare } from '../icons';

/** The parts a card is built from, named on the card itself, so the showcase says what it shows. */
const Parts = ({ names }: { names: string[] }) => <div className="showcase-parts" aria-label="Built from">{names.map((n) => <Tag key={n}>{n}</Tag>)}</div>;

export default function Showcase() {
  const [playing, setPlaying] = useState(true);
  return (
    <div className="showcase">
      <Card as="section" aria-labelledby="sc-play" className="showcase-card">
        <img src="/scenes/night-sm.jpg" alt="Album art for Night drive, lilac and rose over navy" className="showcase-cover" />
        <div className="showcase-row">
          <div><h3 id="sc-play" className="flush">Night drive</h3><p className="flush">Lumen · side A</p></div>
          <Badge tone="positive">Synced</Badge>
        </div>
        <Slider label="Volume" defaultValue={62} format={(v) => `${v}%`} />
        <div className="showcase-transport">
          <IconButton aria-label="Previous track" variant="glass" size="sm"><IconPrev /></IconButton>
          <IconButton aria-label={playing ? 'Pause' : 'Play'} variant="loud" onClick={() => setPlaying(!playing)}>{playing ? <IconPause /> : <IconPlay />}</IconButton>
          <IconButton aria-label="Next track" variant="glass" size="sm"><IconNext /></IconButton>
        </div>
        <Parts names={['Cover photo', 'Slider', 'IconButton loud', 'Badge']} />
      </Card>

      <Card as="section" aria-labelledby="sc-room" className="showcase-card">
        <div className="showcase-row"><h3 id="sc-room" className="flush">Living room</h3><Badge>3 lights</Badge></div>
        <Stack gap="sm">
          <Slider variant="fill" label="Brightness" defaultValue={70} format={(v) => `${v}%`} />
          <Slider variant="fill" label="Warmth" defaultValue={35} format={(v) => `${v}%`} />
        </Stack>
        <Switch label="Night shift" description="Warmer light after sunset" defaultChecked />
        <div className="showcase-chips" role="group" aria-label="Scene"><Chip defaultSelected>Reading</Chip><Chip>Film</Chip><Chip>Away</Chip></div>
        <Card as="div" className="showcase-inner">
          <Select label="Turn off" defaultValue="23" options={[{ value: '22', label: 'At 22:00' }, { value: '23', label: 'At 23:00' }, { value: 'never', label: 'Never' }]} />
        </Card>
        <Parts names={['Slider fill', 'Switch', 'Chip', 'Card level 2', 'Select']} />
      </Card>

      <Card as="section" aria-labelledby="sc-me" className="showcase-card showcase-wide">
        <div className="showcase-row">
          <Avatar name="Mara Lind" size="md" />
          <div className="showcase-grow"><h3 id="sc-me" className="flush">Mara Lind</h3><p className="flush">Landscape photographer</p></div>
          <IconButton aria-label="Share profile" variant="glass" size="sm"><IconShare /></IconButton>
        </div>
        <Tabs.Root defaultValue="prints">
          <Tabs.List aria-label="Profile sections"><Tabs.Trigger value="prints">Prints</Tabs.Trigger><Tabs.Trigger value="trips">Trips</Tabs.Trigger><Tabs.Trigger value="notes">Notes</Tabs.Trigger></Tabs.List>
          <Tabs.Content value="prints"><Stack direction="row" gap="sm"><Tag>Norway</Tag><Tag>Fjords</Tag></Stack></Tabs.Content>
          <Tabs.Content value="trips"><p className="flush">Lofoten in March.</p></Tabs.Content>
          <Tabs.Content value="notes"><p className="flush">Two drafts.</p></Tabs.Content>
        </Tabs.Root>
        <div className="showcase-actions"><Button variant="accent">Go live</Button><Button variant="glass">Message</Button></div>
        <Parts names={['Avatar', 'Tabs', 'Button accent', 'Tag']} />
      </Card>
    </div>
  );
}
