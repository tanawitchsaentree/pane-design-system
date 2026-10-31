export type BrandFile = { name?: string; description?: string; tokens?: Record<string, string | { dark: string; light?: string }> };
export declare function ratio(a: [number, number, number], b: [number, number, number]): number;
export declare const PAGE: { dark: [number, number, number]; light: [number, number, number] };
export declare function checkBrand(brand: BrandFile, brandable?: Set<string>): string[];
