'use client';

import { Tooltip, IconButton } from 'dial-react';

function PlusSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function BasicTooltip() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton aria-label="Add item">
            <PlusSvg />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Add item</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export function SideTooltip() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton aria-label="Add item">
            <PlusSvg />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">Add item</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function TrashSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <polyline points="3 6 5 6 21 6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

export function InstantTooltip() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <IconButton aria-label="Delete item">
            <TrashSvg />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Delete item</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
