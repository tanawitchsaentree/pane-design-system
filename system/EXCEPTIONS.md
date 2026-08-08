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

### E-001: accent bar 2.99:1 (W4) — OPEN
- **ที่ไหน:** Toast, variant `default` accent bar — token `color.border.interactive` (`packages/tokens/src/component/toast.json:12`, `variant.default`) consumed ที่ `packages/react/src/components/Toast/Toast.module.css:68` (`.accent { background-color: var(--ds-toast-variant-default); }`) วัด contrast บน `color.surface.overlay` (dark theme)
- **ค่าที่วัดได้ / เกณฑ์:** 2.99:1 vs 3:1 (UI boundary minimum)
- **เหตุผลที่ยอมรับ:** เป็นแถบตกแต่ง ไม่ใช่ขอบเขตของ panel — ไม่มีข้อมูลใดที่ผู้ใช้ต้องอ่านจากขอบนี้
- **ขอบเขต:** ใช้ได้เฉพาะ element ที่ (1) เป็น decorative accent (2) ไม่ได้ทำหน้าที่แบ่งพื้นที่หรือสื่อ state (3) มี cue อื่นที่ผ่านเกณฑ์อยู่แล้วในบริเวณเดียวกัน — **ห้ามอ้างกับ border/divider/focus ring/ขอบ input เด็ดขาด**
- **ทางออกถ้าจะปิด:** ขยับ ramp step ของ accent ขึ้น 1 ขั้น แล้ววัดผลกระทบกับ token ที่ใช้ร่วม
- **วันที่ / ผู้อนุมัติ:** 2026-08-08 / qa-a11y gate (อ้างอิง D-019)
