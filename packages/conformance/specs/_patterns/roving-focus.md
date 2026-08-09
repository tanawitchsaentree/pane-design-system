# Roving Focus Pattern — Listbox family (role="option")

> ต้นฉบับของ pattern นี้ — ห้ามก๊อป behavior/test นี้ไปเขียนใหม่ที่ component อื่น
> **import จริงจาก `../_roving-focus.ts`** เสมอ ไม่ว่าจะเป็น Select, Combobox, MultiSelect,
> TagInput's suggestion popup, หรือตัวไหนก็ตามที่ใช้ pattern นี้ต่อจากนี้ — ที่มา: VisuallyHidden's
> clip-pattern ถูกก๊อปแยกกัน 5 ที่ (Checkbox/Radio/Spinner/Switch) ก่อนแก้เป็น `composes:` ตอน
> w5-preflight — การเลียนแบบโดยไม่มีต้นฉบับที่ import ได้จริง = drift ทุกครั้งที่มีคนแก้ทีละจุด
> ไม่พร้อมกัน
>
> **แก้ตาม D-023 (lock หลังไฟล์นี้เขียนครั้งแรก):** RadioCards ไม่ใช่สมาชิกของ family นี้ — มันเข้า
> เกณฑ์ D-023 ข้อ 1 (native `<input type=radio>` grouped by `name` พอเอง) ไม่ใช่ข้อ 3 (React Aria
> collection stack) เพราะ role คนละอันจริง (`role="radio"` ไม่ใช่ `role="option"`) และ verified
> ด้วยการเปิดเบราว์เซอร์จริงแล้วว่า native radio ไม่ set `tabindex` DOM attribute ต่อ item เลย (ตัว
> `expectRovingTabindex` ข้างล่างเช็ค attribute นั้นตรงๆ ซึ่งจะ false-negative ถ้าเอาไปใช้กับ
> RadioCards) — RadioCards มี conformance spec ของตัวเอง (`w5-radiocards.spec.ts`) ที่ assert
> `document.activeElement`/`checked` โดยตรง ไม่ import จากไฟล์นี้

## ทำไมต้องแยกจาก Menu/ContextMenu (role="menuitem")

Listbox และ Menu **ดูคล้ายกันบนจอ** (รายการแนวตั้ง, เลือกด้วยลูกศร) แต่เป็นคนละ ARIA pattern ที่มี
keyboard contract ต่างกันจริง — ถ้า Menu ไปยืมฐานของ Listbox (หรือกลับกัน) จะได้ widget ที่ผิด
สัญญากับ screen reader user แม้จะ "ดูทำงานถูก" บนจอ:

| | Listbox (`role="option"`) | Menu (`role="menuitem"`) |
|---|---|---|
| หน้าที่ | **เลือกค่า** (selection state คงอยู่) | **สั่งการ** (เลือกแล้ว action เกิดทันที ปิดเมนู) |
| Enter/Space | เลือก option, listbox **ไม่ปิด** เสมอไป (ขึ้นกับ single/multi-select) | trigger action แล้ว**ปิดเมนูทันที** |
| aria-selected | ใช้ (บอกว่า option นี้ถูกเลือกอยู่หรือไม่) | ไม่ใช้ (menuitem ไม่มี "selected state" ค้าง) |
| Escape | ปิด popup ที่ครอบ (ถ้ามี) แต่ตัว listbox เองไม่มี concept "ปิดตัวเอง" | ปิดเมนูเสมอ |
| Typeahead | ใช่ (พิมพ์ตัวอักษรกระโดดไป option) | ใช่ แต่ scope ของ shortcut ต่างกัน (menu มักมี access key ผสม) |

**กฎ:** Menu/Dropdown, ContextMenu (W5) ต้องมี behavior module ของตัวเอง (`_menu-focus.ts` หรือ
เทียบเท่า) แยกจากไฟล์นี้เด็ดขาด แม้จะแชร์ helper ระดับต่ำกว่า (เช่น `expectHitArea`) จาก
`_helpers.ts` ร่วมกันได้

## Contract ที่ Listbox family ทุกตัวต้องมี (import จาก `_roving-focus.ts`)

1. **Roving tabindex** — มีแค่ 1 option ที่ `tabindex="0"` ในแต่ละเวลา (ตัวที่ active) ตัวอื่นทั้งหมด
   `tabindex="-1"` — Tab เข้า/ออก widget ครั้งเดียว ไม่ต้อง Tab ผ่านทุก option
2. **Arrow Down/Up** — ย้าย active option ไปข้อถัดไป/ก่อนหน้า, **ห้าม wrap รอบ** (อยู่ตัวสุดท้ายแล้ว
   กด Down ต่อ = ไม่ขยับ) ยกเว้น component นั้นออกแบบให้ wrap ชัดเจนและ note เหตุผลไว้
3. **Home/End** — กระโดดไป option แรก/สุดท้ายทันที
4. **Typeahead** — พิมพ์ตัวอักษร (ไม่กด modifier) ภายในเวลาสั้นๆ (~500ms ต่อเนื่อง = คำเดียวกัน)
   กระโดดไป option แรกที่ label ขึ้นต้นด้วยตัวนั้น (case-insensitive) พิมพ์ตัวเดิมซ้ำ = เลื่อนไป
   ตัวถัดไปที่ match (cycle)
5. **Scroll-into-view** — ถ้า active option อยู่นอก viewport ของ container (scrollable list) ต้อง
   scroll ให้เห็นอัตโนมัติเมื่อ arrow ไปถึง — jsdom ไม่มี scroll behavior จริง ต้อง verify ด้วย
   Playwright เท่านั้น
6. **`role="option"` + `aria-selected`** — ไม่ใช่ `role="menuitem"` เด็ดขาด แต่ละ option ต้องมี
   `aria-selected="true"/"false"` ที่ sync กับ state จริง (ไม่ใช่ CSS class อย่างเดียว)
7. **Escape (เมื่ออยู่ใน popup)** — ปิด popup ที่ครอบ + คืน focus ให้ trigger — ใช้
   `expectFocusRestored` จาก `_helpers.ts` ร่วมกับ helper ของไฟล์นี้
8. **Tab-out** — Tab จาก listbox ต้องออกจาก widget ทั้งชุด (ไปยัง element ถัดไปในหน้า) ไม่ใช่ไล่ทีละ
   option

## วิธีใช้ (ตัวอย่างจาก Listbox เอง — ตัวอื่น pattern เดียวกัน)

```ts
import { test } from '@playwright/test';
import { story, expectFocusRestored } from '../_helpers';
import {
  expectRovingTabindex,
  expectArrowNavigation,
  expectHomeEnd,
  expectTypeahead,
  expectScrollIntoView,
} from '../_roving-focus';

test('Listbox: roving tabindex ถูกต้อง', async ({ page }) => {
  await page.goto(story('selection-listbox--default'));
  await expectRovingTabindex(page, page.getByRole('option'));
});

test('Listbox: Arrow Down/Up ไม่ wrap', async ({ page }) => {
  await page.goto(story('selection-listbox--default'));
  await expectArrowNavigation(page, page.getByRole('option'), { wrap: false });
});

// Select/Combobox/MultiSelect ในเวฟเดียวกัน — เรียก helper ชุดเดียวกันนี้ ไม่ใช่เขียนใหม่:
// await expectRovingTabindex(page, page.getByRole('option')); ก็ใช้ได้ทันทีถ้า DOM structure
// เป็น listbox-pattern มาตรฐาน (ดู argument options ของแต่ละ helper ใน _roving-focus.ts)
```

## เมื่อไหร่ที่ "เขียนใหม่" ได้ (ไม่ใช่ก๊อป)

ถ้า component ใหม่มี edge case ที่ helper เดิมไม่ครอบ (เช่น MultiSelect ที่ Enter ไม่ปิด popup
เพราะเลือกได้หลายค่า) ให้**เพิ่ม parameter ใหม่ให้ helper เดิม** (เช่น `expectArrowNavigation(page,
items, { wrap: false, closeOnEnter: false })`) ไม่ใช่ copy ทั้งฟังก์ชันไปแก้แยก — ถ้า parameter
ใหม่ทำให้ helper ซับซ้อนเกินไป ให้หารือก่อนแยกเป็นไฟล์ใหม่ (ไม่ใช่เดาเอง)
