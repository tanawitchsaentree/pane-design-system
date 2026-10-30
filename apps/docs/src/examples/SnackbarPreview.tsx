// @example A snackbar drawn in place
import { Snackbar } from 'pane-react';

export default function SnackbarPreview() {
  return <Snackbar preview open onOpenChange={() => {}} message="Message archived" action={{ label: 'Undo', altText: 'Undo from the Archive folder', onClick: () => {} }} />;
}
