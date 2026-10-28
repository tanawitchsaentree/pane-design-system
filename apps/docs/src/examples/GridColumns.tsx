// @example A grid with a fixed column count
import { Card, Grid, GridItem } from 'pane-react';

export default function GridColumns() {
  return (
    <Grid columns={3} className="demo-full">
      {['Room', 'Forest', 'City'].map((s) => <GridItem key={s} span={1}><Card as="div"><p className="flush">{s}</p></Card></GridItem>)}
    </Grid>
  );
}
