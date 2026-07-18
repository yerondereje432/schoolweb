/**
 * Shown automatically by Next.js while a route segment's data is
 * loading (App Router Suspense boundary) — no wiring needed elsewhere.
 * Pure CSS animation so it paints immediately with zero JS cost.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-husss-green-950">
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_50%_40%,white,transparent_60%)]" />

      <div className="relative flex flex-col items-center">
        <div className="relative w-24 h-24">
          {/* Outer dashed gold ring, slow clockwise spin */}
          <div className="loading-ring-outer absolute inset-0 rounded-full border-2 border-dashed border-husss-gold-500/60" />
          {/* Inner solid ring, slower counter-spin, offset gap for motion cue */}
          <div className="loading-ring-inner absolute inset-3 rounded-full border-2 border-husss-gold-400/80 border-t-transparent" />
          {/* Pulsing core seal */}
          <div className="loading-core absolute inset-7 rounded-full bg-gradient-to-br from-husss-gold-400 to-husss-gold-600 shadow-[0_0_24px_rgba(245,168,0,0.45)]" />
        </div>

        <p className="loading-label eyebrow text-husss-gold-400 mt-7">
          HUSSS
        </p>
        <p className="loading-label text-white/50 text-sm mt-1">Loading…</p>
      </div>
    </div>
  );
}
