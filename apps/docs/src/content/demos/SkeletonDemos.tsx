'use client';

import { Skeleton, Card, Stack, Flex } from 'dial-react';

export function BasicSkeleton() {
  return <Skeleton width="240px" />;
}

export function SkeletonVariants() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)' }}>
      <Skeleton variant="circle" width={40} height={40} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
        <Skeleton variant="text" width={160} />
        <Skeleton variant="text" width={100} />
      </div>
      <Skeleton variant="rect" width={80} height={60} />
    </div>
  );
}

export function SkeletonCardLoading() {
  return (
    <Card.Root style={{ maxWidth: 320 }}>
      <Card.Media ratio="video">
        <Skeleton variant="rect" width="100%" height="100%" />
      </Card.Media>
      <Card.Body>
        <Stack gap="200">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="90%" />
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

export function SkeletonListLoading() {
  return (
    <Stack gap="300" style={{ maxWidth: 320 }}>
      <Flex align="center" gap="200">
        <Skeleton variant="circle" width={32} height={32} />
        <Stack gap="100" style={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="35%" />
        </Stack>
      </Flex>
      <Flex align="center" gap="200">
        <Skeleton variant="circle" width={32} height={32} />
        <Stack gap="100" style={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="35%" />
        </Stack>
      </Flex>
      <Flex align="center" gap="200">
        <Skeleton variant="circle" width={32} height={32} />
        <Stack gap="100" style={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="35%" />
        </Stack>
      </Flex>
    </Stack>
  );
}
