// @example Wrong, with the reason in words
import { Card, FileUpload, FormField } from 'pane-react';

export default function FileUploadInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Receipt" error="Add the receipt to claim the refund"><FileUpload label="Receipt" invalid accept=".pdf,image/*" /></FormField></Card>;
}
