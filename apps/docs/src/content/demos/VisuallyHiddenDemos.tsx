'use client';

import { VisuallyHidden, IconButton, Link } from 'dial-react';

export function BasicVisuallyHidden() {
  return (
    <button type="button" aria-label="Close" style={{ padding: 'var(--ds-space-inset-sm)' }}>
      <span aria-hidden="true">×</span>
      <VisuallyHidden>Close</VisuallyHidden>
    </button>
  );
}

function TrashSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function VisuallyHiddenIconButtonLabel() {
  return (
    <IconButton aria-label="Delete item" variant="ghost" intent="danger">
      <VisuallyHidden>Delete item</VisuallyHidden>
      <TrashSvg />
    </IconButton>
  );
}

export function VisuallyHiddenSkipLink() {
  return (
    <Link href="#main-content" variant="default">
      <VisuallyHidden>Skip to main content</VisuallyHidden>
    </Link>
  );
}
