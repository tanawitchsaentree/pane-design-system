'use client';

import type { CSSProperties } from 'react';
import { AspectRatio } from 'dial-react';

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'var(--ds-color-role-brand-subtle-bg)',
  color: 'var(--ds-color-role-brand-subtle-text)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--ds-radius-sm)',
};

export function BasicAspectRatio() {
  return (
    <AspectRatio ratio="video" style={{ maxWidth: 320 }}>
      <div style={fill}>video (16 / 9)</div>
    </AspectRatio>
  );
}

export function AspectRatioPresets() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-300)', flexWrap: 'wrap' }}>
      <AspectRatio ratio="square" style={{ width: 120 }}>
        <div style={fill}>square</div>
      </AspectRatio>
      <AspectRatio ratio="photo" style={{ width: 120 }}>
        <div style={fill}>photo</div>
      </AspectRatio>
      <AspectRatio ratio="portrait" style={{ width: 120 }}>
        <div style={fill}>portrait</div>
      </AspectRatio>
      <AspectRatio ratio="golden" style={{ width: 120 }}>
        <div style={fill}>golden</div>
      </AspectRatio>
    </div>
  );
}

export function AspectRatioNumeric() {
  return (
    <AspectRatio ratio={2.5} style={{ maxWidth: 240 }}>
      <div style={fill}>ratio=&#123;2.5&#125;</div>
    </AspectRatio>
  );
}
