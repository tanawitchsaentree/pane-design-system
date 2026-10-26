'use client';

import { Icon } from 'dial-react';

/**
 * Icon ships no icon set of its own (per its own spec's Usage section) — demos supply a small
 * inline SVG as the required `children`, the same way a real consumer would.
 */
function StarSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function BasicIcon() {
  return (
    <Icon>
      <StarSvg />
    </Icon>
  );
}

export function IconSizesColors() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)' }}>
      <Icon size="sm">
        <StarSvg />
      </Icon>
      <Icon size="md" color="subtle">
        <StarSvg />
      </Icon>
      <Icon size="lg" color="disabled">
        <StarSvg />
      </Icon>
      <Icon size="xl" label="Favorite">
        <StarSvg />
      </Icon>
    </div>
  );
}

export function IconSizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)' }}>
      <Icon size="sm">
        <StarSvg />
      </Icon>
      <Icon size="md">
        <StarSvg />
      </Icon>
      <Icon size="lg">
        <StarSvg />
      </Icon>
      <Icon size="xl">
        <StarSvg />
      </Icon>
    </div>
  );
}

export function IconColors() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)' }}>
      <Icon color="default">
        <StarSvg />
      </Icon>
      <Icon color="subtle">
        <StarSvg />
      </Icon>
      <Icon color="disabled">
        <StarSvg />
      </Icon>
      <Icon color="inverse" style={{ background: 'var(--ds-color-neutral-900)', borderRadius: 'var(--ds-radius-sm)' }}>
        <StarSvg />
      </Icon>
      <Icon color="currentColor">
        <StarSvg />
      </Icon>
    </div>
  );
}

export function IconWithText() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      <Icon>
        <StarSvg />
      </Icon>
      Favorite
    </span>
  );
}
