// @example The responsive column grid
import { Card, Grid, GridItem } from 'pane-react';

export default function GridBasic() {
  return (
    <Grid className="demo-full">
      {Array.from({ length: 12 }, (_, i) => (
        <GridItem key={i} span={1}><Card as="div" className="grid-cell"><span>{i + 1}</span></Card></GridItem>
      ))}
    </Grid>
  );
}
