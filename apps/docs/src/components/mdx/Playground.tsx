'use client';

import { useState } from 'react';
import type { ElementType, ReactNode } from 'react';
import { Button, Switch, Input, Label } from 'dial-react';

/**
 * Real prop-combination playground — distinct from <Demo>, which shows a fixed set of curated
 * examples with no way to try a combination that isn't already written. This component lets the
 * reader pick any control value and see BOTH the live render and the shown code update together,
 * from the same state — never two representations that could drift from each other.
 *
 * Control specs are read from the same real enum constants the component's own source exports
 * (e.g. dial-react's `BUTTON_VARIANTS`/`ACTION_INTENTS`/`CONTROL_SIZE_TOKENS`), passed in by the
 * MDX page authoring the playground — never invented option lists.
 *
 * The boolean/text/copy controls below are `dial-react`'s own `Switch`/`Input`/`Button` — this
 * docs site dogfoods the library it documents rather than reaching for raw form elements. The
 * enum control stays a native `<select>`: dial-react has no Select/Combobox component yet (only
 * `Listbox`, which isn't a drop-in replacement for a compact native select) — logged to BACKLOG.
 */

export interface EnumControl {
  type: 'enum';
  label: string;
  prop: string;
  options: readonly string[];
  default: string;
}

export interface BooleanControl {
  type: 'boolean';
  label: string;
  prop: string;
  default: boolean;
}

export interface TextControl {
  type: 'text';
  label: string;
  prop: string;
  default: string;
}

export type ControlSpec = EnumControl | BooleanControl | TextControl;

function defaultValues(controls: ControlSpec[]): Record<string, string | boolean> {
  const values: Record<string, string | boolean> = {};
  for (const c of controls) values[c.prop] = c.default;
  return values;
}

function formatPropValue(value: string | boolean): string {
  if (typeof value === 'boolean') return value ? '' : '';
  return `="${value}"`;
}

/** Builds the exact JSX source string for the current control values — this is what the code
 * panel shows, generated from the same state driving the render, never hand-written separately. */
function buildCode(componentName: string, values: Record<string, string | boolean>, childrenText: string): string {
  const props = Object.entries(values)
    .filter(([, v]) => v !== false && v !== '')
    .map(([k, v]) => (typeof v === 'boolean' ? k : `${k}${formatPropValue(v)}`))
    .join(' ');
  const propsStr = props ? ` ${props}` : '';
  return `<${componentName}${propsStr}>${childrenText}</${componentName}>`;
}

export function Playground({
  component: Component,
  componentName,
  controls,
  childrenProp = 'children',
  initialChildren = 'Label',
}: {
  component: ElementType;
  componentName: string;
  controls: ControlSpec[];
  childrenProp?: string;
  initialChildren?: string;
}) {
  const [values, setValues] = useState<Record<string, string | boolean>>(defaultValues(controls));
  const [copied, setCopied] = useState(false);

  const renderProps: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(values)) {
    if (v === false || v === '') continue;
    renderProps[k] = v;
  }

  const code = buildCode(componentName, values, initialChildren);

  function handleCopy() {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="docs-playground">
      <div className="docs-playground-preview">
        <Component {...renderProps}>{initialChildren as ReactNode}</Component>
      </div>
      <div className="docs-playground-controls">
        {controls.map((control) => (
          <div key={control.prop} className="docs-playground-control">
            {control.type === 'boolean' ? (
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
                <Switch
                  checked={values[control.prop] as boolean}
                  onChange={(e) => setValues((prev) => ({ ...prev, [control.prop]: e.target.checked }))}
                />
                {control.label}
              </label>
            ) : (
              <Label htmlFor={`pg-${control.prop}`}>{control.label}</Label>
            )}
            {control.type === 'enum' && (
              <select
                id={`pg-${control.prop}`}
                value={values[control.prop] as string}
                onChange={(e) => setValues((prev) => ({ ...prev, [control.prop]: e.target.value }))}
              >
                {control.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
            {control.type === 'text' && (
              <Input
                id={`pg-${control.prop}`}
                size="sm"
                value={values[control.prop] as string}
                onChange={(e) => setValues((prev) => ({ ...prev, [control.prop]: e.target.value }))}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'var(--ds-space-inset-sm)' }}>
        <Button variant="link" intent="neutral" size="sm" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="docs-demo-code">{code}</pre>
    </div>
  );
}
