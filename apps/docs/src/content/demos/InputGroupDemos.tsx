'use client';

import { Input, InputGroup } from 'dial-react';

export function BasicInputGroup() {
  return (
    <InputGroup prefix="$" suffix="USD">
      <Input placeholder="0.00" />
    </InputGroup>
  );
}

export function SuffixOnlyInputGroup() {
  return (
    <InputGroup suffix="kg">
      <Input placeholder="Weight" />
    </InputGroup>
  );
}

export function WrapInputGroup() {
  return (
    <div style={{ maxWidth: '160px' }}>
      <InputGroup prefix="https://" suffix=".com" wrap="wrap">
        <Input placeholder="example" />
      </InputGroup>
    </div>
  );
}

export function JustifyInputGroup() {
  return (
    <InputGroup prefix="$" suffix="USD" justify="between">
      <Input placeholder="0.00" />
    </InputGroup>
  );
}

export function InputGroupFormComposition() {
  return (
    <InputGroup prefix="@">
      <Input placeholder="username" aria-label="Username" />
    </InputGroup>
  );
}
