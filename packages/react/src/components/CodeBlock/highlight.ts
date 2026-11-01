// A small, dependency-free highlighter (D-040): it splits code into runs with a syntax role, enough for the
// languages a design system's docs and product screens show. It never runs the code and never builds HTML,
// so a string from anywhere is safe to pass.
export type SyntaxRole = 'comment' | 'keyword' | 'string' | 'number' | 'function' | 'type' | 'tag' | 'attr' | 'property' | 'punctuation';
export type CodeLanguage = 'tsx' | 'ts' | 'jsx' | 'js' | 'css' | 'json' | 'bash' | 'html' | 'text';
export interface CodeRun { text: string; role?: SyntaxRole }

const KEYWORDS = new Set('import export from as default const let var function return if else for while do switch case break continue new await async try catch finally throw typeof instanceof in of class extends implements interface type enum public private protected readonly static void null undefined true false this super yield'.split(' '));

type Rule = [RegExp, SyntaxRole | ((m: RegExpExecArray) => CodeRun[])];

const script: Rule[] = [
  [/\/\/[^\n]*/y, 'comment'],
  [/\/\*[\s\S]*?\*\//y, 'comment'],
  [/`(?:\\[\s\S]|[^`\\])*`/y, 'string'],
  [/'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/y, 'string'],
  // a JSX tag name and the attribute names inside it
  [/(<\/?)([A-Za-z][\w.]*)/y, (m) => [{ text: m[1], role: 'punctuation' }, { text: m[2], role: /^[A-Z]/.test(m[2]) ? 'type' : 'tag' }]],
  [/\b(\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?|0x[\da-f]+)\b/iy, 'number'],
  [/[A-Za-z_$][\w$]*(?=\s*=(?!=))(?<=\s[A-Za-z_$][\w$]*)/y, 'attr'],
  [/[A-Za-z_$][\w$]*(?=\s*\()/y, 'function'],
  [/[A-Za-z_$][\w$]*/y, (m) => [{ text: m[0], role: KEYWORDS.has(m[0]) ? 'keyword' : /^[A-Z]/.test(m[0]) ? 'type' : undefined }]],
  [/[{}()[\];,.<>/=+\-*!?:&|]/y, 'punctuation'],
];
const css: Rule[] = [
  [/\/\*[\s\S]*?\*\//y, 'comment'],
  [/'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/y, 'string'],
  [/--[\w-]+/y, 'property'],
  [/[a-z-]+(?=\s*:(?!:))/y, 'property'],
  [/#[\da-f]{3,8}\b/iy, 'number'],
  [/-?\d*\.?\d+(?:px|rem|em|%|ms|s|deg|vh|vw|fr)?/y, 'number'],
  [/[a-z-]+(?=\()/y, 'function'],
  [/[.#]?[A-Za-z_][\w-]*/y, (m) => [{ text: m[0], role: /^[.#]/.test(m[0]) ? 'tag' : undefined }]],
  [/[{}():;,>+~*]/y, 'punctuation'],
];
const json: Rule[] = [
  [/"(?:\\.|[^"\\])*"(?=\s*:)/y, 'property'],
  [/"(?:\\.|[^"\\])*"/y, 'string'],
  [/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/iy, 'number'],
  [/\b(?:true|false|null)\b/y, 'keyword'],
  [/[{}[\],:]/y, 'punctuation'],
];
const bash: Rule[] = [
  [/#[^\n]*/y, 'comment'],
  [/'[^']*'|"(?:\\.|[^"\\])*"/y, 'string'],
  [/(^|(?<=[|;&]\s*)|(?<=\n))[A-Za-z][\w.-]*/y, 'function'],
  [/--?[\w-]+/y, 'attr'],
  [/[|;&<>]/y, 'punctuation'],
];
const html: Rule[] = [
  [/<!--[\s\S]*?-->/y, 'comment'],
  [/(<\/?)([A-Za-z][\w-]*)/y, (m) => [{ text: m[1], role: 'punctuation' }, { text: m[2], role: 'tag' }]],
  [/[A-Za-z-]+(?==)/y, 'attr'],
  [/"[^"]*"|'[^']*'/y, 'string'],
  [/[<>/=]/y, 'punctuation'],
];
const RULES: Record<CodeLanguage, Rule[]> = { tsx: script, ts: script, jsx: script, js: script, css, json, bash, html, text: [] };

/** Splits code into runs with a role. Text that matches no rule keeps the code's own colour. */
export function highlight(code: string, language: CodeLanguage = 'tsx'): CodeRun[] {
  const rules = RULES[language] ?? [];
  const out: CodeRun[] = [];
  let plain = '';
  const flush = () => { if (plain) { out.push({ text: plain }); plain = ''; } };
  for (let i = 0; i < code.length;) {
    let hit = false;
    for (const [re, role] of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m.index === i && m[0].length) {
        flush();
        if (typeof role === 'function') out.push(...role(m)); else out.push({ text: m[0], role });
        i += m[0].length; hit = true; break;
      }
    }
    if (!hit) { plain += code[i]; i++; }
  }
  flush();
  return out;
}
