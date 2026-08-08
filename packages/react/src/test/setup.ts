import '@testing-library/jest-dom/vitest';
import { toHaveNoViolations } from 'jest-axe';
import { expect, vi } from 'vitest';

// jest-axe ships a Jest-style matcher; vitest's expect is Jest-API-compatible so this extends cleanly.
expect.extend(toHaveNoViolations);

// jsdom does not implement ResizeObserver, but Radix's Popper-based primitives (Popover/Tooltip/
// Dialog positioning, W4 overlays) read element size via `@radix-ui/react-use-size`, which needs
// this to exist at all (not to actually report sizes — jsdom has no layout engine anyway).
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as unknown as typeof ResizeObserver;
}

// jsdom also has no PointerEvent capture API (`hasPointerCapture`/`releasePointerCapture`/
// `setPointerCapture` throw "not implemented" from `@radix-ui/react-use-size`'s dismissable-layer
// pointer handling) — no-op stubs are sufficient since jsdom never actually performs pointer
// capture regardless.
if (typeof window !== 'undefined' && window.HTMLElement) {
  if (!window.HTMLElement.prototype.hasPointerCapture) {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
  }
  if (!window.HTMLElement.prototype.setPointerCapture) {
    window.HTMLElement.prototype.setPointerCapture = vi.fn();
  }
  if (!window.HTMLElement.prototype.releasePointerCapture) {
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  }
  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  }
}
