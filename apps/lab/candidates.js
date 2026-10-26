// Layout Lab candidates — agent เขียนไฟล์นี้ / เพิ่ม candidate ใหม่เป็น key ใหม่
// locked: true = baseline ปัจจุบันของระบบ (เทียบ regression กับตัวนี้)
//
// dial-braun-rederivation order — variant-foundry run, 2026-08-13 (apps/lab/foundry/report-2026-08-13.md)
// All three niches share the SAME real D-028 color tokens (measured from system/refs/braun-catalog-reference.png)
// — only depth (shadowRaised/shadowInset) and radius/border vary per niche, per system/FORM.md (D-030).
window.LAB_CANDIDATES = {
  "A — current-flat (baseline)": {
    locked: true,
    paper: "#F1F0E8", card: "#F7F6EF", ink: "#10100B", sub: "#4D4C46",
    accent: "#BA490A", onAccent: "#FFFFFF",
    radius: "12px", border: "1px solid #8D8C86",
    shadowRaised: "none", shadowInset: "none",
    font: "system-ui, sans-serif",
    spec: "Dial's shipped form language, unchanged — flat fill, hairline border, zero depth token. Colors are D-028's re-derived values (measured from the reference), but silhouette/depth are pre-this-order. This is the generic-attractor baseline every other niche is judged against, per form-language/references/evasion-form.md."
  },
  "B — FORM.md-faithful": {
    locked: false,
    paper: "#F1F0E8", card: "#F7F6EF", ink: "#10100B", sub: "#4D4C46",
    accent: "#BA490A", onAccent: "#FFFFFF",
    radius: "12px", border: "1px solid #8D8C86",
    shadowRaised: "1px 2px 3px 0px #1D1C1726",
    shadowInset: "inset 0px 1px 2px 0px #1D1C1726",
    font: "system-ui, sans-serif",
    spec: "system/FORM.md (D-030) applied literally: control class gets shadow.raised.sm at rest / shadow.inset.sm when pressed (a single directional shadow, matching the measured ~15-25% cast-shadow darkening found on the actual reference image — NOT a neumorphic dual-tone gradient, since direct pixel measurement found no internal gradient on the reference's own knob fill). Corner radius unchanged (D-008's existing radius.md already sits inside the measured 10-12%-of-width ratio at Button's real size). Judge's pick for Button/Switch/Checkbox/Input — see foundry report."
  },
  "C — harder industrial": {
    locked: false,
    paper: "#F1F0E8", card: "#F7F6EF", ink: "#10100B", sub: "#4D4C46",
    accent: "#BA490A", onAccent: "#FFFFFF",
    radius: "8px", border: "2px solid #6D6C65",
    shadowRaised: "1px 3px 5px 0px #1D1C1733",
    shadowInset: "inset 0px 2px 3px 0px #1D1C1733",
    font: "system-ui, sans-serif",
    spec: "A deliberately heavier read of the same lineage: shadow.raised.md/shadow.inset.md (the stronger step), tighter radius.sm instead of radius.md, thicker resting border. Tests whether the reference supports a more mechanical reading than B. Judge's verdict: overshoots what the measured reference (a SUBTLE cast shadow, not a strong 3D render) actually supports for control/input classes — rejected in favor of B for those classes. See foundry report for Card's own separate niche-C pick (thicker border.interactive only, no depth token, per FORM.md's surface-class exemption)."
  },
  "Card — C (thicker border, surface class exempt from depth)": {
    locked: false,
    paper: "#F1F0E8", card: "#F7F6EF", ink: "#10100B", sub: "#4D4C46",
    accent: "#BA490A", onAccent: "#FFFFFF",
    radius: "12px", border: "2px solid #6D6C65",
    shadowRaised: "none", shadowInset: "none",
    font: "system-ui, sans-serif",
    spec: "Card (surface class) is explicitly exempt from any new depth token per FORM.md/D-030 — niches A and B collapsed to one candidate under novelty pressure (see foundry report) since 'FORM.md-faithful' for this class means 'unchanged'. This is the one real remaining alternative: a thicker border.interactive, matching the reference device bodies' crisper edge, without adding shadow. Judge's pick for Card."
  }
};
