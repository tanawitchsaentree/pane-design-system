// @example Main content with a sidebar
import { Card, Grid, GridItem } from 'pane-react';

export default function GridPage() {
  return (
    <Grid className="demo-full">
      <GridItem span="full" lg={8}><Card as="section" aria-labelledby="gp-main"><h3 id="gp-main" className="flush">Feed</h3><p className="flush muted">8 of 12 columns from lg up; full width below.</p></Card></GridItem>
      <GridItem span="full" lg={4}><Card as="aside" aria-labelledby="gp-side"><h3 id="gp-side" className="flush">Trends</h3><p className="flush muted">4 of 12 columns from lg up.</p></Card></GridItem>
    </Grid>
  );
}
