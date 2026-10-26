'use client';

import { IconButton } from 'dial-react';

function PlusSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function XSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function BasicIconButton() {
  return (
    <IconButton aria-label="Add item">
      <PlusSvg />
    </IconButton>
  );
}

export function IconButtonVariants() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <IconButton aria-label="Add item" variant="solid" intent="primary">
        <PlusSvg />
      </IconButton>
      <IconButton aria-label="Close dialog" variant="outline" intent="neutral">
        <XSvg />
      </IconButton>
      <IconButton aria-label="Delete item" variant="ghost" intent="danger">
        <XSvg />
      </IconButton>
    </div>
  );
}

export function IconButtonSizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)' }}>
      <IconButton aria-label="Add item" size="sm">
        <PlusSvg />
      </IconButton>
      <IconButton aria-label="Add item" size="md">
        <PlusSvg />
      </IconButton>
      <IconButton aria-label="Add item" size="lg">
        <PlusSvg />
      </IconButton>
      <IconButton aria-label="Add item" size="xl">
        <PlusSvg />
      </IconButton>
    </div>
  );
}

export function IconButtonVariantLadder() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <IconButton aria-label="Add item" variant="solid">
        <PlusSvg />
      </IconButton>
      <IconButton aria-label="Add item" variant="outline">
        <PlusSvg />
      </IconButton>
      <IconButton aria-label="Add item" variant="ghost">
        <PlusSvg />
      </IconButton>
      <IconButton aria-label="Add item" variant="link">
        <PlusSvg />
      </IconButton>
    </div>
  );
}

export function IconButtonIntentLadder() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <IconButton aria-label="Add item" intent="primary">
        <PlusSvg />
      </IconButton>
      <IconButton aria-label="Add item" intent="neutral">
        <PlusSvg />
      </IconButton>
      <IconButton aria-label="Delete item" intent="danger">
        <XSvg />
      </IconButton>
    </div>
  );
}

export function IconButtonLoading() {
  return (
    <IconButton aria-label="Saving" loading>
      <PlusSvg />
    </IconButton>
  );
}

export function IconButtonToolbar() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-inline-sm)',
        padding: 'var(--ds-space-inset-sm)',
        border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
        borderRadius: 'var(--ds-radius-md)',
        width: 'fit-content',
      }}
    >
      <IconButton aria-label="Add item" variant="ghost" intent="neutral">
        <PlusSvg />
      </IconButton>
      <IconButton aria-label="Delete item" variant="ghost" intent="danger">
        <XSvg />
      </IconButton>
    </div>
  );
}
