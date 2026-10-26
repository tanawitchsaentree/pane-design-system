// @example Container around a grid
import { Card, Container, Grid, GridItem } from 'pane-react';

export default function ContainerWithGrid() {
  return (
    <Container size="xl" className="demo-full">
      <Grid>
        <GridItem span="full" md={4} lg={3}><Card as="div"><p className="flush">Sidebar</p></Card></GridItem>
        <GridItem span="full" md={4} lg={9}><Card as="div"><p className="flush">Content</p></Card></GridItem>
      </Grid>
    </Container>
  );
}
