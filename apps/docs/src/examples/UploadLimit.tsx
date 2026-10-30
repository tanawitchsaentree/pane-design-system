// @example A small size limit
import { Card, FileUpload } from 'pane-react';

export default function UploadLimit() {
  return <Card as="div" className="demo-card"><FileUpload label="Licence" accept=".pdf" maxSize={2 * 1024 * 1024} hint="PDF up to 2 MB" /></Card>;
}
