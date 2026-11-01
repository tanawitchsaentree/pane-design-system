// The anchor knobs (R-046): a few roots, and the rest follows so the system stays in proportion. The
// preview is the home page's order card inside an Environment with the chosen look; the table under it
// reads the corners and gaps back from the rendered card, so what it says is what the browser drew.
import { useLayoutEffect, useRef, useState } from 'react';
import { Environment, SegmentedControl, Slider, type EnvironmentLook } from 'pane-react';
import FeedPost from '../examples/FeedPost';
import { Code, Stage } from './kit';

type Density = 'compact' | 'regular' | 'roomy';
type Controls = 'auto' | 'pill';
type Material = 'liquid' | 'glass' | 'solid';
const DEFAULT = { corner: 40, density: 'regular' as Density, controls: 'auto' as Controls, material: 'glass' as Material };

export function LookKnobs() {
  const [corner, setCorner] = useState(DEFAULT.corner);
  const [density, setDensity] = useState<Density>(DEFAULT.density);
  const [controls, setControls] = useState<Controls>(DEFAULT.controls);
  const [material, setMaterial] = useState<Material>(DEFAULT.material);
  const [read, setRead] = useState<Array<[string, string]>>([]);
  const box = useRef<HTMLDivElement>(null);
  const look: EnvironmentLook = { corner, density, controls };
  useLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const id = requestAnimationFrame(() => {
      const cs = getComputedStyle(el); const v = (n: string) => cs.getPropertyValue(n).trim();
      const px = (expr: string) => { const t = document.createElement('div'); t.style.width = expr; el.append(t); const w = getComputedStyle(t).width; t.remove(); return w; };
      setRead([
        ['Pane corner', px('var(--ds-corner-panel)')], ['Pane inset', px('var(--ds-gap-inset)')],
        ['Inner surface corner', px('var(--ds-corner-inner)')], ['Media corner', px('var(--ds-corner-media)')],
        ['Control corner', /999/.test(px('var(--ds-corner-round)')) || parseFloat(px('var(--ds-corner-round)')) > 200 ? 'pill' : px('var(--ds-corner-round)')],
        ['Gap between parts', px('var(--ds-gap-lg)')], ['Density factor', v('--ds-look-density') || '1'],
      ]);
    });
    return () => cancelAnimationFrame(id);
  }, [corner, density, controls, material]);
  const changed = corner !== DEFAULT.corner || density !== DEFAULT.density || controls !== DEFAULT.controls;
  const code = `<Environment material="${material}"${changed ? ` look={{ ${[corner !== DEFAULT.corner && `corner: ${corner}`, density !== DEFAULT.density && `density: '${density}'`, controls !== DEFAULT.controls && `controls: '${controls}'`].filter(Boolean).join(', ')} }}` : ''}>
  <App />
</Environment>`;
  return (
    <div className="look-knobs">
      <div className="look-knobs-controls" data-controls="">
        <Slider label="Pane corner" min={4} max={48} step={2} value={corner} onValueChange={setCorner} format={(n) => `${n}px`} />
        <SegmentedControl label="Density" showLabel value={density} onValueChange={(v) => setDensity(v as Density)} options={[{ value: 'compact', label: 'Compact' }, { value: 'regular', label: 'Regular' }, { value: 'roomy', label: 'Roomy' }]} />
        <SegmentedControl label="Controls" showLabel value={controls} onValueChange={(v) => setControls(v as Controls)} options={[{ value: 'auto', label: 'Follow the corner' }, { value: 'pill', label: 'Always pills' }]} />
        <SegmentedControl label="Material" showLabel value={material} onValueChange={(v) => setMaterial(v as Material)} options={[{ value: 'liquid', label: 'Liquid' }, { value: 'glass', label: 'Glass' }, { value: 'solid', label: 'Solid' }]} />
      </div>
      <Stage backdrop="scene" picker>
        <Environment ref={box} material={material} look={look} className="look-knobs-preview"><FeedPost /></Environment>
      </Stage>
      <table className="look-knobs-read">
        <caption>What follows, read from the card above</caption>
        <tbody>{read.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
      </table>
      <Code label="Your Environment">{code}</Code>
    </div>
  );
}
