'use client';

/**
 * Example template — skeleton: three-column-comparison (docs-engine-v2 template-catalog.md).
 * Composes RadioCards + Card + Badge + Button + Text + Heading + Divider + Container, 8 distinct
 * components spanning Selection (RadioCards), Data Display (Card, Badge), Atoms (Button, Text,
 * Heading), and Layout (Divider, Container) — passes the composition floor.
 *
 * `"use client"` for RadioCards' controlled `value`/`onChange` state.
 */
import { useState } from 'react';
import { Container, Heading, Text, RadioCards, Card, Badge, Button, Divider } from 'dial-react';

const PLANS = [
  { value: 'starter', name: 'Starter', price: '$9', tagline: 'For solo projects', features: ['1 project', 'Community support', '1 GB storage'] },
  { value: 'pro', name: 'Pro', price: '$29', tagline: 'For growing teams', features: ['Unlimited projects', 'Priority support', '50 GB storage', 'Custom domains'], highlight: true },
  { value: 'enterprise', name: 'Enterprise', price: 'Contact us', tagline: 'For large organizations', features: ['Everything in Pro', 'Dedicated support', 'SSO/SAML', 'Custom SLA'] },
];

export function PricingExample() {
  const [plan, setPlan] = useState('pro');

  return (
    <Container size="lg" style={{ paddingBlock: 'var(--ds-space-inset-lg)' }}>
      <div style={{ textAlign: 'center', marginBlockEnd: 'var(--ds-space-stack-lg)' }}>
        <Heading level={1} size="2xl">
          Simple, transparent pricing
        </Heading>
        <Text color="subtle">Choose the plan that fits your team. Cancel anytime.</Text>
      </div>

      <RadioCards
        name="pricing-plan"
        aria-label="Choose a plan"
        value={plan}
        onChange={setPlan}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--ds-space-inline-lg)' }}
      >
        {PLANS.map((p) => (
          <RadioCards.Item key={p.value} value={p.value} style={{ padding: 0 }}>
            <Card.Root style={{ border: 'none' }}>
              <Card.Body>
                {p.highlight && (
                  <Badge variant="solid" color="brand" size="sm" style={{ marginBlockEnd: 'var(--ds-space-stack-sm)' }}>
                    Most popular
                  </Badge>
                )}
                <Heading level={2} size="lg">
                  {p.name}
                </Heading>
                <Text color="subtle" size="sm">
                  {p.tagline}
                </Text>
                <Heading level={3} size="2xl" style={{ marginBlockStart: 'var(--ds-space-stack-md)' }}>
                  {p.price}
                  {p.price.startsWith('$') && (
                    <Text size="sm" color="subtle">
                      {' '}
                      /mo
                    </Text>
                  )}
                </Heading>
                <Divider style={{ marginBlock: 'var(--ds-space-stack-md)' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
                  {p.features.map((f) => (
                    <li key={f}>
                      <Text size="sm">{f}</Text>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card.Root>
          </RadioCards.Item>
        ))}
      </RadioCards>

      <div style={{ textAlign: 'center', marginBlockStart: 'var(--ds-space-stack-lg)' }}>
        <Button intent="primary" size="lg">
          Continue with {PLANS.find((p) => p.value === plan)?.name}
        </Button>
      </div>
    </Container>
  );
}
