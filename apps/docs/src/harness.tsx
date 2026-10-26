// Evidence harness — every glass surface on every worst-case backdrop, tagged for measurement.
// data-ev-text   = text whose contrast is measured against the real pixels under it
// data-ev-edge   = element whose double mullion is measured against the backdrop beside it
// data-ev-thumb  = non-text graphic (Switch thumb) measured against the pixels under it
// data-scene     = "{backdrop}/{surface}" — the row key in evidence.json
import { createRoot } from 'react-dom/client';
import 'pane-tokens/css';
import './backdrops.css';
import './harness.css';
import { Badge, Button, Panel, Switch, TextField } from 'pane-react';

export const BACKDROPS = ['white', 'black', 'midgray', 'stripes', 'gradient', 'bauhaus'] as const;

const t = { 'data-ev-text': '' };

function Surfaces({ bd }: { bd: string }) {
  return (
    <>
      <div className={`scene bd-${bd}`} data-scene={`${bd}/panel`}>
        <Panel data-ev-edge="" title={<span {...t}>Panel title</span>} description={<span {...t}>Secondary description text</span>}>
          <p {...t} style={{ margin: 0 }}>Body text on a regular pane.</p>
        </Panel>
      </div>
      <div className={`scene bd-${bd}`} data-scene={`${bd}/button-glass`}>
        <Button variant="glass" data-ev-edge=""><span {...t}>Glass button</span></Button>
      </div>
      <div className={`scene bd-${bd}`} data-scene={`${bd}/button-primary`}>
        <Button variant="primary" data-ev-edge=""><span {...t}>Primary button</span></Button>
      </div>
      <div className={`scene bd-${bd}`} data-scene={`${bd}/badge`}>
        <Badge data-ev-edge=""><span {...t}>Neutral</span></Badge>
      </div>
      <div className={`scene bd-${bd}`} data-scene={`${bd}/field-on-panel`}>
        <Panel>
          <TextField
            label={<span {...t}>Email</span>}
            helperText={<span {...t}>Helper text</span>}
            errorText={<span {...t}>Error: enter an email address</span>}
            defaultValue="name@example.com"
            data-ev-input=""
          />
        </Panel>
      </div>
      <div className={`scene bd-${bd}`} data-scene={`${bd}/switch-on-panel`}>
        <Panel>
          <Switch label={<span {...t}>Off switch</span>} data-ev-switch="" />
        </Panel>
      </div>
      <div className={`scene bd-${bd}`} data-scene={`${bd}/field-bare`}>
        <TextField label={<span {...t}>Bare label</span>} defaultValue="value" data-ev-input="" />
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <main className="harness">
    {BACKDROPS.map((bd) => <Surfaces key={bd} bd={bd} />)}
  </main>,
);
