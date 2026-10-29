// @example The thin line inside a row
import { Card, Flex, Progress, Text } from 'pane-react';

export default function ProgressSmall() {
  return <Card as="div" className="demo-card"><Flex direction="column" gap="sm"><Text weight="semibold">Lofoten, March</Text><Progress label="Syncing 24 of 40 photos" size="sm" value={24} max={40} valueText="24 of 40" showValue /></Flex></Card>;
}
