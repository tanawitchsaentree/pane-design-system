import { withCustomConfig } from 'react-docgen-typescript';
import path from 'node:path';

/**
 * Reads a component's real prop types straight from its .tsx source with react-docgen-typescript
 * — never hand-typed. This is what <PropsTable> calls at build time (this app is statically
 * exported, so "build time" is the only time this ever runs).
 */

const REACT_PKG_ROOT = path.join(process.cwd(), '..', '..', 'packages', 'react');
const TSCONFIG_PATH = path.join(REACT_PKG_ROOT, 'tsconfig.json');

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | null;
  description: string;
}

const parser = withCustomConfig(TSCONFIG_PATH, {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Without a filter, ComponentPropsWithoutRef<'button'> (etc.) pulls in every native HTML
  // attribute React's own types declare — onClick, aria-*, tabIndex, 280+ rows for Button alone.
  // Keep only props actually declared inside this repo's own component source, so the table shows
  // Dial's real custom API, not React/DOM's.
  propFilter: (prop) => {
    if (!prop.declarations || prop.declarations.length === 0) return true;
    return prop.declarations.some((d) => d.fileName.includes('/packages/react/src/'));
  },
});

/**
 * @param componentPath Path relative to packages/react/src, e.g. "components/Button/Button.tsx".
 * @param displayName The component's real `.displayName` as set in its source, e.g. "Button" or
 *   "Card.Header" for a compound sub-component — NOT the TS prop-interface name ("ButtonProps"
 *   never matches anything real; every component in this repo sets `.displayName` explicitly).
 *   Omit only when the file exports exactly one component doc.
 */
export function getPropsDoc(componentPath: string, displayName?: string): PropDoc[] {
  const fullPath = path.join(REACT_PKG_ROOT, 'src', componentPath);
  const docs = parser.parse(fullPath);

  if (docs.length === 0) {
    throw new Error(`react-docgen-typescript found no component docs in ${fullPath}`);
  }

  if (!displayName) {
    if (docs.length > 1) {
      throw new Error(
        `${fullPath} exports ${docs.length} component docs (${docs.map((d) => d.displayName).join(', ')}) — pass displayName to pick one.`,
      );
    }
    return toPropDocs(docs[0]);
  }

  const doc = docs.find((d) => d.displayName === displayName);
  if (!doc) {
    throw new Error(
      `No component doc named "${displayName}" in ${fullPath} — found: ${docs.map((d) => d.displayName).join(', ')}`,
    );
  }

  return toPropDocs(doc);
}

function toPropDocs(doc: import('react-docgen-typescript').ComponentDoc): PropDoc[] {
  return Object.entries(doc.props).map(([name, prop]) => ({
    name,
    type: prop.type.name,
    required: prop.required,
    defaultValue: prop.defaultValue ? String(prop.defaultValue.value) : extractDefaultFromDescription(prop.description),
    description: prop.description,
  }));
}

/** react-docgen-typescript only picks up a JSDoc @default tag or a destructured default value —
 * this codebase instead writes "Default `'x'`." inline in the prop's doc comment (see
 * Button.tsx), so this extracts that convention as a fallback rather than leaving it blank. */
function extractDefaultFromDescription(description: string): string | null {
  const match = description.match(/Default `([^`]+)`/);
  return match ? match[1] : null;
}
