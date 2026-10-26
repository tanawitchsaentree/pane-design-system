import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Read at build time from `packages/react/package.json` itself — never hand-typed — so the
 * navbar's version label can never drift from what actually ships. Single source across the
 * monorepo today (`dial-react` and `dial-tokens` are versioned together); if that ever changes,
 * this should read whichever package the navbar means to represent.
 */
const REACT_PACKAGE_JSON = path.join(process.cwd(), '..', '..', 'packages', 'react', 'package.json');

export const REACT_PACKAGE_VERSION: string = JSON.parse(readFileSync(REACT_PACKAGE_JSON, 'utf8')).version;
