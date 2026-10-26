'use client';

import type { CSSProperties } from 'react';
import { Flex, Spacer, Text, Button, IconButton } from 'dial-react';

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

function SearchSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function BasicFlex() {
  return (
    <Flex gap="300" align="center">
      <div style={swatch}>One</div>
      <div style={swatch}>Two</div>
      <div style={swatch}>Three</div>
    </Flex>
  );
}

export function FlexColumn() {
  return (
    <Flex direction="column" gap="200">
      <div style={swatch}>One</div>
      <div style={swatch}>Two</div>
      <div style={swatch}>Three</div>
    </Flex>
  );
}

export function FlexWithSpacer() {
  return (
    <Flex align="center" style={{ width: '100%' }}>
      <div style={swatch}>Label</div>
      <Spacer />
      <div style={swatch}>Action</div>
    </Flex>
  );
}

export function FlexGap() {
  return (
    <Flex direction="column" gap="600">
      <div>
        <div style={caption}>gap=&quot;100&quot;</div>
        <Flex gap="100">
          <div style={swatch}>One</div>
          <div style={swatch}>Two</div>
          <div style={swatch}>Three</div>
        </Flex>
      </div>
      <div>
        <div style={caption}>gap=&quot;700&quot;</div>
        <Flex gap="700">
          <div style={swatch}>One</div>
          <div style={swatch}>Two</div>
          <div style={swatch}>Three</div>
        </Flex>
      </div>
    </Flex>
  );
}

export function FlexAlign() {
  return (
    <Flex direction="column" gap="300">
      <div>
        <div style={caption}>align=&quot;start&quot;</div>
        <Flex align="start" gap="200" style={{ ...frame, height: 100 }}>
          <div style={{ ...swatch, height: 40 }}>A</div>
          <div style={{ ...swatch, height: 80 }}>B</div>
          <div style={{ ...swatch, height: 60 }}>C</div>
        </Flex>
      </div>
      <div>
        <div style={caption}>align=&quot;stretch&quot;</div>
        <Flex align="stretch" gap="200" style={{ ...frame, height: 100 }}>
          <div style={swatch}>A</div>
          <div style={swatch}>B</div>
          <div style={swatch}>C</div>
        </Flex>
      </div>
      <div>
        <div style={caption}>align=&quot;end&quot;</div>
        <Flex align="end" gap="200" style={{ ...frame, height: 100 }}>
          <div style={{ ...swatch, height: 40 }}>A</div>
          <div style={{ ...swatch, height: 80 }}>B</div>
          <div style={{ ...swatch, height: 60 }}>C</div>
        </Flex>
      </div>
    </Flex>
  );
}

export function FlexJustify() {
  return (
    <Flex direction="column" gap="300">
      <div>
        <div style={caption}>justify=&quot;start&quot; (default)</div>
        <Flex justify="start" style={{ ...frame, width: '100%' }}>
          <div style={swatch}>Start</div>
          <div style={swatch}>Middle</div>
          <div style={swatch}>End</div>
        </Flex>
      </div>
      <div>
        <div style={caption}>justify=&quot;around&quot;</div>
        <Flex justify="around" style={{ ...frame, width: '100%' }}>
          <div style={swatch}>Start</div>
          <div style={swatch}>Middle</div>
          <div style={swatch}>End</div>
        </Flex>
      </div>
      <div>
        <div style={caption}>justify=&quot;evenly&quot;</div>
        <Flex justify="evenly" style={{ ...frame, width: '100%' }}>
          <div style={swatch}>Start</div>
          <div style={swatch}>Middle</div>
          <div style={swatch}>End</div>
        </Flex>
      </div>
    </Flex>
  );
}

export function FlexWrap() {
  return (
    <Flex direction="column" gap="300">
      <div>
        <div style={caption}>wrap=&quot;nowrap&quot; (default)</div>
        <Flex wrap="nowrap" gap="200" style={{ ...frame, width: 220, overflow: 'auto' }}>
          <div style={swatch}>Item 1</div>
          <div style={swatch}>Item 2</div>
          <div style={swatch}>Item 3</div>
          <div style={swatch}>Item 4</div>
        </Flex>
      </div>
      <div>
        <div style={caption}>wrap=&quot;wrap-reverse&quot;</div>
        <Flex wrap="wrap-reverse" gap="200" style={{ ...frame, width: 220 }}>
          <div style={swatch}>Item 1</div>
          <div style={swatch}>Item 2</div>
          <div style={swatch}>Item 3</div>
          <div style={swatch}>Item 4</div>
        </Flex>
      </div>
    </Flex>
  );
}

export function FlexToolbar() {
  return (
    <Flex align="center" gap="200" style={{ width: '100%' }}>
      <Text weight="semibold">Dashboard</Text>
      <Spacer />
      <IconButton aria-label="Search">
        <SearchSvg />
      </IconButton>
      <IconButton aria-label="Notifications">
        <BellSvg />
      </IconButton>
      <Button intent="primary" size="sm">
        New project
      </Button>
    </Flex>
  );
}
