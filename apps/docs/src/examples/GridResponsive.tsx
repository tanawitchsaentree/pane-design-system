// @example Responsive spans
import { Card, Grid, GridItem } from 'pane-react';

export default function GridResponsive() {
  return (
    <Grid className="demo-full">
      {['Followers', 'Posts', 'Saved'].map((k) => (
        <GridItem key={k} span="full" md={4} lg={4}>
          <Card as="div"><p className="flush muted">{k}</p><p className="flush stat-num">{k.length * 97}</p></Card>
        </GridItem>
      ))}
    </Grid>
  );
}
