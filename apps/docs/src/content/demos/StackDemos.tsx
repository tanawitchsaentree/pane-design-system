'use client';

import type { CSSProperties } from 'react';
import { Stack, Flex, Text, Switch, Card, IconButton, Divider } from 'dial-react';

const swatch: CSSProperties = {
  padding: 'var(--ds-space-inset-sm)',
  border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
  borderRadius: 'var(--ds-radius-sm)',
  background: 'var(--ds-color-role-brand-subtle-bg)',
  color: 'var(--ds-color-role-brand-subtle-text)',
};

const frame: CSSProperties = {
  border: 'var(--ds-border-width-hairline) dashed var(--ds-color-border-hairline)',
  borderRadius: 'var(--ds-radius-md)',
  padding: 'var(--ds-space-inset-sm)',
};

const caption: CSSProperties = {
  fontFamily: 'var(--ds-font-family-mono)',
  fontSize: 'var(--ds-font-size-xs)',
  color: 'var(--ds-color-text-subtle)',
};

function PlusSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function StarSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function TrashSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

export function BasicStack() {
  return (
    <Stack>
      <div style={swatch}>First block</div>
      <div style={swatch}>Second block</div>
      <div style={swatch}>Third block</div>
    </Stack>
  );
}

export function StackHorizontal() {
  return (
    <Stack direction="horizontal" gap="200">
      <div style={swatch}>First</div>
      <div style={swatch}>Second</div>
      <div style={swatch}>Third</div>
    </Stack>
  );
}

export function StackGap() {
  return (
    <Flex gap="600" align="start">
      <div>
        <div style={caption}>gap=&quot;100&quot;</div>
        <Stack gap="100">
          <div style={swatch}>One</div>
          <div style={swatch}>Two</div>
          <div style={swatch}>Three</div>
        </Stack>
      </div>
      <div>
        <div style={caption}>gap=&quot;900&quot;</div>
        <Stack gap="900">
          <div style={swatch}>One</div>
          <div style={swatch}>Two</div>
          <div style={swatch}>Three</div>
        </Stack>
      </div>
    </Flex>
  );
}

export function StackAlign() {
  return (
    <Stack gap="300">
      <div>
        <div style={caption}>align=&quot;start&quot;</div>
        <Stack direction="horizontal" align="start" gap="200" style={{ ...frame, height: 100 }}>
          <div style={{ ...swatch, height: 40 }}>A</div>
          <div style={{ ...swatch, height: 80 }}>B</div>
          <div style={{ ...swatch, height: 60 }}>C</div>
        </Stack>
      </div>
      <div>
        <div style={caption}>align=&quot;center&quot;</div>
        <Stack direction="horizontal" align="center" gap="200" style={{ ...frame, height: 100 }}>
          <div style={{ ...swatch, height: 40 }}>A</div>
          <div style={{ ...swatch, height: 80 }}>B</div>
          <div style={{ ...swatch, height: 60 }}>C</div>
        </Stack>
      </div>
      <div>
        <div style={caption}>align=&quot;end&quot;</div>
        <Stack direction="horizontal" align="end" gap="200" style={{ ...frame, height: 100 }}>
          <div style={{ ...swatch, height: 40 }}>A</div>
          <div style={{ ...swatch, height: 80 }}>B</div>
          <div style={{ ...swatch, height: 60 }}>C</div>
        </Stack>
      </div>
    </Stack>
  );
}

export function StackWrap() {
  return (
    <Stack gap="300">
      <div>
        <div style={caption}>wrap=&quot;nowrap&quot; (default)</div>
        <Stack direction="horizontal" wrap="nowrap" gap="200" style={{ ...frame, width: 220, overflow: 'auto' }}>
          <div style={swatch}>Item 1</div>
          <div style={swatch}>Item 2</div>
          <div style={swatch}>Item 3</div>
          <div style={swatch}>Item 4</div>
        </Stack>
      </div>
      <div>
        <div style={caption}>wrap=&quot;wrap&quot;</div>
        <Stack direction="horizontal" wrap="wrap" gap="200" style={{ ...frame, width: 220 }}>
          <div style={swatch}>Item 1</div>
          <div style={swatch}>Item 2</div>
          <div style={swatch}>Item 3</div>
          <div style={swatch}>Item 4</div>
        </Stack>
      </div>
    </Stack>
  );
}

export function StackJustify() {
  return (
    <Stack gap="300">
      <div>
        <div style={caption}>justify=&quot;start&quot; (default)</div>
        <Stack direction="horizontal" justify="start" style={{ ...frame, width: '100%' }}>
          <div style={swatch}>Start</div>
          <div style={swatch}>Middle</div>
          <div style={swatch}>End</div>
        </Stack>
      </div>
      <div>
        <div style={caption}>justify=&quot;between&quot;</div>
        <Stack direction="horizontal" justify="between" style={{ ...frame, width: '100%' }}>
          <div style={swatch}>Start</div>
          <div style={swatch}>Middle</div>
          <div style={swatch}>End</div>
        </Stack>
      </div>
    </Stack>
  );
}

export function StackInCard() {
  return (
    <Card.Root style={{ maxWidth: 320 }}>
      <Card.Header>Notification settings</Card.Header>
      <Card.Body>
        <Stack gap="300">
          <Flex justify="between" align="center">
            <Text>Email alerts</Text>
            <Switch defaultChecked aria-label="Email alerts" />
          </Flex>
          <Flex justify="between" align="center">
            <Text>SMS alerts</Text>
            <Switch aria-label="SMS alerts" />
          </Flex>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

export function StackToolbar() {
  return (
    <Stack direction="horizontal" align="center" gap="200">
      <IconButton aria-label="Add item">
        <PlusSvg />
      </IconButton>
      <IconButton aria-label="Favorite">
        <StarSvg />
      </IconButton>
      <Divider orientation="vertical" />
      <IconButton aria-label="Delete item">
        <TrashSvg />
      </IconButton>
    </Stack>
  );
}
