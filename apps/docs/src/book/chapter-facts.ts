// The light chapter facts the shell needs (tabs, history, status names, evidence groups), split from
// ComponentPage so the nav and the shell do not pull the whole component page into the first chunk.
import changelog from '../../../../packages/react/CHANGELOG.md?raw';

export const TABS = ['usage', 'style', 'code', 'accessibility'] as const;
export type Tab = typeof TABS[number];
// History per component, parsed from the package changelog: "## version (date)" then "- Name: text".
export const HISTORY: Array<{ version: string; date: string; component: string; text: string }> = changelog.split(/^## /m).slice(1).flatMap((block) => {
  const [, version, date] = block.match(/^(\S+) \((\d{4}-\d{2}-\d{2})\)/) ?? [];
  return [...block.matchAll(/^- (\w+): (.*)$/gm)].map((m) => ({ version, date, component: m[1], text: m[2] }));
});
export const STATUS_LABEL = { alpha: 'Alpha', beta: 'Beta', stable: 'Stable' } as const;

// Which evidence-harness groups hold this component's text.
export const EVIDENCE_GROUPS: Record<string, string[]> = { Container: ['layout'], Grid: ['layout'], Stack: ['layout'], Badge: ['status'], Chip: ['status'], Banner: ['status'], Environment: ['environment'], Card: ['card'], Avatar: ['card'], Button: ['controls'], IconButton: ['controls'], Tabs: ['controls'], Tag: ['controls', 'media'], Select: ['controls'], Slider: ['controls'], Input: ['forms'], Textarea: ['forms'], Checkbox: ['forms'], Radio: ['forms'], Switch: ['forms'], FormField: ['forms'], Label: ['forms'], HelperText: ['forms'], Fieldset: ['forms'], InputGroup: ['forms'], PinInput: ['forms'] };
