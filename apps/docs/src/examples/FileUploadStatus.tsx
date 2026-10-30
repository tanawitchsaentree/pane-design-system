// @example Each file says where its upload has got to
import { FileUpload } from 'pane-react';

const FILES = [new File(['x'.repeat(2400)], 'receipt-march.pdf'), new File(['x'.repeat(1200)], 'receipt-april.pdf'), new File(['x'.repeat(800)], 'scan.jpg')];
const STATE = [{ state: 'done' as const }, { state: 'uploading' as const, progress: 60 }, { state: 'error' as const, message: 'The connection dropped.' }];

export default function FileUploadStatus() {
  return <FileUpload label="Receipts" multiple files={FILES} status={(_, i) => STATE[i]} onRetry={() => {}} />;
}
