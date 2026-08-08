# Scaling to MUI-X class — ปิด 4 ข้อกังวลด้วยกลไก
1. **ปริมาณ (100+)** → production-run: 10 waves × ~1 checkpoint/wave = user ตัดสินใจ ~10 ครั้งแทน 300 ครั้ง · resume ได้ทุก session จาก STATE
2. **ทศวรรษของ edge cases** → ไม่ไล่เก็บเอง แต่**สืบทอด**: behavior จาก React Aria/Radix/TanStack (สิบปีของ bug fix อยู่ในนั้น) + Hardening Harness ของเรา: Playwright matrix (Chromium/WebKit/Firefox × 390/1280), axe ทุก story, RTL snapshot ทุก story, IME test กับ input ทุกตัว, forced-colors snapshot
3. **X-class** → ทุกตัวใน W9-W10 มี engine ระบุใน CATALOG — เราเขียนชั้น token+UX ไม่เขียน engine · กฎ: engine ต้อง headless, MIT/Apache, ห้าม fork
4. **Trademark** → ห่ามตั้งชื่อ system ว่า Material/MUI · ศึกษาโค้ด open source ได้ ห้าม copy docs/brand
**นิยามความสำเร็จที่ซื่อสัตย์:** โครงสร้าง+a11y+docs เทียบชั้น MUI ได้จริง · ความเก๋าจาก user นับหมื่นต้องแลกด้วยการถูกใช้งานจริง — Hardening Harness คือการซื้อเวลาส่วนนั้นล่วงหน้าให้มากที่สุด
