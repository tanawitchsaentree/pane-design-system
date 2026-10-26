'use client';

import { Stat, Card } from 'dial-react';

export function BasicStat() {
  return <Stat label="Total revenue" value="$12,450" />;
}

export function StatWithTrend() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Stat
        label="Total revenue"
        value="$12,450"
        trend={{ direction: 'up', value: '+12% this month' }}
        description="Compared to last month"
      />
      <Stat
        label="Churn rate"
        value="2.1%"
        trend={{ direction: 'down', value: '-0.4% this month' }}
        description="Compared to last month"
      />
      <Stat label="Active users" value="1,204" trend={{ direction: 'neutral', value: 'No change' }} />
    </div>
  );
}

export function StatDashboardRow() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Card.Root style={{ flex: 1 }}>
        <Card.Body>
          <Stat
            label="Total revenue"
            value="$12,450"
            trend={{ direction: 'up', value: '+12% this month' }}
          />
        </Card.Body>
      </Card.Root>
      <Card.Root style={{ flex: 1 }}>
        <Card.Body>
          <Stat
            label="Churn rate"
            value="2.1%"
            trend={{ direction: 'down', value: '-0.4% this month' }}
          />
        </Card.Body>
      </Card.Root>
      <Card.Root style={{ flex: 1 }}>
        <Card.Body>
          <Stat label="Active users" value="1,204" trend={{ direction: 'neutral', value: 'No change' }} />
        </Card.Body>
      </Card.Root>
    </div>
  );
}
