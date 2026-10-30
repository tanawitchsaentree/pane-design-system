// @example Saving, with the width held
import { Button, Card, Flex } from 'pane-react';

export default function ButtonLoading() {
  return <Card as="div" className="demo-card"><Flex gap="md"><Button loading>Save changes</Button><Button variant="glass">Cancel</Button></Flex></Card>;
}
