import { flushSync } from 'react-dom';
// The shell's light half of the kit: contexts, Link and the verification types. App and the nav import
// this, never kit.tsx, so the first chunk stays small (pages load kit.tsx with their own content).
import { createContext, useContext, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { navigate } from './router';

// ---------- verification data (loaded once by the shell) ----------
export interface GroupResult { texts: number; worst: number | null; failures: number }
export interface Evidence {
  generatedAt: string; browser: string; threshold: number; modes: string[]; themes?: string[]; exceptionFloor?: number;
  harness: Record<string, Record<string, Record<string, GroupResult>>>;
  docsPage: Record<string, Record<string, { textElements: number; failures: number }>>;
  summary: { gatingChecks: number; gatingFailures: number; excepted?: number; informational: string[] };
}
export interface Conformance { generatedAt: string; passed: number; total: number; checks: Array<{ component: string; name: string; ok: boolean; detail?: string }> }
export const VerifyContext = createContext<{ evidence: Evidence | null; conformance: Conformance | null }>({ evidence: null, conformance: null });
export const useVerify = () => useContext(VerifyContext);
export const SceneContext = createContext<string>('room');
export const useScene = () => useContext(SceneContext);

// ---------- navigation ----------
export function Link({ to, children, ...rest }: { to: string; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & Record<`data-${string}`, string>) {
  return (
    <a {...rest} href={to} onClick={(e) => { if (e.metaKey || e.ctrlKey) return; e.preventDefault(); navigate(to); }}>
      {children}
    </a>
  );
}


/** Runs a change of theme, brand, material or backdrop as one soft cross-fade (the View Transitions API),
 *  so the page does not snap; with reduced motion, or where the API is missing, it just runs. */
export function smooth(fn: () => void) {
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (!d.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { fn(); return; }
  d.startViewTransition(() => flushSync(fn));
}
