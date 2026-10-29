// @example Rows with values at the end
import { List, ListItem } from 'pane-react';

export default function ListFiles() {
  return <List label="Exports"><ListItem title="Lofoten, March.tif" description="Exported today" trailing="84 MB" /><ListItem title="Senja at night.tif" description="Exported yesterday" trailing="71 MB" /><ListItem title="Höfn harbour.jpg" description="Exported 2 March" trailing="9 MB" /></List>;
}
