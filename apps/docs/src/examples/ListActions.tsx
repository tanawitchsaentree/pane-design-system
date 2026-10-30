// @example Rows that run an action
import { List, ListItem } from 'pane-react';

export default function ListActions() {
  return <List label="Print actions"><ListItem title="Duplicate" onClick={() => {}} /><ListItem title="Move to an album" onClick={() => {}} chevron /><ListItem title="Download the original" onClick={() => {}} /></List>;
}
