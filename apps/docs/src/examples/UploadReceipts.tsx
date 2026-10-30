// @example Receipts for an expense
import { Card, FileUpload } from 'pane-react';

export default function UploadReceipts() {
  return <Card as="div" className="demo-card"><FileUpload label="Receipts" accept=".pdf,image/*" multiple maxSize={10 * 1024 * 1024} hint="PDF or a photo, up to 10 MB each" /></Card>;
}
