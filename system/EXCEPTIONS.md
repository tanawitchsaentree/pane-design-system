# EXCEPTIONS — ทะเบียนข้อยกเว้นที่ยอมรับแบบมีเงื่อนไข
> ห้ามยอมรับค่าที่ตกเกณฑ์แบบเงียบๆ · ทุกข้อต้องมีเลข E-xxx และเกณฑ์ที่**แคบที่สุด**
> System Sheet ต้องแสดงจำนวน exception ที่ยัง open เสมอ ห้ามประกาศ "WCAG AA" ลอยๆ ขณะมีข้อค้าง

## Format
### E-{nnn}: {สั้นๆ} — OPEN | CLOSED
- **ที่ไหน:** component/token + path
- **ค่าที่วัดได้ / เกณฑ์:** เช่น 2.99:1 vs 3:1
- **เหตุผลที่ยอมรับ:** ต้องอธิบายว่าทำไมกรณีนี้ไม่กระทบผู้ใช้จริง
- **ขอบเขต (สำคัญที่สุด):** เงื่อนไขแคบที่สุดที่ทำให้ยอมรับได้ — ห้ามอ้างข้อนี้กับเคสที่ไม่เข้าเงื่อนไขทุกข้อ
- **ทางออกถ้าจะปิด:** ต้องทำอะไรถึงจะไม่ต้องมี exception นี้
- **วันที่ / ผู้อนุมัติ:**

---

### E-001: accent bar <3:1 (W4/W7) — OPEN
- **ที่ไหน:**
  - Toast, variant `default` accent bar — token `color.border.interactive` (`packages/tokens/src/component/toast.json:12`, `variant.default`) consumed ที่ `packages/react/src/components/Toast/Toast.module.css:68` (`.accent { background-color: var(--ds-toast-variant-default); }`) วัด contrast บน `color.surface.overlay` (dark theme) = 2.99:1
  - Alert, variant `default` accent bar (`border-inline-start`) — token `color.border.interactive` เดียวกัน (`packages/tokens/src/component/alert.json`, `variant.default.accent`) consumed ที่ `packages/react/src/components/Alert/Alert.module.css` วัด contrast บน `color.role.neutral.subtleBg` (dark theme) = 2.99:1 — คนละ background กับ Toast แต่โทเค็นเดียวกัน หมวดเดียวกัน (decorative accent, ไม่ใช่ panel boundary — panel boundary ของ Alert คือ `content.border` = `border.hairline`, คนละกรณี ไม่ได้อยู่ใน E-001)
- **ค่าที่วัดได้ / เกณฑ์:** 2.99:1 vs 3:1 (UI boundary minimum) — ทั้งสองที่
- **เหตุผลที่ยอมรับ:** เป็นแถบตกแต่ง ไม่ใช่ขอบเขตของ panel — ไม่มีข้อมูลใดที่ผู้ใช้ต้องอ่านจากขอบนี้ ทั้ง 2 กรณีมี non-color cue อื่นรองรับอยู่แล้ว (Toast: message text/icon, Alert: icon glyph ต่างรูปทรงต่อ variant + title/description)
- **ขอบเขต:** ใช้ได้เฉพาะ element ที่ (1) เป็น decorative accent (2) ไม่ได้ทำหน้าที่แบ่งพื้นที่หรือสื่อ state (3) มี cue อื่นที่ผ่านเกณฑ์อยู่แล้วในบริเวณเดียวกัน — **ห้ามอ้างกับ border/divider/focus ring/ขอบ input เด็ดขาด** (Card's root border ถูกตัดออกจากขอบเขตนี้แล้ว — ดูหมายเหตุด้านล่าง)
- **ทางออกถ้าจะปิด:** ขยับ ramp step ของ accent ขึ้น 1 ขั้น แล้ววัดผลกระทบกับ token ที่ใช้ร่วม (กระทบทั้ง Toast และ Alert เพราะใช้ token เดียวกัน)
- **วันที่ / ผู้อนุมัติ:** 2026-08-08 (Toast) / 2026-08-09 batch (Alert inherits, no new number) / qa-a11y gate (อ้างอิง D-019, D-021)

**หมายเหตุ (2026-08-10, pre-publish review):** Card's root border (`border.hairline` vs `surface.canvas`, 1.51:1 light / 1.24:1 dark) was reviewed against this same E-001 scope and explicitly does **not** qualify — it's the card's own outer boundary (not a decorative accent), and `surface.raised` fill alone measures ~1.06:1 against canvas (imperceptible, confirmed by screenshot), so the border was the sole boundary cue in practice. Per this entry's own scope line ("ห้ามอ้างกับ border"), no exception could be registered for it — it was fixed instead (`root.border` → `color.border.interactive`, clears 3:1 both themes; see `packages/tokens/src/component/card.json`'s `$description`). No new E-00x entry needed; total open-exception count stays at 1 (E-001).
