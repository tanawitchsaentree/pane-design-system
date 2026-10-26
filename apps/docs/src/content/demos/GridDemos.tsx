'use client';

import type { CSSProperties } from 'react';
import { Grid, Card } from 'dial-react';

const cell: CSSProperties = {
  padding: 'var(--ds-space-inset-sm)',
  border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
  borderRadius: 'var(--ds-radius-sm)',
  background: 'var(--ds-color-role-brand-subtle-bg)',
  color: 'var(--ds-color-role-brand-subtle-text)',
  textAlign: 'center',
};

export function BasicGrid() {
  return (
    <Grid columns={12} gap="200">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ ...cell, gridColumn: 'span 1' }}>
          {i + 1}
        </div>
      ))}
    </Grid>
  );
}

export function GridCustomColumns() {
  return (
    <Grid columns={4} gap="300">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} style={cell}>
          Card {i + 1}
        </div>
      ))}
    </Grid>
  );
}

const caption: CSSProperties = {
  fontFamily: 'var(--ds-font-family-mono)',
  fontSize: 'var(--ds-font-size-xs)',
  color: 'var(--ds-color-text-subtle)',
  marginBlockEnd: 'var(--ds-space-inline-sm)',
};

export function GridGap() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-md)' }}>
      <div>
        <div style={caption}>gap=&quot;100&quot;</div>
        <Grid columns={4} gap="100">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} style={cell}>
              {i + 1}
            </div>
          ))}
        </Grid>
      </div>
      <div>
        <div style={caption}>gap=&quot;800&quot;</div>
        <Grid columns={4} gap="800">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} style={cell}>
              {i + 1}
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function GridCardLayout() {
  return (
    <Grid columns={3} gap="300">
      {['Alpine trail', 'Coastal path', 'Desert ridge'].map((title) => (
        <Card.Root key={title}>
          <Card.Body>{title}</Card.Body>
        </Card.Root>
      ))}
    </Grid>
  );
}
