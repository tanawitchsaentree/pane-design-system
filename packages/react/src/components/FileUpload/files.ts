import type { PaneMessages } from '../../i18n/en';
/** Shared by FileUpload and Dropzone: checks chosen files against `accept` and `maxSize` and says why one was refused. */
export function sizeText(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export function check(files: File[], accept: string | undefined, maxSize: number | undefined, t: Pick<PaneMessages, 'fileType' | 'fileTooLarge'>) {
  const kinds = accept?.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean) ?? [];
  const ok: File[] = []; const refused: { file: File; reason: string }[] = [];
  for (const f of files) {
    const name = f.name.toLowerCase(); const type = f.type.toLowerCase();
    const fits = !kinds.length || kinds.some((k) => (k.startsWith('.') ? name.endsWith(k) : k.endsWith('/*') ? type.startsWith(k.slice(0, -1)) : type === k));
    if (!fits) refused.push({ file: f, reason: t.fileType(f.name) });
    else if (maxSize && f.size > maxSize) refused.push({ file: f, reason: t.fileTooLarge(f.name, sizeText(f.size), sizeText(maxSize)) });
    else ok.push(f);
  }
  return { ok, refused };
}
