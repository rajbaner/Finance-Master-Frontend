/**
 * AnimatedGlow
 * ─────────────────────────────────────────────────────────
 * 9 drifting orange orbs scattered across the full page.
 * 4 frosted-glass diagonal strips layered on top.
 * Pure CSS — zero JS animation cost, reduced-motion safe.
 */
export default function AnimatedGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ── BLOBS ── */}
      <div className="glow-orb-1 absolute" />
      <div className="glow-orb-2 absolute" />
      <div className="glow-orb-3 absolute" />
      <div className="glow-orb-4 absolute" />
      <div className="glow-orb-5 absolute" />
      <div className="glow-orb-6 absolute" />
      <div className="glow-orb-7 absolute" />
      <div className="glow-orb-8 absolute" />
      <div className="glow-orb-9 absolute" />
      <div className="glow-orb-10 absolute" />
      <div className="glow-orb-11 absolute" />
      <div className="glow-orb-12 absolute" />
      <div className="glow-orb-13 absolute" />
      <div className="glow-orb-14 absolute" />
      <div className="glow-orb-15 absolute" />
      <div className="glow-orb-16 absolute" />
      <div className="glow-orb-17 absolute" />
      <div className="glow-orb-18 absolute" />
      <div className="glow-orb-19 absolute" />



      {/* ── VIGNETTE — pulls edges back to dark bg ── */}
      <div className="glow-vignette absolute inset-0" />
    </div>
  );
}