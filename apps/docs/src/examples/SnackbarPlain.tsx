// @example A snackbar without an action
import { Snackbar } from 'pane-react';

export default function SnackbarPlain() {
  return <Snackbar preview open onOpenChange={() => {}} message="Link copied" />;
}
