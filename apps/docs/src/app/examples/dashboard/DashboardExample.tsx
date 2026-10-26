'use client';

/**
 * Example template — skeleton: persistent-shell (docs-engine-v2 template-catalog.md). The one
 * BUILDABLE-WITH-GAPS template this run: `packages/react` has no dedicated AppShell/Sidebar/
 * Navbar component (confirmed by directory listing, PLAN.md's inventory scan) — the persistent
 * left nav + top bar below is composed entirely from real layout primitives (`Box`, `Flex`,
 * `Stack`, `Divider`) plus `next/link` for real client-side routing. This is the CATALOG SIGNAL
 * this template exists specifically to surface — logged once in BACKLOG.md rather than treated
 * as a blocker, since composing a shell from primitives is real, valid usage, not a workaround.
 *
 * Composes Stat + Card + Table + Badge + Button + IconButton + Divider + Flex + Stack + Box +
 * Link(next/link, not dial-react — see above), 10 distinct dial-react components spanning Data
 * Display (Stat, Table, Badge, Card), Atoms (Button, IconButton), and Layout (Divider, Flex,
 * Stack, Box) — clears the ≥8/≥3-categories composition floor with room to spare.
 *
 * `"use client"` for the sidebar's active-link highlighting (needs `usePathname`).
 */
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Flex, Stack, Divider, Stat, Card, Table, Badge, Button, IconButton, Icon } from 'dial-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/examples/dashboard' },
  { label: 'Orders', href: '/examples/dashboard' },
  { label: 'Customers', href: '/examples/dashboard' },
  { label: 'Settings', href: '/examples/dashboard' },
];

const RECENT_ORDERS = [
  { id: '#3210', customer: 'Amara Khan', status: 'Fulfilled', total: '$128.00' },
  { id: '#3209', customer: 'Leo Gray', status: 'Processing', total: '$64.50' },
  { id: '#3208', customer: 'Mia Diaz', status: 'Fulfilled', total: '$212.00' },
  { id: '#3207', customer: 'Sam Okafor', status: 'Refunded', total: '$45.00' },
];

const STATUS_COLOR: Record<string, 'success' | 'info' | 'danger'> = {
  Fulfilled: 'success',
  Processing: 'info',
  Refunded: 'danger',
};

function BellSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
    </svg>
  );
}

export function DashboardExample() {
  const pathname = usePathname();

  return (
    <Flex style={{ minHeight: '100vh' }}>
      <Box
        style={{
          width: '220px',
          flexShrink: 0,
          borderInlineEnd: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
          backgroundColor: 'var(--ds-color-surface-raised)',
          padding: 'var(--ds-space-inset-md)',
        }}
      >
        <Stack gap="200">
          <Box style={{ fontWeight: 'var(--ds-font-weight-semibold)', padding: 'var(--ds-space-inset-sm)' }}>Acme Admin</Box>
          <Divider />
          <Stack gap="100">
            {NAV_ITEMS.map((item) => (
              <NextLink
                key={item.label}
                href={item.href}
                style={{
                  display: 'block',
                  padding: 'var(--ds-space-inset-sm)',
                  borderRadius: 'var(--ds-radius-sm)',
                  textDecoration: 'none',
                  color: pathname === item.href ? 'var(--ds-color-text-default)' : 'var(--ds-color-text-subtle)',
                  backgroundColor: pathname === item.href ? 'var(--ds-color-surface-canvas)' : 'transparent',
                  fontWeight: pathname === item.href ? 'var(--ds-font-weight-medium)' : 'var(--ds-font-weight-regular)',
                }}
              >
                {item.label}
              </NextLink>
            ))}
          </Stack>
        </Stack>
      </Box>

      <Box style={{ flex: 1, backgroundColor: 'var(--ds-color-surface-canvas)' }}>
        <Flex
          align="center"
          justify="between"
          style={{
            padding: 'var(--ds-space-inset-md)',
            borderBlockEnd: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
            backgroundColor: 'var(--ds-color-surface-raised)',
          }}
        >
          <Box style={{ fontWeight: 'var(--ds-font-weight-medium)' }}>Overview</Box>
          <Flex align="center" gap="200">
            <IconButton aria-label="Notifications" variant="ghost">
              <Icon>
                <BellSvg />
              </Icon>
            </IconButton>
            <Button intent="primary" size="sm">
              New order
            </Button>
          </Flex>
        </Flex>

        <Box style={{ padding: 'var(--ds-space-inset-lg)' }}>
          <Flex gap="400" wrap="wrap" style={{ marginBlockEnd: 'var(--ds-space-stack-lg)' }}>
            <Stat label="Total revenue" value="$48,204" trend={{ direction: 'up', value: '+12% this month' }} />
            <Stat label="Active customers" value="1,204" trend={{ direction: 'up', value: '+3.1%' }} />
            <Stat label="Refund rate" value="1.8%" trend={{ direction: 'down', value: '-0.4%' }} />
          </Flex>

          <Card.Root>
            <Card.Header>
              <Box style={{ fontWeight: 'var(--ds-font-weight-medium)' }}>Recent orders</Box>
            </Card.Header>
            <Card.Body style={{ padding: 0 }}>
              <Table.Root aria-label="Recent orders" density="compact">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Order</Table.HeaderCell>
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {RECENT_ORDERS.map((order) => (
                    <Table.Row key={order.id}>
                      <Table.Cell>{order.id}</Table.Cell>
                      <Table.Cell>{order.customer}</Table.Cell>
                      <Table.Cell>
                        <Badge variant="subtle" color={STATUS_COLOR[order.status]} size="sm">
                          {order.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>{order.total}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Card.Body>
          </Card.Root>
        </Box>
      </Box>
    </Flex>
  );
}
