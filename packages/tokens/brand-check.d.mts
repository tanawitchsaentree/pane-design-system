export type BrandFile = { name?: string; description?: string; tier?: 'brand' | 'expert'; density?: 'compact' | 'regular' | 'roomy'; motion?: 'brisk' | 'steady' | 'calm'; tokens?: Record<string, string | { dark: string; light?: string }> };
export declare function ratio(a: [number, number, number], b: [number, number, number]): number;
export declare const PAGE: { dark: [number, number, number]; light: [number, number, number] };
export declare function checkBrand(brand: BrandFile, brandable?: Set<string>): string[];
export declare const BRANDABLE: Set<string>;
export declare const SPACE_STEPS: string[];
export declare const DENSITY: Record<'compact' | 'regular' | 'roomy', number>;
export declare const TEMPO: Record<'brisk' | 'steady' | 'calm', Record<string, string>>;
export declare function expandBrand(brand: BrandFile, paths: string[], refOf: (path: string) => string | null): { tokens: Record<string, string | { dark: string; light?: string }>; errors: string[] };
