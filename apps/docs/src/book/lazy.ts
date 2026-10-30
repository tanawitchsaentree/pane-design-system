// Content a route loads for itself. A route's loader fills the cache before the page is shown, so
// the page reads every value synchronously and paints whole; `read` suspends only if a loader missed one.
import { use } from 'react';

export interface Lazy<T> { get: (key: string) => T | undefined; load: (key: string) => Promise<T | undefined>; read: (key: string) => T | undefined }

export function lazyMap<T>(loaders: Record<string, () => Promise<T>>): Lazy<T> {
  const done = new Map<string, T>();
  const pending = new Map<string, Promise<T | undefined>>();
  const load = (key: string) => {
    if (!loaders[key]) return Promise.resolve(undefined);
    let p = pending.get(key);
    if (!p) { p = loaders[key]().then((v) => { done.set(key, v); return v; }); pending.set(key, p); }
    return p;
  };
  return { get: (key) => done.get(key), load, read: (key) => (done.has(key) || !loaders[key] ? done.get(key) : use(load(key))) };
}
