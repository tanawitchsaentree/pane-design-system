import { createContext, useContext, type ReactNode } from 'react';
import en, { type PaneMessages } from './en';

type DeepPartial<T> = { [K in keyof T]?: T[K] extends (...a: never[]) => unknown ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K] };
interface PaneContextValue { messages: PaneMessages; locale?: string }
const PaneContext = createContext<PaneContextValue>({ messages: en });

const merge = (base: PaneMessages, over?: DeepPartial<PaneMessages>): PaneMessages => {
  if (!over) return base;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = v && typeof v === 'object' && !Array.isArray(v) ? { ...(base as unknown as Record<string, object>)[k], ...v } : v;
  return out as PaneMessages;
};

export interface PaneProviderProps {
  /** The catalog every Pane component reads its words from: `en` (the default), `th`, or your own. */
  messages?: PaneMessages;
  /** A few words to change on top of `messages`, such as { loadMore: 'Show more' }. */
  overrides?: DeepPartial<PaneMessages>;
  /** A BCP 47 locale for dates, numbers and month names, such as th-TH, which also gives the Buddhist year. */
  locale?: string;
  /** The app. */
  children: ReactNode;
}

/** Sets the language of every Pane component below it: the words they show and speak, and the locale
 *  their dates and numbers are written in. Without it, components speak English in the browser's locale. */
export function PaneProvider({ messages = en, overrides, locale, children }: PaneProviderProps) {
  return <PaneContext.Provider value={{ messages: merge(messages, overrides), locale }}>{children}</PaneContext.Provider>;
}
/** The catalog in force: the provider's, or English. */
export const useMessages = () => useContext(PaneContext).messages;
/** The locale in force, if the provider set one. */
export const useLocale = () => useContext(PaneContext).locale;
