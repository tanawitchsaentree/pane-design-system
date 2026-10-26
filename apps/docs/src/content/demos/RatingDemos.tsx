'use client';

import { useState } from 'react';
import { Rating } from 'dial-react';

export function BasicRating() {
  const [value, setValue] = useState(3);
  return <Rating name="product-rating" aria-label="Rate this product" value={value} onChange={setValue} />;
}

export function RatingReadOnly() {
  return <Rating name="average-rating" aria-label="Average rating" value={4} readOnly />;
}

export function RatingMax() {
  return <Rating name="ten-star-rating" aria-label="Rate out of 10" max={10} defaultValue={7} />;
}

export function RatingDisabled() {
  return <Rating name="disabled-rating" aria-label="Rate this product" defaultValue={2} disabled />;
}

export function RatingControlledVsUncontrolled() {
  const [value, setValue] = useState(3);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <div>
        <div>Controlled (value/onChange, state lives outside): {value}</div>
        <Rating name="controlled-demo" aria-label="Controlled rating" value={value} onChange={setValue} />
      </div>
      <div>
        <div>Uncontrolled (defaultValue, state lives in the DOM)</div>
        <Rating name="uncontrolled-demo" aria-label="Uncontrolled rating" defaultValue={3} />
      </div>
    </div>
  );
}
