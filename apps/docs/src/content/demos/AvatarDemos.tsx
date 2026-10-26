'use client';

import { Avatar } from 'dial-react';

export function BasicAvatar() {
  return <Avatar src="https://i.pravatar.cc/80?img=12" alt="Jordan Lee" fallback="JL" />;
}

export function AvatarFallback() {
  return <Avatar fallback="AK" alt="Amara Khan" />;
}

export function AvatarSizesShapes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)' }}>
      <Avatar size="sm" fallback="SM" alt="Sam" />
      <Avatar size="md" fallback="MD" alt="Mia Diaz" />
      <Avatar size="lg" fallback="LG" alt="Leo Gray" shape="square" />
    </div>
  );
}

export function AvatarSizeLadder() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)' }}>
      <Avatar size="xs" fallback="XS" alt="Extra small" />
      <Avatar size="sm" fallback="SM" alt="Small" />
      <Avatar size="md" fallback="MD" alt="Medium" />
      <Avatar size="lg" fallback="LG" alt="Large" />
      <Avatar size="xl" fallback="XL" alt="Extra large" />
      <Avatar size="2xl" fallback="2X" alt="2X large" />
    </div>
  );
}

export function AvatarShapes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)' }}>
      <Avatar shape="circle" fallback="CI" alt="Circle shape" />
      <Avatar shape="square" fallback="SQ" alt="Square shape" />
    </div>
  );
}
