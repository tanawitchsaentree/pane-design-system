// Evidence harness — the anchor card plus every component variant, on one scene per page load
// (?scene=room|blobs|night|daylight). Text is grouped by data-group for tooling/glass-evidence.mjs:
//   card      — the anchor card's own text (minus the image)
//   media     — text on the post image (reported, not gated: depends on the picture)
//   controls  — every Button / IconButton / Tabs / Tag variant on a glass card
//   environment — cards whose declared environment is at least as bright as the scene (gated)
//   env-misuse  — cards declared darker than the scene (reported, not gated)
import { createRoot } from 'react-dom/client';
import 'pane-tokens/css';
import './scenes.css';
import './docs.css';
import { Button, Card, Environment, IconButton, Tabs, Tag } from 'pane-react';
import { AnchorCard } from './AnchorCard';
import { IconMore, IconPencil } from './icons';
import { sceneById } from './scenes';

const LEVELS = ['dim', 'mid', 'bright'] as const;
const scene = sceneById(new URLSearchParams(location.search).get('scene') ?? 'room');
document.body.dataset.scene = scene.id;

createRoot(document.getElementById('root')!).render(
  <Environment brightness={scene.brightness} className="harness">
    <div className="env" aria-hidden="true"><i className="e1" /><i className="e2" /><i className="e3" /><i className="e4" /><i className="e5" /></div>
    <main className="harness-grid">
      <div data-group="card" className="harness-anchor"><AnchorCard idPrefix="h" /></div>
      <div data-group="controls">
        <Card as="div">
          <div className="demo-row">
            <Button>Follow</Button><Button variant="accent">Get verified</Button><Button variant="glass">Message</Button><Button variant="glass" size="sm">Small</Button>
          </div>
          <div className="demo-row">
            <IconButton aria-label="Edit"><IconPencil /></IconButton><IconButton variant="ghost" aria-label="More"><IconMore /></IconButton>
            <Tag>Visual asset 05</Tag><Tag>Trending</Tag>
          </div>
          <Tabs.Root defaultValue="a">
            <Tabs.List aria-label="Harness tabs"><Tabs.Trigger value="a">Tweets</Tabs.Trigger><Tabs.Trigger value="b">Replies</Tabs.Trigger><Tabs.Trigger value="c">Media</Tabs.Trigger><Tabs.Trigger value="d">Likes</Tabs.Trigger></Tabs.List>
            <Tabs.Content value="a"><p className="flush muted">Secondary text on the card.</p></Tabs.Content>
          </Tabs.Root>
        </Card>
      </div>
      <div className="harness-envs">
        {/* One card per environment. A card declared darker than the scene's brightness is misuse —
            it is measured as "env-misuse" (reported, not gated) to show why the rule exists. */}
        {LEVELS.map((b) => (
          <Environment key={b} brightness={b} data-env-probe={b} data-group={LEVELS.indexOf(b) >= LEVELS.indexOf(scene.brightness) ? 'environment' : 'env-misuse'}>
            <Card as="div"><p className="flush">{b} glass</p><p className="flush muted">Secondary text</p></Card>
          </Environment>
        ))}
      </div>
    </main>
  </Environment>,
);
