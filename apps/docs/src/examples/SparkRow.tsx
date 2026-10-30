// @example Trends in a list
import { Card, Flex, Sparkline, Text } from 'pane-react';

export default function SparkRow() {
  return <Card as="div" className="demo-card"><Flex direction="column" gap="md">{[['Lofoten, March', [9, 11, 10, 14, 15, 18], 'rising'], ['Senja at night', [12, 10, 9, 8, 8, 7], 'falling']].map(([n, v, w]) => <Flex key={n as string} gap="md" align="center"><Text>{n as string}</Text><Sparkline label={`${n}, sales ${w}`} values={v as number[]} /></Flex>)}</Flex></Card>;
}
