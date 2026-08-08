---
name: ds-conventions
description: มาตรฐานกลางของ design system นี้ — Anatomy Contract 9 ข้อ, naming, โครงไฟล์ component, กฎ token ใช้ทุกครั้งที่สร้างหรือรีวิว component/token หรือเมื่อสงสัยว่ามาตรฐานคืออะไร
---

# DS Conventions

## Anatomy Contract — Definition of Done ของทุก component (ครบ 9 ข้อเท่านั้นถึงนับว่าเสร็จ)
1. Anatomy: ชิ้นส่วนภายในมีชื่อครบ
2. Variants ประกาศครบ (เช่น Button: solid/outline/ghost/link × primary/neutral/danger)
3. Sizes ตาม t-shirt mapping ที่ lock ใน system/DECISIONS.md
4. States: default, hover, active, focus-visible, disabled + loading/error/read-only/indeterminate/selected ตามที่เกี่ยว
5. Tokens consumed: ลิสต์ component tokens ทั้งหมด — ไม่มีค่าดิบ
6. A11y spec: role/ARIA, keyboard map, focus behavior, SR notes
7. API: TS interface + defaults + forwardRef + asChild (ถ้า interactive) + controlled/uncontrolled (ถ้า input)
8. Stories: ทุก variant × size + states + playground
9. Docs page: demo, code, API table, Do/Don't, a11y, related

## โครงไฟล์ต่อ component
```
packages/react/src/components/{Name}/
├── {Name}.tsx
├── {Name}.module.css      # CSS vars เท่านั้น, logical properties เท่านั้น
├── {Name}.stories.tsx
├── {Name}.test.tsx        # interaction + axe
└── index.ts
```
Token ของมัน: `packages/tokens/src/component/{name}.json`

## Naming
- Tokens: `{category}.{concept}.{property}.{variant}.{state}` · space.* ≠ size.* (คนละ namespace)
- CSS vars: `--ds-{token-path-kebab}` เช่น `--ds-button-bg-primary-default`
- Components: PascalCase · props: camelCase · variant values: lowercase

## ลำดับ dependency (ห้ามข้าม)
Layout primitives (Box, Stack, Grid, Container) → Tier 1 atoms → Tier 2 molecules → Tier 3 organisms
