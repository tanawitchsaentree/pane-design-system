import '@testing-library/jest-dom/vitest';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

// jest-axe ships a Jest-style matcher; vitest's expect is Jest-API-compatible so this extends cleanly.
expect.extend(toHaveNoViolations);
